import type { ActivityItem, Announcement } from "@/types/portal";
import { makeRng } from "./rand";

const rng = makeRng(7007);

export const announcements: Announcement[] = [
  { title: "Term 2 Fees Payment Deadline", body: "Please clear outstanding balances by 15 August 2026 to avoid late fees.", audience: "Parents", channel: "SMS" },
  { title: "Parent-Teacher Meeting", body: "Join us on 22 August for the Term 2 parent-teacher conference.", audience: "Parents", channel: "Email" },
  { title: "Mid-Term Break Schedule", body: "School closes for mid-term break from 9-13 June 2026.", audience: "All", channel: "In-App" },
  { title: "Sports Day Volunteers Needed", body: "We're looking for staff volunteers for the upcoming inter-house sports day.", audience: "Teachers", channel: "Email" },
  { title: "New Library Books Arrived", body: "Over 200 new titles are now available in the school library.", audience: "Students", channel: "Push" },
  { title: "Exam Timetable Released", body: "The End of Term Examination timetable has been published.", audience: "All", channel: "SMS" },
].map((a, i) => ({
  id: `ann_${i}`,
  ...a,
  sentAt: rng.dateWithinDays(45),
  status: rng.pick(["Sent", "Sent", "Sent", "Scheduled", "Draft"] as const),
  recipients: rng.int(120, 1800),
})) as Announcement[];

export const activity: ActivityItem[] = [
  { type: "payment", message: "Payment of UGX 850,000 received from Nakato family", actor: "Finance System" },
  { type: "enrolment", message: "New student Joseph Kato admitted to P.5 East", actor: "Registrar" },
  { type: "attendance", message: "Attendance register submitted for S.2 North", actor: "Mrs. Namubiru" },
  { type: "exam", message: "Mid-Term results published for S.4", actor: "Academic Office" },
  { type: "communication", message: "SMS reminder sent to 1,204 parents about fees deadline", actor: "Communication System" },
  { type: "system", message: "Weekly backup completed successfully", actor: "System" },
  { type: "attendance", message: "3 late arrivals recorded for P.6 West this morning", actor: "Front Desk" },
  { type: "payment", message: "Invoice INV-5041 marked overdue", actor: "Finance System" },
  { type: "enrolment", message: "Transfer request approved for a S.1 student", actor: "Registrar" },
  { type: "communication", message: "Announcement \"Sports Day Volunteers Needed\" sent to teachers", actor: "Head Teacher" },
].map((a, i) => ({
  id: `act_${i}`,
  ...a,
  timestamp: rng.dateWithinDays(7),
})) as ActivityItem[];
