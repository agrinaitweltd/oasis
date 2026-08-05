"use client";

// Generic localStorage-backed collection persistence. There is no backend
// yet, so this is where real records live (schools that actually
// registered, backups actually triggered, notifications actually sent) -
// nothing here is fabricated sample data. Every collection starts empty
// and only grows from real actions taken in the app.

import { useCallback, useEffect, useState } from "react";

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, items: T[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(items));
}

const listeners = new Map<string, Set<() => void>>();

function notify(key: string) {
  listeners.get(key)?.forEach((fn) => fn());
}

export function getCollection<T>(key: string): T[] {
  return read<T>(key);
}

export function setCollection<T>(key: string, items: T[]) {
  write(key, items);
  notify(key);
}

export function appendToCollection<T>(key: string, item: T) {
  const items = read<T>(key);
  const next = [item, ...items];
  write(key, next);
  notify(key);
  return next;
}

export function updateInCollection<T extends { id: string }>(key: string, id: string, patch: Partial<T>) {
  const items = read<T>(key);
  const next = items.map((i) => (i.id === id ? { ...i, ...patch } : i));
  write(key, next);
  notify(key);
  return next;
}

/** React hook: reactive view of a localStorage collection, live-updating
 * across every component using the same key within this tab. */
export function useCollection<T>(key: string): [T[], (items: T[]) => void] {
  const [items, setItems] = useState<T[]>([]);

  useEffect(() => {
    setItems(read<T>(key));
    const fn = () => setItems(read<T>(key));
    if (!listeners.has(key)) listeners.set(key, new Set());
    listeners.get(key)!.add(fn);
    return () => {
      listeners.get(key)?.delete(fn);
    };
  }, [key]);

  const update = useCallback(
    (next: T[]) => {
      setCollection(key, next);
    },
    [key]
  );

  return [items, update];
}
