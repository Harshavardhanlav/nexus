const mongoose = require("mongoose");

const calendarSchema = new mongoose.Schema({

   title: {
      type: String
   },

   description: {
      type: String
   },

   eventDate: {
      type: Date,
      required: true,
      unique: true
   },

   dayType: {
      type: String,
      enum: ["Working", "Holiday"],
      default: "Working"
   },

   hasEvent: {
      type: Boolean,
      default: false
   },

   createdBy: {
      type: String,
      default: "Admin"
   }

}, {
   timestamps: true
});

module.exports = mongoose.model("Calendar", calendarSchema);