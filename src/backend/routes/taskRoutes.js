const express = require("express");
const router = express.Router();
const {
   createTask,
   getTasks,
   deleteTask,
   updateTask
} = require("../controllers/taskController");
router.post("/create-task",createTask);
router.get("/",getTasks);
router.delete("/:id", deleteTask);
router.put("/update/:id", updateTask);
module.exports = router;

