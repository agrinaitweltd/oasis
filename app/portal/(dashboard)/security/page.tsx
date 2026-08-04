"use client";

import { useState } from "react";
import { Ban, Fingerprint, LogOut, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card, CardHeader } from "@/components/portal/ui/Card";
import { Badge } from "@/components/portal/ui/Badge";
import { Button } from "@/components/portal/ui/Button";
import { StatCard } from "@/components/portal/ui/StatCard";
import { securityLog as initialLog, blockedIps as initialBlocked } from "@/lib/mock/platform";
import { useToast } from "@/hooks/useToast";

const SEVERITY_TONE: Record<string, "neutral" | "warning" | "danger"> = { low: "neutral", medium: "warning", high: "danger" };
const TYPE_LABEL: Record<string, string> = {
  failed_login: "Failed Login",
  suspicious_activity: "Suspicious Activity",
  ip_blocked: "IP Blocked",
  session_revoked: "Session Revoked",
  "2fa_change": "2FA Change",
};

export default function SecurityPage() {
  const { toast } = useToast();
  const [blocked, setBlocked] = useState(initialBlocked);
  const [twoFactorRequired, setTwoFactorRequired] = useState(true);

  const failedLogins = initialLog.filter((l) => l.type === "failed_login").length;
  const suspicious = initialLog.filter((l) => l.type === "suspicious_activity").length;

  return (
    <div>
      <PageHeader
        title="Security"
        description="Platform-wide security monitoring - failed logins, suspicious activity, IP blocking and sessions."
        breadcrumbs={[{ label: "Dashboard", href: "/portal/dashboard" }, { label: "Security" }]}
      />

      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Failed Logins (14d)" value={String(failedLogins)} icon={ShieldAlert} accent="amber" />
        <StatCard label="Suspicious Activity" value={String(suspicious)} icon={ShieldAlert} accent="oasis" />
        <StatCard label="Blocked IPs" value={String(blocked.length)} icon={Ban} accent="sky" />
        <StatCard label="2FA Adoption" value="58%" icon={Fingerprint} accent="emerald" />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="p-0 xl:col-span-2">
          <CardHeader title="Security log" className="p-5 pb-0" />
          <div className="divide-y divide-slate-50">
            {initialLog.slice(0, 12).map((l) => (
              <div key={l.id} className="flex items-start justify-between gap-4 p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-800">{TYPE_LABEL[l.type]}</p>
                    <Badge tone={SEVERITY_TONE[l.severity]}>{l.severity}</Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">{l.detail}</p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    {l.ipAddress} &middot; {l.location} &middot; {l.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader title="Blocked IPs" />
            <div className="space-y-2">
              {blocked.map((ip) => (
                <div key={ip.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
                  <div>
                    <p className="font-mono text-xs font-medium text-slate-700">{ip.ipAddress}</p>
                    <p className="text-[11px] text-slate-400">{ip.reason}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setBlocked((prev) => prev.filter((b) => b.id !== ip.id));
                      toast("info", "IP unblocked", ip.ipAddress);
                    }}
                  >
                    Unblock
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Session management" />
            <p className="mb-3 text-sm text-slate-500">Revoke all active staff sessions platform-wide.</p>
            <Button
              variant="danger"
              className="w-full"
              onClick={() => toast("info", "Sessions revoked", "All active staff sessions have been signed out.")}
            >
              <LogOut className="h-4 w-4" /> Revoke all sessions
            </Button>
          </Card>

          <Card>
            <CardHeader title="Two-factor authentication" />
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">Require 2FA for all staff accounts</p>
              <button
                type="button"
                onClick={() => {
                  setTwoFactorRequired((v) => !v);
                  toast("success", "Security setting updated", "");
                }}
                className={`relative h-6 w-11 flex-shrink-0 rounded-full transition ${twoFactorRequired ? "bg-oasis-500" : "bg-slate-300"}`}
              >
                <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${twoFactorRequired ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
