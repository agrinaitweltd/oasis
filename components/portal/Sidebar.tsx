"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, LogOut } from "lucide-react";
import { portalNav, type PortalNavItem } from "@/lib/portal-nav";
import { cn } from "@/lib/utils/cn";

export function Sidebar({
  collapsed,
  onToggle,
  schoolName,
  onLogout,
  mobileOpen,
  onMobileClose,
  nav = portalNav,
}: {
  collapsed: boolean;
  onToggle: () => void;
  schoolName: string;
  onLogout: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  nav?: PortalNavItem[];
}) {
  const pathname = usePathname();

  const content = (
    <div className="flex h-full flex-col">
      <div className={cn("flex items-center gap-2.5 px-4 py-5", collapsed && "justify-center px-0")}>
        {collapsed ? (
          <Image
            key="logo1"
            src="/images/logo1.png"
            alt="OASIS"
            width={32}
            height={32}
            unoptimized
            priority
            className="animate-pop flex-shrink-0"
            style={{ width: 32, height: 32, objectFit: "contain" }}
          />
        ) : (
          <div className="flex min-w-0 items-center gap-2.5">
            <Image
              key="logo"
              src="/images/logo.png"
              alt="OASIS"
              width={120}
              height={36}
              unoptimized
              priority
              className="animate-pop flex-shrink-0"
              style={{ width: 120, height: 36, objectFit: "contain", objectPosition: "left center" }}
            />
            <p className="truncate text-[11px] text-slate-400">{schoolName}</p>
          </div>
        )}
      </div>

      <nav className="scrollbar-thin flex-1 space-y-0.5 overflow-y-auto px-2.5 pb-4">
        {nav.map((item, i) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              title={collapsed ? item.label : undefined}
              className={cn(
                "group animate-fade-up flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-all duration-150",
                collapsed && "justify-center px-0",
                active ? "bg-oasis-50 text-oasis-700" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              )}
              style={{ animationDelay: `${i * 25}ms` }}
            >
              <Icon className={cn("h-[18px] w-[18px] flex-shrink-0 transition-transform duration-200", active && "scale-110")} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-slate-100 p-2.5">
        <button
          type="button"
          onClick={onLogout}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium text-slate-500 transition hover:bg-rose-50 hover:text-rose-600",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="h-[18px] w-[18px] flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            "hidden w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 lg:flex",
            collapsed && "justify-center px-0"
          )}
        >
          <ChevronsLeft className={cn("h-[18px] w-[18px] flex-shrink-0 transition-transform duration-300", collapsed && "rotate-180")} />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen flex-shrink-0 border-r border-slate-200/70 bg-white transition-all duration-300 lg:block",
          collapsed ? "w-[76px]" : "w-64"
        )}
      >
        {content}
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-900/40 transition-opacity duration-300 lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onMobileClose}
        aria-hidden="true"
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {content}
      </aside>
    </>
  );
}
