"use client";

import { cn } from "@/lib/utils";
import {
  BookOpen,
  ChevronRight,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  {
    label: "Aperçu",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Tuteurs",
    href: "/dashboard/tutors",
    icon: GraduationCap,
    exact: false,
  },
  {
    label: "Parents",
    href: "/dashboard/parents",
    icon: UsersRound,
    exact: false,
  },
  {
    label: "Étudiants",
    href: "/dashboard/students",
    icon: Users,
    exact: false,
  },
  {
    label: "Ressources",
    href: "/dashboard/resources",
    icon: BookOpen,
    exact: false,
  },
];

const bottomItems = [
  {
    label: "Paramètres",
    href: "/dashboard/settings",
    icon: Settings,
    exact: false,
  },
];

function NavItem({
  item,
  collapsed,
  active,
}: {
  item: (typeof navItems)[number];
  collapsed: boolean;
  active: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        collapsed && "justify-center px-2",
      )}
    >
      <Icon
        className={cn(
          "h-[18px] w-[18px] shrink-0 transition-colors",
          active
            ? "text-primary-foreground"
            : "text-sidebar-foreground/50 group-hover:text-sidebar-accent-foreground",
        )}
      />
      {!collapsed && <span className="truncate">{item.label}</span>}
      {!collapsed && active && (
        <ChevronRight className="ml-auto h-3.5 w-3.5 text-primary-foreground/60" />
      )}
      {collapsed && (
        <div className="pointer-events-none absolute left-full ml-3 hidden rounded-lg border border-sidebar-border bg-popover px-2.5 py-1.5 text-xs font-medium text-popover-foreground shadow-md group-hover:block whitespace-nowrap z-50">
          {item.label}
        </div>
      )}
    </Link>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "relative flex h-full flex-col border-r border-sidebar-border transition-all duration-200 ease-in-out",
          collapsed ? "w-[64px]" : "w-[220px]",
        )}
        style={{ background: "oklch(0.195 0.025 250)" }}
      >
        {/* Subtle top accent line */}
        <div
          className="absolute inset-x-0 top-0 h-[2px]"
          style={{ background: "oklch(0.58 0.16 155)" }}
        />

        {/* Logo */}
        <div
          className={cn(
            "flex h-16 shrink-0 items-center border-b border-sidebar-border px-4",
            collapsed && "justify-center px-2",
          )}
        >
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
            style={{ background: "oklch(0.58 0.16 155)" }}
          >
            <GraduationCap className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <span className="ml-2.5 text-sm font-semibold tracking-tight text-white">
              OumiSchool
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {!collapsed && (
            <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/30">
              Navigation
            </p>
          )}
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              collapsed={collapsed}
              active={
                item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href)
              }
            />
          ))}

          <div className="mt-auto flex flex-col gap-1 pt-4">
            {!collapsed && <div className="mb-1 h-px bg-sidebar-border/60" />}
            {bottomItems.map((item) => (
              <NavItem
                key={item.href}
                item={item}
                collapsed={collapsed}
                active={pathname.startsWith(item.href)}
              />
            ))}
            <button
              className={cn(
                "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-all hover:bg-destructive/15 hover:text-red-400",
                collapsed && "justify-center px-2",
              )}
              onClick={() => (window.location.href = "/login")}
            >
              <LogOut className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && <span>Se déconnecter</span>}
              {collapsed && (
                <div className="pointer-events-none absolute left-full ml-3 hidden rounded-lg border border-sidebar-border bg-popover px-2.5 py-1.5 text-xs font-medium text-popover-foreground shadow-md group-hover:block whitespace-nowrap z-50">
                  Se déconnecter
                </div>
              )}
            </button>
          </div>
        </nav>

        {/* Admin badge */}
        {!collapsed && (
          <div className="border-t border-sidebar-border p-3">
            <div
              className="flex items-center gap-2.5 rounded-xl p-2.5"
              style={{ background: "oklch(0.24 0.025 250)" }}
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ background: "oklch(0.58 0.16 155)" }}
              >
                A
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-white">
                  Utilisateur Admin
                </p>
                <p
                  className="truncate text-[10px]"
                  style={{ color: "oklch(0.52 0.02 250)" }}
                >
                  admin@oumischool.com
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-[72px] z-10 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground/50 shadow-sm transition-colors hover:text-sidebar-foreground"
          style={{ background: "oklch(0.26 0.03 250)" }}
        >
          <ChevronRight
            className={cn(
              "h-3 w-3 transition-transform duration-200",
              collapsed ? "" : "rotate-180",
            )}
          />
        </button>
      </aside>

      {/* Main */}
      <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  );
}
