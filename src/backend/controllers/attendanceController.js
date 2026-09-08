const Attendance = require("../models/attendanceSchema");
const Teacher = require("../models/teacherSchema");
const Calendar = require("../models/calenderSchema");
const { getAttendanceConfig } = require("../config/attendanceConfig");

const getIndiaParts = (date = new Date()) => {
   const config = getAttendanceConfig();
   const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: config.timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23"
   }).formatToParts(date);

   return parts.reduce((values, part) => {
      if (part.type !== "literal") values[part.type] = part.value;
      return values;
   }, {});
};

const getIndiaDateKey = (date = new Date()) => {
   const parts = getIndiaParts(date);
   return `${parts.year}-${parts.month}-${parts.day}`;
};

const getIndiaWeekday = (date = new Date()) =>
   new Intl.DateTimeFormat("en-US", {
      timeZone: getAttendanceConfig().timeZone,
      weekday: "short"
   }).format(date);

const getIndiaDayRange = (dateKey) => {
   const [year, month, day] = dateKey.split("-").map(Number);
   const start = Date.UTC(year, month - 1, day) - (5.5 * 60 * 60 * 1000);
   return {
      start: new Date(start),
      end: new Date(start + (24 * 60 * 60 * 1000) - 1)
   };
};

const parseTime = (time) => {
   const [hours, minutes] = time.split(":").map(Number);
   return (hours * 60) + minutes;
};

const getMinutesSinceMidnight = (parts) =>
   (Number(parts.hour) * 60) + Number(parts.minute) + (Number(parts.second) / 60);

const findTodayAttendance = async (teacherId, dateKey, range) =>
   Attendance.findOne({
      teacherId,
      $or: [
         { attendanceDay: dateKey },
         { attendanceDate: { $gte: range.start, $lte: range.end } }
      ]
   }).sort({ attendanceDate: -1 });

const findHoliday = (range) => Calendar.findOne({
   eventDate: { $gte: range.start, $lte: range.end },
   dayType: "Holiday"
});

const ensureAbsentRecord = async (teacher, dateKey, range) => {
   const existing = await findTodayAttendance(teacher.teacherID, dateKey, range);
   if (existing) return existing;

   try {
      return await Attendance.findOneAndUpdate(
         { teacherId: teacher.teacherID, attendanceDay: dateKey },
         {
            $setOnInsert: {
               teacherId: teacher.teacherID,
               attendanceDate: new Date(),
               attendanceDay: dateKey,
               status: "Absent",
               latitude: null,
               longitude: null
            }
         },
         { new: true, upsert: true, runValidators: true }
      );
   } catch (error) {
      if (error.code === 11000) {
         return findTodayAttendance(teacher.teacherID, dateKey, range);
      }
      throw error;
   }
};

const getTeacherStatus = async (teacherId, { persistAbsent = true } = {}) => {
   const teacher = await Teacher.findOne({ teacherID: teacherId });
   if (!teacher) return null;

   const config = getAttendanceConfig();
   const now = new Date();
   const parts = getIndiaParts(now);
   const date = `${parts.year}-${parts.month}-${parts.day}`;
   const range = getIndiaDayRange(date);
   const base = {
      date,
      isHoliday: false,
      holidayName: null,
      attendanceStarted: false,
      attendanceCutoffPassed: false,
      canMarkAttendance: false,
      requiresLocation: false,
      startTime: config.startTime,
      cutoffTime: config.cutoffTime
   };

   if (getIndiaWeekday(now) === "Sun") {
      return { ...base, status: "HOLIDAY", isHoliday: true, holidayName: "Sunday" };
   }

   const holiday = await findHoliday(range);
   if (holiday) {
      return {
         ...base,
         status: "HOLIDAY",
         isHoliday: true,
         holidayName: holiday.title || holiday.description || "Holiday"
      };
   }

   const attendance = await findTodayAttendance(teacherId, date, range);
   if (attendance) {
      return {
         ...base,
         status: attendance.status === "Present" ? "PRESENT" : "ABSENT",
         attendanceStarted: true,
         attendanceCutoffPassed: attendance.status !== "Present",
         attendance
      };
   }

   const currentMinutes = getMinutesSinceMidnight(parts);
   const startMinutes = parseTime(config.startTime);
   const cutoffMinutes = parseTime(config.cutoffTime);

   if (currentMinutes < startMinutes) {
      return { ...base, status: "NOT_STARTED" };
   }

   if (currentMinutes >= cutoffMinutes) {
      const absent = persistAbsent
         ? await ensureAbsentRecord(teacher, date, range)
         : null;
      return {
         ...base,
         status: "ABSENT",
         attendanceStarted: true,
         attendanceCutoffPassed: true,
         attendance: absent
      };
   }

   return {
      ...base,
      status: "NOT_MARKED",
      attendanceStarted: true,
      canMarkAttendance: true,
      requiresLocation: true
   };
};

