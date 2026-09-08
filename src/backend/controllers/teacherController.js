const Teacher = require("../models/teacherSchema");
const { createActivityLog } = require("./activityLogController");

const createTeacher = async (req,res) => {
    try{
        const teacher = await Teacher.create(req.body);
        
        // Log the activity
        await createActivityLog(
          "Created",
          "Teacher",
          teacher._id,
          teacher.fullName,
          `Teacher ${teacher.fullName} (ID: ${teacher.teacherID}) was created`
        );
        
        res.status(201).json({
            message:"teacher created successfully",
            teacher
        });
    }catch(err) {
            res.status(500).json({
                message:err.message
            })
    }
}
const teacherLogin = async (req,res) => {

   const teacher = await Teacher.findOne({
      teacherID: req.body.teacherID
   });

   if(!teacher){

      return res.json({
         success: false,
         message: "Teacher not found"
      });

   }

   if(teacher.password !== req.body.password){

      return res.json({
         success: false,
         message: "Password not matched"
      });

   }

   res.json({
      success: true,
      message: "Login Successful",
      teacher: {
         _id: teacher._id,
         teacherID: teacher.teacherID,
         fullName: teacher.fullName,
         subjects: teacher.subjects,
         designation: teacher.designation,
         mobile: teacher.mobile,
         profilePic: teacher.profilePic,
         role: teacher.role
      }
   });

};
const getTeachers = async (req,res) => {

   const teachers = await Teacher.find();

   res.json(teachers);

};
const deleteTeacher = async (req, res) => {

   console.log("DELETE REQUEST RECEIVED");
   console.log(req.params.id);

   try {
      const teacher = await Teacher.findByIdAndDelete(req.params.id);

      if (!teacher) {
         return res.status(404).json({
            message: "Teacher not found"
         });
      }

      // Log the activity
      await createActivityLog(
        "Deleted",
        "Teacher",
        teacher._id,
        teacher.fullName,
        `Teacher ${teacher.fullName} (ID: ${teacher.teacherID}) was deleted`
      );

      res.json({
         message: "Teacher deleted successfully"
      });

   } catch (err) {
      console.log(err);

      res.status(500).json({
         message: err.message
      });
   }
};

const updateTeacher = async (req, res) => {

   try {

      const teacher = await Teacher.findByIdAndUpdate(
         req.params.id,
         req.body,
         { returnDocument: 'after' }
      );

      if (!teacher) {

         return res.status(404).json({
            message: "Teacher not found"
         });

      }

      // Log the activity
      await createActivityLog(
        "Updated",
        "Teacher",
        teacher._id,
        teacher.fullName,
        `Teacher ${teacher.fullName} (ID: ${teacher.teacherID}) was updated`
      );

      res.json({
         message: "Teacher updated successfully",
         teacher
      });

   } catch (err) {

      res.status(500).json({
         message: err.message
      });

   }

};

module.exports = {
   createTeacher,
   teacherLogin,
   getTeachers,
   deleteTeacher,
   updateTeacher
};