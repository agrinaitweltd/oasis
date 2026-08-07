"use client";

import { useState, type FormEvent } from "react";
import { Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { Card } from "@/components/portal/ui/Card";
import { Table, type Column } from "@/components/portal/ui/Table";
import { Button } from "@/components/portal/ui/Button";
import { Modal } from "@/components/portal/ui/Modal";
import { Input } from "@/components/portal/ui/Input";
import { Field, textareaClassName } from "@/components/school/Field";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useRealtimeRows } from "@/lib/supabase/useRealtimeRows";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/useToast";
import type { Database } from "@/types/database.types";

type TableName = keyof Database["public"]["Tables"] & string;
type Row = { id: string; school_id?: string; [key: string]: unknown };

export type FieldDef =
  | { key: string; label: string; type: "text" | "email" | "date" | "number" | "time"; required?: boolean; placeholder?: string }
  | { key: string; label: string; type: "textarea"; required?: boolean }
  | { key: string; label: string; type: "select"; required?: boolean; options: { value: string; label: string }[] }
  | { key: string; label: string; type: "boolean-select"; required?: boolean; trueLabel: string; falseLabel: string }
  | { key: string; label: string; type: "relation"; required?: boolean; relationTable: TableName; labelKey: string };

export function SimpleModule<T extends Row>({
  table,
  title,
  description,
  breadcrumbLabel,
  orderBy,
  fields,
  columns,
  writeRoles,
  deleteRoles = ["school_admin"],
  readRoles,
  extraOnInsert,
  compact,
}: {
  table: TableName;
  title: string;
  description: string;
  breadcrumbLabel?: string;
  orderBy?: string;
  fields: FieldDef[];
  columns: Column<T>[];
  writeRoles: string[];
  deleteRoles?: string[];
  readRoles?: string[];
  extraOnInsert?: Record<string, unknown>;
  /** Skip the full PageHeader (breadcrumbs) - for stacking a second table
   * lower on a page that already has its own PageHeader. */
  compact?: boolean;
}) {
  const { profile, role } = useAuth();
  const { toast } = useToast();

  const hasReadAccess = !readRoles || (role ? readRoles.includes(role) : false);
  const { rows, loading } = useRealtimeRows<T>(table, orderBy);
  const canWrite = role ? writeRoles.includes(role) : false;
  const canDelete = role ? deleteRoles.includes(role) : false;

  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const relationTables = Array.from(new Set(fields.filter((f) => f.type === "relation").map((f) => (f as { relationTable: TableName }).relationTable)));

  return (
    <div>
      {compact ? (
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800">{title}</h2>
          {canWrite && hasReadAccess && (
            <Button size="sm" onClick={() => setOpen(true)}>
              <Plus className="h-3.5 w-3.5" /> Add
            </Button>
          )}
        </div>
      ) : (
        <PageHeader
          title={title}
          description={description}
          breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: breadcrumbLabel ?? title }]}
          action={
            canWrite &&
            hasReadAccess && (
              <Button onClick={() => setOpen(true)}>
                <Plus className="h-4 w-4" /> Add
              </Button>
            )
          }
        />
      )}

      {!hasReadAccess ? (
        <Card>
          <p className="py-8 text-center text-sm text-slate-500">
            You don&rsquo;t have access to this module.
          </p>
        </Card>
      ) : (
        <Card className="p-0">
          <Table
            columns={
              canDelete
                ? [
                    ...columns,
                    {
                      key: "__actions",
                      header: "",
                      render: (r: T) => (
                        <DeleteButton
                          onDelete={async () => {
                            const { error } = await createClient().from(table).delete().eq("id", r.id);
                            if (error) toast("error", "Couldn't delete", error.message);
                          }}
                        />
                      ),
                    },
                  ]
                : columns
            }
            rows={rows}
            loading={loading}
            emptyTitle="Nothing here yet"
          />
        </Card>
      )}

      {canWrite && (
        <Modal open={open} onClose={() => setOpen(false)} title={`Add ${breadcrumbLabel ?? title}`} maxWidth={480}>
          <FormBody
            fields={fields}
            values={values}
            setValues={setValues}
            relationTables={relationTables}
            schoolId={profile?.school_id ?? null}
            saving={saving}
            onCancel={() => setOpen(false)}
            onSubmit={async (e: FormEvent) => {
              e.preventDefault();
              if (!profile?.school_id) return;
              setSaving(true);
              const payload: Record<string, unknown> = { school_id: profile.school_id, ...extraOnInsert };
              for (const f of fields) {
                const raw = values[f.key];
                if (raw === undefined || raw === "") {
                  payload[f.key] = null;
                } else if (f.type === "number") {
                  payload[f.key] = Number(raw);
                } else if (f.type === "boolean-select") {
                  payload[f.key] = raw === "true";
                } else {
                  payload[f.key] = raw;
                }
              }
              const { error } = await createClient().from(table).insert(payload as never);
              setSaving(false);
              if (error) {
                toast("error", "Couldn't save", error.message);
                return;
              }
              setOpen(false);
              setValues({});
              toast("success", "Saved", "");
            }}
          />
        </Modal>
      )}
    </div>
  );
}

