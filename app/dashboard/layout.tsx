import "@/styles/portal.css";
import { SchoolShell } from "@/components/school/SchoolShell";
import { ToastProvider } from "@/hooks/useToast";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-sans text-slate-900 antialiased">
      <ToastProvider>
        <SchoolShell>{children}</SchoolShell>
      </ToastProvider>
    </div>
  );
}
