export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function request(path, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });
    const responseText = await response.text();
    let data;

    try {
      data = responseText ? JSON.parse(responseText) : null;
    } catch {
      throw new Error(
        `API returned a non-JSON response (${response.status}). Check that the backend is deployed at ${BASE_URL}.`
      );
    }

    if (!response.ok) {
      throw new Error(data?.message || "Server error");
    }
    return data;
  } catch (error) {
    throw new Error(error.message || "Network error", { cause: error });
  }
}

export async function getDashboardSummary() {
  return request("/dashboard/summary");
}

export async function getTodayAttendanceSummary() {
  return request("/attendance/today-summary");
}

export async function getTeachers() {
  return request("/teachers");
}

export async function createTeacher(teacherData) {
  return request("/teachers/create-teacher", {
    method: "POST",
    body: JSON.stringify(teacherData),
  });
}

export async function updateTeacher(id, teacherData) {
  return request(`/teachers/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(teacherData),
  });
}

export async function getNotices() {
  return request("/notices");
}
export async function deleteTask(id) {

   const response = await fetch(
      `${BASE_URL}/tasks/${id}`,
      {
         method: "DELETE"
      }
   );

   return response.json();

}
export async function deleteNotice(id) {

   const response = await fetch(
      `${BASE_URL}/notices/${id}`,
      {
         method: "DELETE"
      }
   );

   return response.json();

}
export async function updateNotice(id, noticeData) {

   const response = await fetch(
      `${BASE_URL}/notices/${id}`,
      {
         method: "PUT",
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify(noticeData)
      }
   );

   return response.json();

}
export async function createNotice(noticeData) {
  return request("/notices/create-notice", {
    method: "POST",
    body: JSON.stringify(noticeData),
  });
}
export async function deleteCalendarDate(id) {

   const response = await fetch(
      `${BASE_URL}/calendar/${id}`,
      {
         method:"DELETE"
      }
   );

   return response.json();

}
export async function getCalendarDates() {
  return request("/calendar");
}

export async function createCalendarDate(calendarData) {
  return request("/calendar/add-date", {
    method: "POST",
    body: JSON.stringify(calendarData),
  });
}
export async function deleteTeacher(id) {

   const response = await fetch(
      `${BASE_URL}/teachers/${id}`,
      {
         method: "DELETE",
      }
   );

   const data = await response.json();

   if (!response.ok) {
      throw new Error(data.message);
   }

   return data;
}
export async function updateCalendarDate(id, calendarData) {
  return request(`/calendar/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(calendarData),
  });
}

export async function getTasks() {
  return request("/tasks");
}

export async function createTask(taskData) {
  return request("/tasks/create-task", {
    method: "POST",
    body: JSON.stringify(taskData),
  });
}

export async function updateTask(id, taskData) {
  return request(`/tasks/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(taskData),
  });
}

export async function getAttendanceRecords() {
  return request("/attendance");
}

export async function getTeacherAttendanceRecords(teacherId) {
  return request(`/attendance?teacherId=${encodeURIComponent(teacherId)}`);
}

export async function getTeacherAttendanceStatus(teacherId) {
  try {
    return await request(`/attendance/status?teacherId=${encodeURIComponent(teacherId)}`);
  } catch (error) {
    if (!error.message.includes("(404)")) throw error;

    const records = await getTeacherAttendanceRecords(teacherId);
    const today = new Date();
    const todayRecord = records.find((record) => {
      const recordDate = new Date(record.attendanceDate);
      return recordDate.toDateString() === today.toDateString();
    });
    const status = todayRecord?.status === "Present"
      ? "PRESENT"
      : todayRecord?.status === "Absent"
      ? "ABSENT"
      : "NOT_MARKED";

    return {
      status,
      attendance: todayRecord || null,
      canMarkAttendance: status === "NOT_MARKED",
      startTime: "08:00",
    };
  }
}

export async function markAttendance(attendanceData) {
  return request("/attendance/mark-attendance", {
    method: "POST",
    body: JSON.stringify(attendanceData),
  });
}

export async function getTeacherAttendanceReport(teacherId, month, year) {
  return request(`/attendance/report/${teacherId}?month=${month}&year=${year}`);
}

export async function getActivityLogs() {
  const logs = await request("/activity-logs");
  
  // Transform logs to match the frontend display format
  return logs.map((log) => ({
    id: log._id,
    type: `${log.action} ${log.entityType}`,
    title: log.entityName,
    description: log.description,
    date: log.timestamp || new Date().toISOString(),
  }));
}
