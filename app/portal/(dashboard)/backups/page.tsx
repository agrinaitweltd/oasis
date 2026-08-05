"use client";

import { useState } from "react";
import { DatabaseBackup, History } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card, CardHeader } from "@/components/portal/ui/Card";
import { Table, type Column } from "@/components/portal/ui/Table";
import { Badge } from "@/components/portal/ui/Badge";
import { Button } from "@/components/portal/ui/Button";
import { Modal } from "@/components/portal/ui/Modal";
import { Select } from "@/components/portal/ui/Input";
import { EmptyState } from "@/components/portal/ui/EmptyState";
import { triggerBackup } from "@/lib/platform-store";
import { useCollection } from "@/lib/store";
import type { BackupRecord, SchoolRequest } from "@/types/portal";
import { useToast } from "@/hooks/useToast";

export default function BackupsPage() {
  const { toast } = useToast();
  const [backups] = useCollection<BackupRecord>("oasis_backups");
  const [schools] = useCollection<SchoolRequest>("oasis_school_registry");
  const [triggerOpen, setTriggerOpen] = useState(false);
  const [triggerSchool, setTriggerSchool] = useState("");
  const [restoreOpen, setRestoreOpen] = useState(false);
  const [restoreTarget, setRestoreTarget] = useState<BackupRecord | null>(null);

  const columns: Column<BackupRecord>[] = [
    { key: "school", header: "School", render: (b) => b.schoolName },
    { key: "triggered", header: "Triggered By", render: (b) => b.triggeredBy },
    { key: "started", header: "Started", render: (b) => b.startedAt },
    { key: "status", header: "Status", render: (b) => <Badge tone={b.status === "completed" ? "success" : b.status === "failed" ? "danger" : "warning"}>{b.status}</Badge> },
    {
      key: "actions",
      header: "",
      render: (b) =>
        b.status === "completed" ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setRestoreTarget(b);
              setRestoreOpen(true);
            }}
          >
            <History className="h-3.5 w-3.5" /> Restore
          </Button>
        ) : null,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Backups"
        description="Trigger and restore school backups. Backup contents are never browsed from this console."
        breadcrumbs={[{ label: "Dashboard", href: "/portal/dashboard" }, { label: "Backups" }]}
        action={
          <Button onClick={() => setTriggerOpen(true)} disabled={schools.length === 0}>
            <DatabaseBackup className="h-4 w-4" /> Trigger backup
          </Button>
        }
      />

      <Card className="p-0">
        <CardHeader title="Backup history" className="p-5 pb-0" />
        {backups.length === 0 ? (
          <div className="p-6">
            <EmptyState icon={DatabaseBackup} title="No backups yet" description="Trigger a backup above to see it here." />
          </div>
        ) : (
          <Table columns={columns} rows={backups} emptyTitle="No backups yet" />
        )}
      </Card>

      <Modal
        open={triggerOpen}
        onClose={() => setTriggerOpen(false)}
        title="Trigger backup"
        maxWidth={420}
        footer={
          <>
            <Button variant="secondary" onClick={() => setTriggerOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!triggerSchool) {
                  toast("error", "Select a school", "");
                  return;
                }
                triggerBackup(triggerSchool);
                setTriggerOpen(false);
                toast("success", "Backup triggered", "");
              }}
            >
              Trigger
            </Button>
          </>
        }
      >
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-600">School</label>
          <Select value={triggerSchool} onChange={(e) => setTriggerSchool(e.target.value)}>
            <option value="">Select a school</option>
            {schools.map((s) => (
              <option key={s.id} value={s.schoolName}>
                {s.schoolName}
              </option>
            ))}
          </Select>
        </div>
      </Modal>

      <Modal
        open={restoreOpen}
        onClose={() => setRestoreOpen(false)}
        title="Restore backup"
        description={restoreTarget ? `${restoreTarget.schoolName} - ${restoreTarget.startedAt}` : ""}
        maxWidth={460}
        footer={
          <>
            <Button variant="secondary" onClick={() => setRestoreOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setRestoreOpen(false);
                toast("info", "Restore requires authorization", "The school's admin must approve this restore before it proceeds.");
              }}
            >
              <History className="h-4 w-4" /> Request restore
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-500">
          Restoring will require the school&rsquo;s authorization and appropriate safeguards. You will not be able to
          browse the contents of this backup - only trigger, request restore, or view history.
        </p>
      </Modal>
    </div>
  );
}
