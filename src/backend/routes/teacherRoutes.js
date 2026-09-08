const express = require("express");

const router = express.Router();

const {
   createTeacher,
   teacherLogin,
   getTeachers,
   deleteTeacher,
   updateTeacher
} = require("../controllers/teacherController");

router.post("/create-teacher", createTeacher);
router.post("/teacher-login", teacherLogin);
router.get("/", getTeachers);
router.delete("/:id", deleteTeacher);
router.put("/update/:id", updateTeacher);
module.exports = router;