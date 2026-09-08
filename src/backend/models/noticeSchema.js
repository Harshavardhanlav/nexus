const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({

   title: {
      type: String,
      required: true
   },

   message: {
      type: String,
      required: true
   },

   postedBy: {
      type: String,
      default: "Admin"
   },

   priority: {
      type: String,
      default: "Normal"
   }

}, {
   timestamps: true
});

module.exports = mongoose.model("notice", noticeSchema);