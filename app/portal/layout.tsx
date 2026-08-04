import "@/styles/portal.css";
import type { Metadata } from "next";
import { ToastProvider } from "@/hooks/useToast";

export const metadata: Metadata = {
  title: "OASIS Portal",
  description: "OASIS school management portal.",
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-sans text-slate-900 antialiased">
      <ToastProvider>{children}</ToastProvider>
    </div>
  );
}
