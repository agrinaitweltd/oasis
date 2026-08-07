import { CalendarCheck } from "lucide-react";
import { ModulePlaceholder } from "@/components/school/ModulePlaceholder";

export default function AttendancePage() {
  return <ModulePlaceholder title="Attendance" description="Live registers, statistics and absence follow-up." icon={CalendarCheck} />;
}
