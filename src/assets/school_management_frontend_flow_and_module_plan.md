# School Staff Management System
## Frontend Flow & Module Planning

---

# 1. Complete Website Flow

```text
Website Opens
      ↓
Check Admin Exists
      ↓
┌─────────────────────────────┐
│ No Admin Found              │
│ → Show Admin Registration   │
└─────────────────────────────┘
      ↓
Admin Created Successfully
      ↓
Redirect To Login Page
      ↓
┌─────────────────────────────┐
│ Login Page                  │
│ Role Selection              │
│ - Admin                     │
│ - Teacher                   │
└─────────────────────────────┘
      ↓
┌─────────────────────────────┐
│ Admin Login                 │
│ → Admin Dashboard           │
└─────────────────────────────┘

OR

┌─────────────────────────────┐
│ Teacher Login               │
│ → Teacher Dashboard         │
└─────────────────────────────┘
```

---

# 2. Main Frontend Pages

| Page | User | Purpose |
|---|---|---|
| Admin Registration | Admin | Create first admin only once |
| Login Page | Admin & Teacher | Login into system |
| Admin Dashboard | Admin | Main control panel |
| Teacher Dashboard | Teacher | Main teacher home page |
| Calendar Page | Admin & Teacher | View holidays/events |
| Teacher Management | Admin | Add and manage teachers |
| Attendance Page | Teacher | Mark attendance |
| Attendance Reports | Admin & Teacher | View attendance reports |
| Notices Page | Admin & Teacher | View school notices |
| Tasks Page | Admin & Teacher | Manage/view tasks |
| Change Password | Teacher | Update own password |

---

# 3. Admin Module

## Purpose
Admin controls the complete school management system.

---

## Features To Implement

### 1. Admin Registration
- Only visible first time
- Create first admin account

---

### 2. Admin Login
- Login with username/password
- Redirect to admin dashboard

---

### 3. Admin Dashboard

## Dashboard Should Show
- Total teachers
- Today attendance count
- Upcoming events
- Quick action buttons

---

### 4. Teacher Management

## Features
- Add teacher
- View teachers
- Reset teacher password

---

### 5. Calendar Management

## Features
- View monthly calendar
- Add holidays
- Add events
- Convert Sunday into working day
- Edit dates/events

---

### 6. Attendance Reports

## Features
- Teacher attendance percentage
- Monthly reports
- Present days
- Working days

---

### 7. Notices Management

## Features
- Create notices
- View notices

---

### 8. Tasks Management

## Features
- Create tasks
- Assign tasks to teachers
- View tasks

---

# 4. Teacher Module

## Purpose
Teacher mainly uses the system for attendance and viewing school updates.

---

## Features To Implement

### 1. Teacher Login
- Login with teacher ID/password
- Redirect to teacher dashboard

---

### 2. Teacher Dashboard

## Dashboard Should Show
- Attendance status
- Notices
- Tasks
- Upcoming events

---

### 3. Mark Attendance

## Features
- One click attendance
- Uses location
- Attendance blocked on holidays/Sundays
- Attendance allowed on working days

---

### 4. Attendance Report

## Features
- Monthly attendance percentage
- Present days
- Working days

---

### 5. Notices Page

## Features
- View school notices

---

### 6. Tasks Page

## Features
- View assigned tasks

---

### 7. Change Password

## Features
- Teacher changes personal password
- Admin cannot view password

---

# 5. Calendar Logic

## Default Rules
- Sundays are holidays
- Admin can make Sunday working day
- Admin can add holidays/events

---

## Attendance Logic

```text
Check Current Date
        ↓
Is Date In Calendar?
        ↓
YES
  ↓
Check dayType
  ↓
Holiday → Attendance Blocked
Working → Attendance Allowed

NO
 ↓
Is Sunday?
 ↓
YES → Block Attendance
NO → Allow Attendance
```

---

# 6. Backend APIs Used In Frontend

| Feature | API |
|---|---|
| Create Admin | /admin/create-admin |
| Create Teacher | /teachers/create-teacher |
| Mark Attendance | /attendance/mark-attendance |
| Attendance Report | /attendance/report/:teacherId |
| Add Calendar Date | /calendar/add-date |
| Get Calendar Dates | /calendar |
| Update Calendar | /calendar/update/:id |
| Create Task | /tasks/create-task |
| Create Notice | /notices/create-notice |

---

# 7. Recommended Frontend Build Order

## STEP 1
- Login Page
- Admin Registration

---

## STEP 2
- Admin Dashboard
- Teacher Dashboard

---

## STEP 3
- Calendar Module

---

## STEP 4
- Attendance Module

---

## STEP 5
- Notices & Tasks

---

## STEP 6
- Reports & Analytics

---

# 8. Technology Stack

| Part | Technology |
|---|---|
| Frontend | React JS |
| Backend | Node JS + Express JS |
| Database | MongoDB |
| API Testing | Thunder Client/Postman |

---

# 9. Team Work Suggestion

| Team Member | Suggested Work |
|---|---|
| Member 1 | Login & Authentication UI |
| Member 2 | Calendar UI |
| Member 3 | Attendance UI |
| Member 4 | Notices & Tasks UI |
| Member 5 | CSS & Responsive Design |

---

# 10. Final Goal

Build a simple school staff management system where:
- Admin manages teachers/calendar/tasks/notices
- Teachers mark attendance and view updates
- Attendance reports are automatically calculated
- Calendar controls holidays and working days

