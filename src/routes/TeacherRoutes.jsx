import { Navigate, Route, Routes } from "react-router-dom";
import TeacherDashboard from "../pages/Teacher/TeacherDashboard/TeacherDashboard";
import TeacherMarkAttendance from "../pages/Teacher/TeacherMarkAttendance/TeacherMarkAttendance";
import TeacherMyAttendance from "../pages/Teacher/TeacherMyAttendance/TeacherMyAttendance";
import TeacherTasks from "../pages/Teacher/TeacherTasks/TeacherTasks";
import TeacherNotices from "../pages/Teacher/TeacherNotices/TeacherNotices";
import TeacherCalendar from "../pages/Teacher/TeacherCalendar/TeacherCalendar";
import TeacherProfile from "../pages/Teacher/TeacherProfile/TeacherProfile";
import TeacherSettings from "../pages/Teacher/TeacherSettings/TeacherSettings";

export function TeacherRoutes() {
  const userRole = localStorage.getItem("userRole");

  // Protect teacher routes
  if (userRole !== "teacher") {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
      <Route path="/teacher/attendance" element={<TeacherMarkAttendance />} />
      <Route path="/teacher/my-attendance" element={<TeacherMyAttendance />} />
      <Route path="/teacher/tasks" element={<TeacherTasks />} />
      <Route path="/teacher/notices" element={<TeacherNotices />} />
      <Route path="/teacher/calendar" element={<TeacherCalendar />} />
      <Route path="/teacher/profile" element={<TeacherProfile />} />
      <Route path="/teacher/settings" element={<TeacherSettings />} />
      <Route path="/" element={<Navigate to="/teacher/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/teacher/dashboard" replace />} />
    </Routes>
  );
}