const calculateDistance = (latitude, longitude, targetLatitude, targetLongitude) => {
   const earthRadius = 6371e3;
   const firstLatitude = latitude * Math.PI / 180;
   const secondLatitude = targetLatitude * Math.PI / 180;
   const deltaLatitude = (targetLatitude - latitude) * Math.PI / 180;
   const deltaLongitude = (targetLongitude - longitude) * Math.PI / 180;
   const value = Math.sin(deltaLatitude / 2) ** 2
      + Math.cos(firstLatitude) * Math.cos(secondLatitude) * Math.sin(deltaLongitude / 2) ** 2;
   return earthRadius * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
};

const autoMarkAbsentForToday = async () => {
   const config = getAttendanceConfig();
   const now = new Date();
   const parts = getIndiaParts(now);
   const date = `${parts.year}-${parts.month}-${parts.day}`;
   const range = getIndiaDayRange(date);

   if (getIndiaWeekday(now) === "Sun" || getMinutesSinceMidnight(parts) < parseTime(config.cutoffTime)) {
      return;
   }

   if (await findHoliday(range)) return;

   const teachers = await Teacher.find();
   await Promise.all(teachers.map((teacher) => ensureAbsentRecord(teacher, date, range)));
};

const getAttendanceStatus = async (req, res) => {
   try {
      const { teacherId } = req.query;
      if (!teacherId) return res.status(400).json({ message: "Teacher ID is required" });

      const status = await getTeacherStatus(teacherId);
      if (!status) return res.status(404).json({ message: "Teacher not found" });

      res.status(200).json(status);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

const markAttendance = async (req, res) => {
   try {
      const { teacherId, latitude, longitude } = req.body;
      const teacher = await Teacher.findOne({ teacherID: teacherId });
      if (!teacher) return res.status(404).json({ message: "Teacher not found" });

      const status = await getTeacherStatus(teacherId, { persistAbsent: true });
      if (!status.canMarkAttendance) {
         const messages = {
            HOLIDAY: `${status.holidayName || "Today"} - no attendance is required`,
            NOT_STARTED: `Attendance has not started. It opens at ${status.startTime}.`,
            ABSENT: "Attendance cutoff has passed. Attendance is marked Absent.",
            PRESENT: "Attendance already marked as Present."
         };
         return res.status(400).json({
            message: messages[status.status] || "Attendance cannot be marked",
            status: status.status
         });
      }

      if (!Number.isFinite(Number(latitude)) || !Number.isFinite(Number(longitude))) {
         return res.status(400).json({ message: "Current location is required before marking attendance." });
      }

      const config = getAttendanceConfig();
      const distance = calculateDistance(
         Number(latitude),
         Number(longitude),
         config.latitude,
         config.longitude
      );
      if (distance > config.radiusMeters) {
         return res.status(400).json({ message: "Attendance can only be marked from the authorized campus location." });
      }

      const date = getIndiaDateKey();
      const attendance = await Attendance.findOneAndUpdate(
         { teacherId, attendanceDay: date },
         {
            $setOnInsert: {
               teacherId,
               attendanceDate: new Date(),
               attendanceDay: date,
               status: "Present",
               latitude: Number(latitude),
               longitude: Number(longitude),
               totalWorkingDays: await Attendance.countDocuments({ status: "Present" }) + 1
            }
         },
         { new: true, upsert: true, runValidators: true }
      );

      if (attendance.status !== "Present") {
         return res.status(400).json({ message: "Attendance has already been recorded for today." });
      }

      res.status(201).json({ message: "Attendance Marked", attendance, status: "PRESENT", date });
   } catch (error) {
      if (error.code === 11000) {
         return res.status(400).json({ message: "Attendance already marked" });
      }
      res.status(500).json({ message: error.message });
   }
};

const getAttendance = async (req, res) => {
   try {
      await autoMarkAbsentForToday();
      const filter = {};
      if (req.query.teacherId) filter.teacherId = req.query.teacherId;
      const attendance = await Attendance.find(filter).sort({ attendanceDate: -1 });
      res.status(200).json(attendance);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

const getTodaySummary = async (req, res) => {
   try {
      await autoMarkAbsentForToday();
      const range = getIndiaDayRange(getIndiaDateKey());
      const todayAttendance = await Attendance.find({ attendanceDate: { $gte: range.start, $lte: range.end } });
      const present = todayAttendance.filter((record) => record.status === "Present").length;
      const absent = todayAttendance.filter((record) => record.status === "Absent").length;
      const total = present + absent;
      res.status(200).json({
         present,
         absent,
         total,
         percentage: total === 0 ? 0 : Number(((present / total) * 100).toFixed(2))
      });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

const getTeacherAttendanceReport = async (req, res) => {
   try {
      await autoMarkAbsentForToday();
      const { teacherId } = req.params;
      const month = parseInt(req.query.month, 10);
      const year = parseInt(req.query.year, 10);
      if (!teacherId) return res.status(400).json({ message: "Teacher ID is required" });
      if (Number.isNaN(month) || month < 0 || month > 11) return res.status(400).json({ message: "Invalid month" });
      if (Number.isNaN(year) || year < 2020) return res.status(400).json({ message: "Invalid year" });

      const startKey = `${year}-${String(month + 1).padStart(2, "0")}-01`;
      const nextMonth = month === 11 ? `${year + 1}-01-01` : `${year}-${String(month + 2).padStart(2, "0")}-01`;
      const startRange = getIndiaDayRange(startKey);
      const endRange = getIndiaDayRange(nextMonth);
      const end = new Date(endRange.start.getTime() - 1);
      const presentDays = await Attendance.countDocuments({
         teacherId,
         status: "Present",
         attendanceDate: { $gte: startRange.start, $lte: end }
      });
      const holidays = await Calendar.countDocuments({
         dayType: "Holiday",
         eventDate: { $gte: startRange.start, $lte: end }
      });
      const totalDays = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
      let sundays = 0;
      for (let day = 1; day <= totalDays; day += 1) {
         if (new Date(Date.UTC(year, month, day)).getUTCDay() === 0) sundays += 1;
      }
      const totalWorkingDays = Math.max(totalDays - sundays - holidays, 0);
      res.status(200).json({
         teacherId,
         presentDays,
         totalWorkingDays,
         attendancePercentage: totalWorkingDays > 0 ? Number(((presentDays / totalWorkingDays) * 100).toFixed(2)) : 0
      });
   } catch (error) {
      res.status(500).json({ message: error.message || "Error fetching attendance report" });
   }
};

module.exports = {
   markAttendance,
   getAttendance,
   getTeacherAttendanceReport,
   getTodaySummary,
   getAttendanceStatus,
   autoMarkAbsentForToday
};
