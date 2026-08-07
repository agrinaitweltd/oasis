"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";

type TableName = keyof Database["public"]["Tables"] & string;

/** Live-updating view of a Postgres table: fetches once, then keeps state in
 * sync via Realtime postgres_changes - no polling. Requires the table to be
 * added to the supabase_realtime publication and readable under the
 * caller's RLS policies. */
export function useRealtimeRows<T extends { id: string }>(table: TableName, orderBy: keyof T & string = "created_at" as keyof T & string) {
  const supabase = useMemo(() => createClient(), []);
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    supabase
      .from(table)
      .select("*")
      .order(orderBy, { ascending: false })
      .then(({ data }) => {
        if (!active) return;
        setRows((data as unknown as T[]) ?? []);
        setLoading(false);
      });

    const channel = supabase
      .channel(`realtime:${table}`)
      .on("postgres_changes", { event: "*", schema: "public", table }, (payload) => {
        setRows((current) => {
          if (payload.eventType === "INSERT") {
            const next = payload.new as unknown as T;
            return current.some((r) => r.id === next.id) ? current : [next, ...current];
          }
          if (payload.eventType === "UPDATE") {
            const next = payload.new as unknown as T;
            return current.map((r) => (r.id === next.id ? next : r));
          }
          if (payload.eventType === "DELETE") {
            const old = payload.old as unknown as T;
            return current.filter((r) => r.id !== old.id);
          }
          return current;
        });
      })
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  return { rows, loading };
}
