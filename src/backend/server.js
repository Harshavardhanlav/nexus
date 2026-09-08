const express = require("express");
const PORT = 5000;
const cors = require("cors");
const ConnectDB = require("./config/db");
const dotenv = require("dotenv");
const teacherRoutes = require("./routes/teacherRoutes");
const taskRoutes = require("./routes/taskRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const adminRoutes = require("./routes/adminRoutes");
const calenderRoutes = require("./routes/calenderRoutes");
const attendaceRoutes = require("./routes/attendanceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const activityLogRoutes = require("./routes/activityLogRoutes");
const { autoMarkAbsentForToday } = require("./controllers/attendanceController");

dotenv.config();
console.log(process.env.MONGO_URI);
const app = express();
app.use(express.json());
app.use(cors());
app.use("/teachers", teacherRoutes);
app.use("/calendar", calenderRoutes);
app.use("/tasks", taskRoutes);
app.use("/notices", noticeRoutes);
app.use("/admin", adminRoutes);
app.use("/attendance", attendaceRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/activity-logs", activityLogRoutes);
app.get("/", (req, res) => {
  res.send("Backend is running sucessfully");
});

const scheduleAutoMarkAbsent = async () => {
  const run = async () => {
    try {
      await autoMarkAbsentForToday();
    } catch (error) {
      console.error("autoMarkAbsentForToday failed:", error);
    }
  };

  await run();
  setInterval(run, 60 * 1000);
};

dotenv.config();

ConnectDB()
  .then(() => {
    console.log("MongoDB Connected");

    scheduleAutoMarkAbsent();

    app.listen(PORT, () => {
      console.log("server is running");
      console.log("server is running on port",PORT)
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Failed:", err);
  });