"use client";

import { CreditCard, Mail, MessageSquareText, ShieldQuestion } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card } from "@/components/portal/ui/Card";
import { Badge } from "@/components/portal/ui/Badge";
import { Button } from "@/components/portal/ui/Button";
import { INTEGRATION_DEFS } from "@/lib/platform-store";
import { useToast } from "@/hooks/useToast";

const CATEGORY_ICON: Record<string, typeof CreditCard> = {
  payments: CreditCard,
  email: Mail,
  sms: MessageSquareText,
  whatsapp: MessageSquareText,
  google: ShieldQuestion,
};
const CATEGORY_LABEL: Record<string, string> = {
  payments: "Payment Gateways",
  email: "Email Providers",
  sms: "SMS Providers",
  whatsapp: "WhatsApp",
  google: "Google",
};

export default function IntegrationsPage() {
  const { toast } = useToast();
  const grouped = INTEGRATION_DEFS.reduce<Record<string, typeof INTEGRATION_DEFS>>((acc, i) => {
    (acc[i.category] ??= []).push(i);
    return acc;
  }, {});

  return (
    <div>
      <PageHeader
        title="Integrations"
        description="Platform-level connections for payments, email, SMS, WhatsApp and Google services. Nothing is connected yet."
        breadcrumbs={[{ label: "Dashboard", href: "/portal/dashboard" }, { label: "Integrations" }]}
      />

      {Object.entries(grouped).map(([category, items]) => {
        const Icon = CATEGORY_ICON[category];
        return (
          <div key={category} className="mb-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">{CATEGORY_LABEL[category]}</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((i) => (
                <Card key={i.name} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-oasis-50 text-oasis-600">
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="text-sm font-semibold text-slate-800">{i.name}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge tone="neutral">Not Connected</Badge>
                    <Button variant="ghost" size="sm" onClick={() => toast("info", "Connect integration", `Connecting ${i.name} requires backend credentials.`)}>
                      Connect
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
