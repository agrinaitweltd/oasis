"use client";

import { useState, type FormEvent } from "react";
import { Mail, MessageCircle, Phone, Send } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card, CardHeader } from "@/components/portal/ui/Card";
import { Input, Select } from "@/components/portal/ui/Input";
import { Button } from "@/components/portal/ui/Button";
import { useToast } from "@/hooks/useToast";

const FAQS = [
  { q: "How do I add a new student?", a: "Go to Students → Add Student and fill in the admission form. The student will appear in the class roster immediately." },
  { q: "How are outstanding fee balances calculated?", a: "Outstanding balance is the invoiced amount for the term minus payments recorded against that invoice." },
  { q: "Can I export attendance data?", a: "Yes — visit Reports and choose Attendance Reports to export a CSV for any date range." },
  { q: "Who can approve teacher leave requests?", a: "Admins and Super Admins can approve or reject leave requests from Teachers → Leave." },
];

export default function SupportPage() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    toast("success", "Support request sent", "Our team will get back to you within one business day.");
  }

  return (
    <div>
      <PageHeader title="Support" description="Get help from the OASIS support team" breadcrumbs={[{ label: "Dashboard", href: "/portal/dashboard" }, { label: "Support" }]} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-3 lg:grid-cols-3">
          <Card className="flex items-center gap-3">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-oasis-50 text-oasis-600">
              <Phone className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-800">Call us</p>
              <p className="text-xs text-slate-500">+256 700 000 000</p>
            </div>
          </Card>
          <Card className="flex items-center gap-3">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-oasis-50 text-oasis-600">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-800">Email us</p>
              <p className="text-xs text-slate-500">support@oasis.co.ug</p>
            </div>
          </Card>
          <Card className="flex items-center gap-3">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-oasis-50 text-oasis-600">
              <MessageCircle className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-800">Live chat</p>
              <p className="text-xs text-slate-500">Mon–Fri, 8am–6pm EAT</p>
            </div>
          </Card>
        </div>

        <Card className="lg:col-span-2">
          <CardHeader title="Frequently asked questions" />
          <div className="divide-y divide-slate-50">
            {FAQS.map((f) => (
              <details key={f.q} className="group py-3.5 first:pt-0 last:pb-0">
                <summary className="cursor-pointer list-none text-sm font-medium text-slate-800 marker:content-none">{f.q}</summary>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{f.a}</p>
              </details>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Raise a ticket" />
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Category</label>
              <Select defaultValue="General">
                <option>General</option>
                <option>Billing</option>
                <option>Technical Issue</option>
                <option>Feature Request</option>
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Subject</label>
              <Input placeholder="Briefly describe the issue" required />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Details</label>
              <textarea
                rows={4}
                required
                placeholder="Tell us more..."
                className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm outline-none transition focus:border-oasis-400 focus:ring-4 focus:ring-oasis-100"
              />
            </div>
            <Button type="submit" loading={submitting} className="w-full">
              <Send className="h-4 w-4" /> Submit request
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
