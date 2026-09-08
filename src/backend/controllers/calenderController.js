const Calendar = require("../models/calenderSchema");
const { createActivityLog } = require("./activityLogController");

const addCalendarDate = async (req, res) => {

   try {

      const { eventDate } = req.body;

      const existingDate = await Calendar.findOne({
         eventDate
      });

      if(existingDate){

         return res.status(400).json({
            message: "Date already exists"
         });

      }

      const newDate = await Calendar.create(req.body);

      // Log the activity
      const eventTitle = newDate.title || "Calendar Event";
      await createActivityLog(
        "Created",
        "Event",
        newDate._id,
        eventTitle,
        `Event "${eventTitle}" was created on ${new Date(eventDate).toLocaleDateString()}`
      );

      res.status(201).json({
         message: "Calendar date added",
         newDate
      });

   } catch(err){

      res.status(500).json({
         message: err.message
      });

   }

};

const getCalendarDates = async (req, res) => {

   try {

      const dates = await Calendar.find();

      res.status(200).json(dates);

   } catch(err){

      res.status(500).json({
         message: err.message
      });

   }

};

const updateCalendarDate = async (req, res) => {

   try {

      const updatedDate = await Calendar.findByIdAndUpdate(

         req.params.id,

         req.body,

         { returnDocument: 'after' }

      );

      // Log the activity
      const eventTitle = updatedDate.title || "Calendar Event";
      await createActivityLog(
        "Updated",
        "Event",
        updatedDate._id,
        eventTitle,
        `Event "${eventTitle}" was updated`
      );

      res.status(200).json({
         message: "Calendar updated",
         updatedDate
      });

   } catch(err){

      res.status(500).json({
         message: err.message
      });
   }

};
const deleteCalendarDate = async (req,res) => {

   try {

      const event = await Calendar.findByIdAndDelete(
         req.params.id
      );

      // Log the activity
      const eventTitle = event.title || "Calendar Event";
      await createActivityLog(
        "Deleted",
        "Event",
        event._id,
        eventTitle,
        `Event "${eventTitle}" was deleted`
      );

      res.json({
         message:"Deleted"
      });

   } catch(err) {

      res.status(500).json({
         message:err.message
      });

   }

}
module.exports = {

   addCalendarDate,
   getCalendarDates,
   updateCalendarDate,
   deleteCalendarDate

};