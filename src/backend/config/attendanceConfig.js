const getAttendanceConfig = () => ({
  timeZone: "Asia/Kolkata",
  startTime: process.env.ATTENDANCE_START_TIME || "08:00",
  cutoffTime: process.env.ATTENDANCE_CUTOFF_TIME || "09:00",
  latitude: Number(process.env.ATTENDANCE_LATITUDE || 17.694422),
  longitude: Number(process.env.ATTENDANCE_LONGITUDE || 83.002305),
  radiusMeters: Number(process.env.ATTENDANCE_RADIUS_METERS || 100),
});

module.exports = { getAttendanceConfig };
