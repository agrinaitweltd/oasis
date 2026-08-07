import { LineChart } from "lucide-react";
import { ModulePlaceholder } from "@/components/school/ModulePlaceholder";

export default function SchoolAnalyticsPage() {
  return <ModulePlaceholder title="School Analytics" description="Attendance, behaviour, academic and finance graphs." icon={LineChart} />;
}
