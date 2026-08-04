"use client";

import { useState } from "react";
import { Bell, Menu, Search } from "lucide-react";
import { Avatar } from "./ui/Avatar";
import { platformEvents } from "@/lib/mock";
import { cn } from "@/lib/utils/cn";

export function Topbar({ onMobileMenu, username }: { onMobileMenu: () => void; username: string }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifications = platformEvents.slice(0, 5);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200/70 bg-white/80 px-4 backdrop-blur-md sm:px-6">
      <button
        type="button"
        onClick={onMobileMenu}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative hidden max-w-sm flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Search schools, tickets, invoices..."
          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-oasis-400 focus:bg-white focus:ring-4 focus:ring-oasis-100"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setNotifOpen((v) => !v);
              setProfileOpen(false);
            }}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100"
            aria-label="Notifications"
          >
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>
          {notifOpen && (
            <div className="animate-pop absolute right-0 top-12 w-80 rounded-2xl border border-slate-100 bg-white p-2 shadow-popover">
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Recent notifications</p>
              <div className="max-h-80 space-y-0.5 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="rounded-xl px-3 py-2.5 transition hover:bg-slate-50">
                    <p className="text-[13px] leading-snug text-slate-700">{n.message}</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">{n.timestamp}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setProfileOpen((v) => !v);
              setNotifOpen(false);
            }}
            className={cn(
              "flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-slate-100",
              profileOpen && "bg-slate-100"
            )}
          >
            <Avatar name={username} size={32} />
            <span className="hidden text-sm font-medium text-slate-700 sm:inline">{username}</span>
          </button>
          {profileOpen && (
            <div className="animate-pop absolute right-0 top-12 w-52 rounded-2xl border border-slate-100 bg-white p-1.5 shadow-popover">
              <div className="px-3 py-2">
                <p className="text-sm font-semibold text-slate-800">{username}</p>
                <p className="text-xs text-slate-400">Super Admin</p>
              </div>
              <div className="my-1 h-px bg-slate-100" />
              <a href="/portal/platform" className="block rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50">
                Platform settings
              </a>
              <a href="/portal/support" className="block rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50">
                Support
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