function DeleteButton({ onDelete }: { onDelete: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onDelete();
      }}
      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
      aria-label="Delete"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}

function FormBody({
  fields,
  values,
  setValues,
  relationTables,
  schoolId,
  saving,
  onCancel,
  onSubmit,
}: {
  fields: FieldDef[];
  values: Record<string, string>;
  setValues: (v: Record<string, string>) => void;
  relationTables: TableName[];
  schoolId: string | null;
  saving: boolean;
  onCancel: () => void;
  onSubmit: (e: FormEvent) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {fields.map((f) => (
        <FieldInput key={f.key} field={f} value={values[f.key] ?? ""} onChange={(v) => setValues({ ...values, [f.key]: v })} />
      ))}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </Button>
      </div>
    </form>
  );
}

function FieldInput({ field, value, onChange }: { field: FieldDef; value: string; onChange: (v: string) => void }) {
  if (field.type === "textarea") {
    return (
      <Field label={field.label}>
        <textarea className={textareaClassName} rows={3} value={value} onChange={(e) => onChange(e.target.value)} required={field.required} />
      </Field>
    );
  }
  if (field.type === "boolean-select") {
    return (
      <Field label={field.label}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
          className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-oasis-400 focus:ring-4 focus:ring-oasis-100"
        >
          <option value="">Select…</option>
          <option value="true">{field.trueLabel}</option>
          <option value="false">{field.falseLabel}</option>
        </select>
      </Field>
    );
  }
  if (field.type === "select") {
    return (
      <Field label={field.label}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
          className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-oasis-400 focus:ring-4 focus:ring-oasis-100"
        >
          <option value="">Select…</option>
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>
    );
  }
  if (field.type === "relation") {
    return <RelationField field={field} value={value} onChange={onChange} />;
  }
  return (
    <Field label={field.label}>
      <Input type={field.type} placeholder={field.placeholder} value={value} onChange={(e) => onChange(e.target.value)} required={field.required} />
    </Field>
  );
}

function RelationField({
  field,
  value,
  onChange,
}: {
  field: Extract<FieldDef, { type: "relation" }>;
  value: string;
  onChange: (v: string) => void;
}) {
  const { rows } = useRealtimeRows<{ id: string; [key: string]: unknown }>(field.relationTable);
  return (
    <Field label={field.label}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={field.required}
        className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-oasis-400 focus:ring-4 focus:ring-oasis-100"
      >
        <option value="">Select…</option>
        {rows.map((r) => (
          <option key={r.id} value={r.id}>
            {String(r[field.labelKey] ?? r.id)}
          </option>
        ))}
      </select>
    </Field>
  );
}
