# Available APIs for Admin Dashboard Integration

## Summary of Endpoints

### Core Stats Endpoints (Direct from Backend)

#### 1. **Students Count**
- **Endpoint**: `GET /api/students/`
- **Permission**: Admin only (IsClientUser)
- **Response**: Paginated student list with count
- **Key Fields**: Full list of all students

#### 2. **Teachers Count**
- **Endpoint**: `GET /api/teachers/`
- **Permission**: Admin only
- **Response**: Paginated teacher list with count
- **Key Fields**: Full list of all teachers

#### 3. **Classes Count**
- **Endpoint**: `GET /api/class-sessions/`
- **Permission**: Admin/Teacher (IsAdminOrTeacher)
- **Response**: Paginated class sessions
- **Key Fields**: All class sessions with date, subject, status

#### 4. **Today's Attendance Rate**
- **Endpoint**: `GET /api/attendance/`
- **Permission**: Authenticated (role-based filtering)
- **Response**: Paginated attendance records
- **Key Fields**: Status (PRESENT/ABSENT), marked_at timestamp
- **Calculation**: Count PRESENT records for today / Total enrollments × 100

#### 5. **Recent Activity**
- **Endpoint**: `GET /api/attendance/`
- **Query Params**: None needed (role-based auto-filter)
- **Sorting**: By `-marked_at` (most recent first)
- **Response**: Latest attendance records with:
  - Student name & email
  - Status (PRESENT/ABSENT/LATE)
  - Time marked
  - Class session details

#### 6. **Weekly Attendance Trend**
- **Endpoint**: `GET /api/attendance/`
- **Query Params**: Filter by date range (last 7 days)
- **Calculation**: Group by date, calculate daily average attendance %
- **Response**: Array of daily attendance rates

#### 7. **Suspicious Activity (Future)**
- **Endpoint**: `GET /api/attendance-logs/suspicious_activity/`
- **Permission**: Admin only
- **Response**: Flagged attendance records with:
  - Low confidence matches
  - High face distance
  - Failed liveness checks
  - Impossible location distances

---

## Implementation Plan

### Stage 1: Dashboard Stats (Static → Dynamic)
Replace hardcoded stats with real API calls:

```typescript
// Before (Static)
const stats = [
  { label: "Total Students", value: "1,234", ... },
  { label: "Total Teachers", value: "56", ... },
  ...
];

// After (Dynamic)
const [stats, setStats] = useState([]);

useEffect(() => {
  const totalStudents = await getAllStudentsFn();
  const totalTeachers = await getAllTeachersFn();
  const classSessions = await getAllClassSessionsFn();
  const attendanceToday = await getTodayAttendance();
  // Calculate and setStats
}, []);
```

### Stage 2: Recent Activity (Mock → Real)
Replace hardcoded activity list with API data:

```typescript
// Fetch latest attendance records
const recentAttendance = await getRecentAttendanceFn(limit: 10);
```

### Stage 3: Weekly Trend (Chart)
Fetch and visualize last 7 days of attendance data:

```typescript
// Calculate daily averages for past 7 days
const weeklyData = await getWeeklyAttendanceTrendFn();
```

---

## Service Methods to Create

### In `attendance.service.ts`:
1. `getTodayAttendanceFn()` - Get today's attendance rate
2. `getWeeklyAttendanceTrendFn()` - Get past 7 days attendance
3. `getRecentAttendanceFn(limit)` - Get recent activity

### In new `dashboard.service.ts`:
1. `getDashboardStatsFn()` - Aggregate all stats
2. `getDashboardActivityFn()` - Get recent activity
3. `getDashboardTrendFn()` - Get weekly/monthly trends

---

## API Response Structures Expected

### Attendance List Response
```json
{
  "count": 1234,
  "next": "...",
  "results": [
    {
      "id": "uuid",
      "student": "uuid",
      "student_detail": {
        "email": "user@example.com",
        "name": "John Doe",
        "roll_number": "CS001"
      },
      "class_session": "uuid",
      "class_session_detail": {
        "class_name": "CS101-A",
        "date": "2024-01-15"
      },
      "status": "PRESENT",
      "marked_at": "2024-01-15T09:15:00Z",
      "verification_log": {
        "face_confidence": 0.95,
        "liveness_passed": "PASS"
      }
    }
  ]
}
```

---

## Database Schema for Calculations

### Students Table
- `id` (UUID, PK)
- `user_id` (FK → CustomUser)
- `roll_number` (string)
- `department` (string)
- `year` (int)

### Teachers Table
- `id` (UUID, PK)
- `user_id` (FK → CustomUser)
- `employee_id` (string)

### ClassSession Table
- `id` (UUID, PK)
- `subject_id` (FK → Subject)
- `class_name` (string)
- `date` (date)
- `start_time` (time)
- `end_time` (time)

### Attendance Table
- `id` (UUID, PK)
- `student_id` (FK → StudentProfile)
- `class_session_id` (FK → ClassSession)
- `status` (PRESENT/ABSENT/LATE)
- `marked_at` (timestamp)
- `created_at` (timestamp)

### Enrollment Table
- `id` (UUID, PK)
- `student_id` (FK → StudentProfile)
- `subject_id` (FK → Subject)

---

## Notes

1. **Admin-only access**: All dashboard APIs require admin permissions via `IsClientUser` permission class
2. **Real-time data**: Attendance data updates as students mark attendance
3. **Efficient queries**: Use select_related() and prefetch_related() for performance
4. **Date filtering**: ISO format `YYYY-MM-DD` for date ranges
5. **Pagination**: Default page_size might need customization for summary stats
