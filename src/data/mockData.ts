// Centralized mock data — edit/add fields freely.
// Replace with real API calls (see README "Connecting to the District API").

export const student = {
  firstName: "Alex",
  lastName: "Johnson",
  studentId: "1029384",
  stateId: "LA-558392011",
  grade: "10th Grade",
  school: "Lincoln High School",
  homeroom: "Room 204 — Mrs. Davis",
  busNumber: "Bus #47",
  busRoute: "Route 12 — North Loop",
  lockerNumber: "B-318",
  lockerCombo: "12-24-36",
  counselor: "Mr. Thompson",
  enrollmentDate: "2023-08-14",
  photoUrl: "",
};

export const grades = {
  // Add/remove courses freely
  courses: [
    {
      name: "English II",
      teacher: "Ms. Carter",
      nineWeeks: [92, 88, 90, 94],
      tests: [
        { name: "Unit 1 Exam", score: 91 },
        { name: "Midterm", score: 87 },
        { name: "Essay Project", score: 95 },
      ],
    },
    {
      name: "Algebra II",
      teacher: "Mr. Reyes",
      nineWeeks: [85, 82, 88, 90],
      tests: [
        { name: "Chapter 3 Test", score: 84 },
        { name: "Midterm", score: 79 },
      ],
    },
    {
      name: "Biology",
      teacher: "Dr. Patel",
      nineWeeks: [78, 84, 80, 86],
      tests: [
        { name: "Cells Quiz", score: 82 },
        { name: "Genetics Exam", score: 88 },
      ],
    },
    {
      name: "World History",
      teacher: "Mr. Boudreaux",
      nineWeeks: [90, 92, 89, 93],
      tests: [{ name: "WWI Test", score: 94 }],
    },
  ],
};

export const attendance = {
  totalDays: 124,
  present: 118,
  unexcused: [
    { date: "2025-09-12", reason: "No note submitted" },
    { date: "2025-10-03", reason: "No note submitted" },
  ],
  excused: [
    { date: "2025-08-29", reason: "Doctor's appointment" },
    { date: "2025-09-25", reason: "Family emergency" },
    { date: "2025-10-17", reason: "Illness — note on file" },
  ],
  checkOuts: [
    { date: "2025-09-08", time: "1:45 PM", reason: "Orthodontist" },
    { date: "2025-10-21", time: "11:30 AM", reason: "Parent pickup" },
  ],
  tardies: [{ date: "2025-09-19", time: "8:12 AM" }],
};

export const discipline = {
  majorOffenses: [
    {
      date: "2025-09-30",
      offense: "Disruption of class",
      consequence: "Saturday Detention",
      status: "Served",
    },
  ],
  minorOffenses: [
    { date: "2025-10-05", offense: "Tardy to class (3rd)", consequence: "After-school detention" },
  ],
  notes: "Contact Asst. Principal Walker for questions.",
};

export const schedule = {
  semester: "Fall 2025 — Semester 1",
  current: [
    { period: 1, time: "8:00 – 8:55", course: "English II", room: "204", teacher: "Ms. Carter" },
    { period: 2, time: "9:00 – 9:55", course: "Algebra II", room: "112", teacher: "Mr. Reyes" },
    { period: 3, time: "10:00 – 10:55", course: "Biology", room: "Lab 3", teacher: "Dr. Patel" },
    { period: 4, time: "11:00 – 11:55", course: "World History", room: "210", teacher: "Mr. Boudreaux" },
    { period: 5, time: "12:30 – 1:25", course: "PE", room: "Gym", teacher: "Coach Lee" },
    { period: 6, time: "1:30 – 2:25", course: "Spanish I", room: "118", teacher: "Sra. Ortiz" },
    { period: 7, time: "2:30 – 3:25", course: "Art I", room: "Studio", teacher: "Mrs. Hall" },
  ],
  alternate: [
    { period: 1, time: "8:00 – 8:45", course: "English II", room: "204", teacher: "Ms. Carter" },
    { period: 2, time: "8:50 – 9:35", course: "Algebra II", room: "112", teacher: "Mr. Reyes" },
    { period: 3, time: "9:40 – 10:25", course: "Assembly", room: "Auditorium", teacher: "—" },
  ],
};

export const transcript = {
  totalCreditsEarned: 8.5,
  totalCreditsRequired: 24,
  gpa: 3.62,
  courses: [
    { year: "2023-24", course: "English I", credit: 1.0, grade: "A" },
    { year: "2023-24", course: "Algebra I", credit: 1.0, grade: "B" },
    { year: "2023-24", course: "Physical Science", credit: 1.0, grade: "B+" },
    { year: "2023-24", course: "Civics", credit: 0.5, grade: "A" },
    { year: "2024-25", course: "Geometry", credit: 1.0, grade: "B" },
    { year: "2024-25", course: "Health/PE", credit: 1.0, grade: "A" },
  ],
};

export type LeapLevel =
  | "Unsatisfactory"
  | "Approaching Basic"
  | "Basic"
  | "Mastery"
  | "Advanced";

export const leapScores: Array<{
  subject: string;
  score: number;
  level: LeapLevel;
  year: string;
}> = [
  { subject: "English Language Arts", score: 752, level: "Mastery", year: "2024-25" },
  { subject: "Mathematics", score: 718, level: "Basic", year: "2024-25" },
  { subject: "Science", score: 781, level: "Advanced", year: "2024-25" },
  { subject: "Social Studies", score: 695, level: "Approaching Basic", year: "2024-25" },
];

export const communications = [
  {
    id: 1,
    type: "Principal",
    title: "Welcome back to the second nine weeks",
    body: "Reminder: Parent-Teacher conferences are Oct 28.",
    date: "2025-10-15",
  },
  {
    id: 2,
    type: "Attendance",
    title: "Excessive absence notice",
    body: "Alex has accrued 2 unexcused absences. Please contact the office.",
    date: "2025-10-10",
  },
  {
    id: 3,
    type: "Grade",
    title: "Algebra II progress update",
    body: "Current grade: 86. Missing assignment: Worksheet 4.2.",
    date: "2025-10-08",
  },
  {
    id: 4,
    type: "Event",
    title: "Homecoming Friday",
    body: "Pep rally at 2:00 PM, game kickoff at 7:00 PM.",
    date: "2025-10-05",
  },
];

export const fees = {
  balanceDue: 35.0,
  items: [
    { description: "Student ID Card Replacement", amount: 10.0, status: "Unpaid" },
    { description: "Yearbook Pre-Order", amount: 25.0, status: "Unpaid" },
    { description: "PE Uniform", amount: 20.0, status: "Paid" },
  ],
};
