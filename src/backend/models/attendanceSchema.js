const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({

   teacherId: {
      type: String,
      required: true
   },

   attendanceDate: {
      type: Date,
      required: true
   },

   attendanceDay: {
      type: String
   },

   status: {
      type: String,
      default: "Present"
   },

   totalWorkingDays: {
      type: Number,
      default: 0
   },

   latitude: {
      type: Number,
      default: null
   },

   longitude: {
      type: Number,
      default: null
   }

}, {
   timestamps: true
});

attendanceSchema.index(
   { teacherId: 1, attendanceDay: 1 },
   { unique: true, sparse: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);