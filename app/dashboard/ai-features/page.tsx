import { Sparkles } from "lucide-react";
import { ModulePlaceholder } from "@/components/school/ModulePlaceholder";

export default function AiFeaturesPage() {
  return (
    <ModulePlaceholder
      title="AI Features"
      description="AI assistant, student summaries, draft emails, smart reports."
      icon={Sparkles}
      note="Coming later. No LLM provider or approach has been chosen yet - this will be scoped separately once that decision is made."
    />
  );
}
