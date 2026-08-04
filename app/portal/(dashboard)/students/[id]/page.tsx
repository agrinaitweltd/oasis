"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Camera,
  FileText,
  HeartPulse,
  Phone,
  Users,
  CalendarCheck,
  MessageSquareWarning,
  School as SchoolIcon,
  ArrowLeft,
} from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card, CardHeader } from "@/components/portal/ui/Card";
import { Avatar } from "@/components/portal/ui/Avatar";
import { StatusBadge, Badge } from "@/components/portal/ui/Badge";
import { Button } from "@/components/portal/ui/Button";
import { EmptyState } from "@/components/portal/ui/EmptyState";
import { getStudentById, getParentById } from "@/lib/mock/students";
import { getClassById } from "@/lib/mock/classes";
import { attendanceRecords } from "@/lib/mock/attendance";
import { cn } from "@/lib/utils/cn";

const TABS = [
  { key: "overview", label: "Overview", icon: SchoolIcon },
  { key: "medical", label: "Medical", icon: HeartPulse },
  { key: "emergency", label: "Emergency Contacts", icon: Phone },
  { key: "parents", label: "Parents", icon: Users },
  { key: "attendance", label: "Attendance", icon: CalendarCheck },
  { key: "behaviour", label: "Behaviour", icon: MessageSquareWarning },
  { key: "documents", label: "Documents", icon: FileText },
  { key: "photo", label: "Photo", icon: Camera },
] as const;

export default function StudentProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("overview");

  const student = getStudentById(params.id);

  if (!student) {
    return (
      <div>
        <PageHeader title="Student not found" breadcrumbs={[{ label: "Students", href: "/portal/students" }, { label: "Not found" }]} />
        <EmptyState title="We couldn't find that student" description="They may have been removed or the link is incorrect." />
      </div>
    );
  }

  const guardian = getParentById(student.guardianId);
  const cls = getClassById(student.classId);
  const studentAttendance = attendanceRecords.filter((r) => r.studentId === student.id);

  return (
    <div>
      <button
        type="button"
        onClick={() => router.push("/portal/students")}
        className="mb-3 flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-oasis-600"
      >
        <ArrowLeft className="h-4 w-4" /> Back to students
      </button>

      <Card className="mb-5">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <Avatar name={`${student.firstName} ${student.lastName}`} size={64} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">
                {student.firstName} {student.lastName}
              </h1>
              <StatusBadge status={student.status} />
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {student.admissionNo} &middot; {student.className} {student.stream} &middot; {student.gender}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary">Edit Profile</Button>
            <Button>Message Parent</Button>
          </div>
        </div>
      </Card>

      <div className="mb-5 flex gap-1 overflow-x-auto rounded-2xl border border-slate-200/70 bg-white p-1.5">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex flex-shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-[13px] font-medium transition",
              tab === t.key ? "bg-oasis-500 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100"
            )}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader title="Personal details" />
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <Detail label="Date of Birth" value={student.dateOfBirth} />
              <Detail label="Gender" value={student.gender} />
              <Detail label="Admission No." value={student.admissionNo} />
              <Detail label="Attendance Rate" value={`${student.attendanceRate}%`} />
            </dl>
          </Card>
          <Card>
            <CardHeader title="Class allocation" />
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <Detail label="Class" value={`${student.className} ${student.stream}`} />
              <Detail label="Room" value={cls?.room ?? "—"} />
              <Detail label="Class Size" value={cls ? `${cls.studentCount}/${cls.capacity}` : "—"} />
            </dl>
          </Card>
        </div>
      )}

      {tab === "medical" && (
        <Card>
          <CardHeader title="Medical information" subtitle="Visible to authorised staff only" />
          <dl className="mb-5 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
            <Detail label="Blood Group" value={student.medical.bloodGroup} />
          </dl>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Allergies</p>
              {student.medical.allergies.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {student.medical.allergies.map((a) => (
                    <Badge key={a} tone="warning">{a}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">None recorded</p>
              )}
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Conditions</p>
              {student.medical.conditions.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {student.medical.conditions.map((c) => (
                    <Badge key={c} tone="danger">{c}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">None recorded</p>
              )}
            </div>
          </div>
          {student.medical.notes && (
            <p className="mt-5 rounded-xl bg-slate-50 p-3.5 text-sm text-slate-600">{student.medical.notes}</p>
          )}
        </Card>
      )}

      {tab === "emergency" && (
        <Card className="p-0">
          <div className="divide-y divide-slate-50">
            {student.emergencyContacts.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{c.name}</p>
                  <p className="text-xs text-slate-400">{c.relationship}</p>
                </div>
                <p className="text-sm text-slate-600">{c.phone}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "parents" && (
        <Card>
          {guardian ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar name={`${guardian.firstName} ${guardian.lastName}`} size={48} />
                <div>
                  <p className="font-semibold text-slate-800">
                    {guardian.firstName} {guardian.lastName}
                  </p>
                  <p className="text-xs text-slate-400">{guardian.email}</p>
                  <p className="text-xs text-slate-400">{guardian.phone}</p>
                </div>
              </div>
              <Button variant="secondary" onClick={() => router.push(`/portal/parents/${guardian.id}`)}>
                View Parent
              </Button>
            </div>
          ) : (
            <EmptyState title="No guardian on record" />
          )}
        </Card>
      )}

      {tab === "attendance" && (
        <Card className="p-0">
          {studentAttendance.length === 0 ? (
            <div className="p-6">
              <EmptyState title="No attendance records yet" />
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {studentAttendance.slice(-10).reverse().map((r) => (
                <div key={r.id} className="flex items-center justify-between px-5 py-3">
                  <span className="text-sm text-slate-600">{r.date}</span>
                  <StatusBadge status={r.status} />
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {tab === "behaviour" && (
        <Card className="p-0">
          {student.behaviourNotes.length === 0 ? (
            <div className="p-6">
              <EmptyState title="No behaviour notes recorded" description="Positive and negative notes will appear here." />
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {student.behaviourNotes.map((n, i) => (
                <div key={i} className="p-5">
                  <div className="flex items-center gap-2">
                    <Badge tone={n.type === "Positive" ? "success" : n.type === "Negative" ? "danger" : "neutral"}>{n.type}</Badge>
                    <span className="text-xs text-slate-400">{n.date}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-700">{n.note}</p>
                  <p className="mt-1 text-xs text-slate-400">Recorded by {n.recordedBy}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {tab === "documents" && (
        <Card className="p-0">
          <div className="divide-y divide-slate-50">
            {student.documents.map((d, i) => (
              <div key={i} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-oasis-50 text-oasis-600">
                    <FileText className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-700">{d.name}</p>
                    <p className="text-xs text-slate-400">
                      {d.type} &middot; Uploaded {d.uploadedAt}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Download
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "photo" && (
        <Card>
          <div className="flex flex-col items-center gap-4 py-6">
            <Avatar name={`${student.firstName} ${student.lastName}`} size={96} />
            <div className="text-center">
              <p className="text-sm font-medium text-slate-700">No photo uploaded</p>
              <p className="text-xs text-slate-400">JPG or PNG, up to 5MB</p>
            </div>
            <Button variant="secondary">
              <Camera className="h-4 w-4" /> Upload Photo
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-400">{label}</dt>
      <dd className="mt-0.5 font-medium text-slate-800">{value}</dd>
    </div>
  );
}
