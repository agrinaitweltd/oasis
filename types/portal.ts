// Domain types for the OASIS admin portal. Shaped so a future Supabase
// table (same field names, snake_case columns mapped 1:1) can replace the
// mock data in lib/mock/* without changing anything that consumes these
// types.

export type School = {
  id: string;
  name: string;
  district: string;
  logoInitials: string;
};

export type Gender = "Male" | "Female";

export type Student = {
  id: string;
  admissionNo: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: string;
  classId: string;
  className: string;
  stream: string;
  photoUrl: string | null;
  status: "Active" | "Inactive" | "Graduated" | "Transferred";
  guardianId: string;
  medical: {
    bloodGroup: string;
    allergies: string[];
    conditions: string[];
    notes: string;
  };
  emergencyContacts: { name: string; relationship: string; phone: string }[];
  documents: { name: string; type: string; uploadedAt: string }[];
  behaviourNotes: { date: string; type: "Positive" | "Negative" | "Neutral"; note: string; recordedBy: string }[];
  attendanceRate: number;
};

export type Parent = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  studentIds: string[];
  feeBalance: number;
  lastMessageAt: string | null;
};

export type Teacher = {
  id: string;
  staffNo: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subjects: string[];
  classesTaught: string[];
  status: "Active" | "On Leave" | "Inactive";
  joinedAt: string;
  photoUrl: string | null;
};

export type LeaveRequest = {
  id: string;
  teacherId: string;
  type: "Sick" | "Annual" | "Maternity" | "Compassionate" | "Unpaid";
  startDate: string;
  endDate: string;
  status: "Pending" | "Approved" | "Rejected";
};

export type SchoolClass = {
  id: string;
  name: string;
  stream: string;
  teacherId: string;
  studentCount: number;
  capacity: number;
  room: string;
};

export type AttendanceStatus = "Present" | "Absent" | "Late" | "Excused";

export type AttendanceRecord = {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: AttendanceStatus;
  arrivalTime: string | null;
  note?: string;
};

export type TimetableSlot = {
  id: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
  period: number;
  startTime: string;
  endTime: string;
  subject: string;
  classId: string;
  teacherId: string;
  room: string;
};

export type Exam = {
  id: string;
  name: string;
  term: string;
  startDate: string;
  endDate: string;
  status: "Scheduled" | "In Progress" | "Marking" | "Published";
  classIds: string[];
};

export type ExamResult = {
  id: string;
  examId: string;
  studentId: string;
  subject: string;
  score: number;
  maxScore: number;
  grade: string;
};

export type Invoice = {
  id: string;
  invoiceNo: string;
  studentId: string;
  term: string;
  amount: number;
  amountPaid: number;
  dueDate: string;
  status: "Paid" | "Partial" | "Overdue" | "Pending";
};

export type Payment = {
  id: string;
  invoiceId: string;
  studentId: string;
  amount: number;
  method: "Mobile Money" | "Bank Transfer" | "Cash" | "Card";
  reference: string;
  paidAt: string;
};

export type ExpenseRecord = {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  approvedBy: string;
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  audience: "All" | "Parents" | "Teachers" | "Students";
  channel: "SMS" | "Email" | "Push" | "In-App";
  sentAt: string;
  status: "Sent" | "Scheduled" | "Draft";
  recipients: number;
};

export type ActivityItem = {
  id: string;
  type: "enrolment" | "payment" | "attendance" | "exam" | "communication" | "system";
  message: string;
  timestamp: string;
  actor: string;
};

export type LibraryBook = {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  copiesTotal: number;
  copiesAvailable: number;
};

export type LibraryLoan = {
  id: string;
  bookId: string;
  studentId: string;
  borrowedAt: string;
  dueAt: string;
  returnedAt: string | null;
};

export type TransportRoute = {
  id: string;
  name: string;
  driver: string;
  vehiclePlate: string;
  capacity: number;
  studentsAssigned: number;
  stops: string[];
};

export type HostelRoom = {
  id: string;
  block: string;
  roomNo: string;
  capacity: number;
  occupied: number;
  wardenName: string;
};

export type PortalUser = {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Admin" | "Teacher" | "Accountant" | "Registrar";
  status: "Active" | "Suspended";
};

export type Role = {
  id: string;
  name: string;
  usersCount: number;
  permissions: string[];
};
