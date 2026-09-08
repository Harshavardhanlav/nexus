import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard/Dashboard";
import TeacherManagement from "../pages/TeacherManagement/TeacherManagement";
import Attendance from "../pages/Attendance/Attendance";
import AttendanceReports from "../pages/AttendanceReports/AttendanceReports";
import CalendarPage from "../pages/Calendar/Calendar";
import Notices from "../pages/Notices/Notices";
import Tasks from "../pages/Tasks/Tasks";
import ActivityLogs from "../pages/ActivityLogs/ActivityLogs";
import Settings from "../pages/Settings/Settings";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/teachers" element={<TeacherManagement />} />
      <Route path="/attendance" element={<Attendance />} />
      <Route path="/attendance-reports" element={<AttendanceReports />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/notices" element={<Notices />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/activity-logs" element={<ActivityLogs />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
