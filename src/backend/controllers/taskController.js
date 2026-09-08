const Task = require("../models/taskSchema");
const { createActivityLog } = require("./activityLogController");

const createTask = async (req, res)=> {
    try{
        const task = await Task.create(req.body);
        
        // Log the activity
        await createActivityLog(
          "Created",
          "Task",
          task._id,
          task.title,
          `Task "${task.title}" was assigned to ${task.assignedTo}`
        );
        
        res.status(201).json({
            message:"event created successfully",
            task
        });
    }catch(err) {
        res.status(500).json({
            message:"event creation falied",
            err
        })
    }

}
const deleteTask = async (req, res) => {

   try {

      const task = await Task.findByIdAndDelete(req.params.id);

      if (!task) {

         return res.status(404).json({
            message: "Task not found"
         });

      }

      // Log the activity
      await createActivityLog(
        "Deleted",
        "Task",
        task._id,
        task.title,
        `Task "${task.title}" was deleted`
      );

      res.json({
         message: "Task deleted successfully"
      });

   } catch (err) {

      res.status(500).json({
         message: err.message
      });

   }

};
const getTasks = async (req,res) => {

   const tasks = await Task.find();

   res.json(tasks);

};

const updateTask = async (req, res) => {

   try {

      const task = await Task.findByIdAndUpdate(
         req.params.id,
         req.body,
         { returnDocument: 'after' }
      );

      if (!task) {

         return res.status(404).json({
            message: "Task not found"
         });

      }

      // Log the activity
      await createActivityLog(
        "Updated",
        "Task",
        task._id,
        task.title,
        `Task "${task.title}" was updated`
      );

      res.json({
         message: "Task updated successfully",
         task
      });

   } catch (err) {

      res.status(500).json({
         message: err.message
      });

   }

};

module.exports = {
   createTask,
   getTasks,
   deleteTask,
   updateTask
};