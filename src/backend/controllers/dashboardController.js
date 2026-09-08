const Teacher = require("../models/teacherSchema");
const Task = require("../models/taskSchema");
const Notice = require("../models/noticeSchema");
const Calendar = require("../models/calenderSchema");

const getDashboardSummary = async (req, res) => {

   try {

      const teacherCount = await Teacher.countDocuments();

      const pendingTasks = await Task.countDocuments({
         status: "Pending"
      });

      const noticeCount = await Notice.countDocuments();

      const eventCount = await Calendar.countDocuments({
         hasEvent: true
      });

      res.status(200).json({
         teacherCount,
         pendingTasks,
         noticeCount,
         eventCount
      });

   } catch (error) {

      res.status(500).json({
         message: error.message
      });

   }

};

module.exports = {
   getDashboardSummary
};