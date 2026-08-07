import { ShieldAlert } from "lucide-react";
import { ModulePlaceholder } from "@/components/school/ModulePlaceholder";

export default function SafeguardingPage() {
  return <ModulePlaceholder title="Safeguarding" description="Concerns, case management and DSL dashboard. Restricted to School Admin only." icon={ShieldAlert} />;
}
