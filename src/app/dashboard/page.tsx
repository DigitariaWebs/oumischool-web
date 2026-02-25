"use client";

import { InfoCard, InfoCardContainer } from "@/components/ui/info-card";
import { useOverviewMetrics } from "@/hooks/overview";
import { api } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  GraduationCap,
  TrendingUp,
  Users,
  UsersRound,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  CalendarDays,
  Star,
} from "lucide-react";
import Link from "next/link";

interface SubjectOption {
  id: string;
  name: string;
}

const quickActions = [
  {
    label: "Ajouter tuteur",
    href: "/dashboard/tutors",
    icon: GraduationCap,
    color: "oklch(0.58 0.16 155)",
    bg: "oklch(0.95 0.018 155)",
  },
  {
    label: "Ajouter parent",
    href: "/dashboard/parents",
    icon: UsersRound,
    color: "oklch(0.52 0.14 250)",
    bg: "oklch(0.93 0.02 250)",
  },
  {
    label: "Ajouter étudiant",
    href: "/dashboard/students",
    icon: Users,
    color: "oklch(0.62 0.16 80)",
    bg: "oklch(0.95 0.03 80)",
  },
  {
    label: "Nouvelle ressource",
    href: "/dashboard/resources",
    icon: BookOpen,
    color: "oklch(0.60 0.18 20)",
    bg: "oklch(0.96 0.025 20)",
  },
];

const statusConfig = {
  success: {
    icon: CheckCircle2,
    color: "oklch(0.58 0.16 155)",
    bg: "oklch(0.95 0.018 155)",
  },
  pending: {
    icon: Clock,
    color: "oklch(0.62 0.16 80)",
    bg: "oklch(0.95 0.03 80)",
  },
  warning: {
    icon: AlertCircle,
    color: "oklch(0.68 0.18 20)",
    bg: "oklch(0.96 0.025 20)",
  },
  info: {
    icon: Star,
    color: "oklch(0.52 0.14 250)",
    bg: "oklch(0.93 0.02 250)",
  },
};

export default function DashboardPage() {
  const { data: metrics } = useOverviewMetrics();
  const { data: subjects = [] } = useQuery({
    queryKey: ["subjects"],
    queryFn: () => api.get<SubjectOption[]>("/subjects"),
  });
  const subjectNameById = new Map(
    subjects.map((subject) => [subject.id, subject.name]),
  );
  const upcomingColors = [
    "oklch(0.58 0.16 155)",
    "oklch(0.72 0.14 80)",
    "oklch(0.65 0.12 220)",
    "oklch(0.68 0.18 20)",
  ];

  const secondaryMetrics = [
    {
      label: "Satisfaction moy.",
      value:
        metrics?.satisfactionRate != null
          ? `${metrics.satisfactionRate.toFixed(0)}%`
          : "—",
      trend: "+2%",
      up: true,
    },
    {
      label: "Cours aujourd\u2019hui",
      value: metrics?.classesToday?.toString() ?? "—",
      trend: "+4",
      up: true,
    },
    {
      label: "Approbations en attente",
      value: metrics?.pendingApprovals?.toString() ?? "—",
      trend: "-3",
      up: false,
    },
    {
      label: "Sessions actives",
      value: metrics?.activeSessions?.toString() ?? "—",
      trend: "+11",
      up: true,
    },
  ];

  const recentActivityItems = metrics?.recentActivity?.length
    ? metrics.recentActivity.map((item, index) => ({
        id: item.sessionId || `activity-${index}`,
        action: `Session ${String(item.status ?? "").toLowerCase() || "mise à jour"}`,
        name: `${item.tutorName} • ${item.childName}`,
        subject: item.startTime
          ? new Date(item.startTime).toLocaleString("fr-FR")
          : "Mise à jour récente",
        time: item.updatedAt
          ? new Date(item.updatedAt).toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "—",
        status:
          String(item.status ?? "").toUpperCase() === "PENDING"
            ? "pending"
            : String(item.status ?? "").toUpperCase() === "CANCELLED"
              ? "warning"
              : "success",
      }))
    : [];

  const upcomingClassItems = metrics?.upcomingClasses?.length
    ? metrics.upcomingClasses.map((item, index) => ({
        id: item.sessionId || `upcoming-${index}`,
        subject: item.subjectId
          ? (subjectNameById.get(item.subjectId) ?? "Cours planifié")
          : "Cours planifié",
        tutor: item.tutorName,
        time: `${new Date(item.startTime).toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        })} – ${new Date(item.endTime).toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        })}`,
        date: new Date(item.startTime).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "short",
        }),
        students: 1,
        color: upcomingColors[index % upcomingColors.length],
      }))
    : [];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top bar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-background px-6">
        <div>
          <h1 className="text-base font-semibold text-foreground tracking-tight">
            Tableau de bord
          </h1>
          <p className="text-xs text-muted-foreground">
            Jeudi, 20 février 2026 — Bienvenue, Admin
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-medium"
            style={{
              background: "oklch(0.95 0.018 155)",
              borderColor: "oklch(0.85 0.06 155)",
              color: "oklch(0.42 0.12 155)",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "oklch(0.58 0.16 155)" }}
            />
            Tous les systèmes opérationnels
          </div>
        </div>
      </header>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Stat cards */}
          <InfoCardContainer>
            <InfoCard
              icon={GraduationCap}
              title="Total des tuteurs"
              value={metrics?.approvedTutors?.toString() ?? "—"}
              subtext={`${metrics?.pendingApprovals ?? 0} en attente`}
              color="green"
            />
            <InfoCard
              icon={UsersRound}
              title="Utilisateurs"
              value={metrics?.users?.toString() ?? "—"}
              subtext={`${metrics?.activeSubscriptions ?? 0} abonnements actifs`}
              color="blue"
            />
            <InfoCard
              icon={Users}
              title="Sessions totales"
              value={metrics?.sessions?.toString() ?? "—"}
              subtext={`${metrics?.activeSessions ?? 0} actives`}
              color="orange"
            />
            <InfoCard
              icon={BookOpen}
              title="Satisfaction"
              value={
                metrics?.satisfactionRate != null
                  ? `${metrics.satisfactionRate.toFixed(0)}%`
                  : "—"
              }
              subtext="Moyenne plateforme"
              color="purple"
            />
          </InfoCardContainer>

          {/* Secondary metrics row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {secondaryMetrics.map((m) => (
              <div key={m.label} className="dash-card p-4">
                <p className="text-xs text-muted-foreground">{m.label}</p>
                <div className="flex items-end justify-between mt-1">
                  <span className="text-2xl font-bold text-foreground">
                    {m.value}
                  </span>
                  <span
                    className="stat-pill"
                    style={
                      m.up
                        ? {
                            background: "oklch(0.95 0.018 155)",
                            color: "oklch(0.42 0.12 155)",
                          }
                        : {
                            background: "oklch(0.96 0.025 20)",
                            color: "oklch(0.48 0.16 20)",
                          }
                    }
                  >
                    <TrendingUp className="h-3 w-3" />
                    {m.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent activity */}
            <div className="lg:col-span-2 dash-card">
              <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
                <h2 className="text-sm font-semibold text-foreground">
                  Activité récente
                </h2>
                <span className="text-xs text-muted-foreground">
                  Aujourd&apos;hui
                </span>
              </div>
              <div className="divide-y divide-border/40">
                {recentActivityItems.map((item) => {
                  const cfg =
                    statusConfig[item.status as keyof typeof statusConfig];
                  const StatusIcon = cfg.icon;
                  return (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 px-5 py-3.5 hover:bg-muted/30 transition-colors"
                    >
                      <div
                        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                        style={{ background: cfg.bg }}
                      >
                        <StatusIcon
                          className="h-3.5 w-3.5"
                          style={{ color: cfg.color }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground/80">
                          {item.action}
                        </p>
                        <p className="text-sm font-semibold text-foreground truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.subject}
                        </p>
                      </div>
                      <span className="shrink-0 text-[11px] text-muted-foreground/60 pt-0.5">
                        {item.time}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-6">
              {/* Quick actions */}
              <div className="dash-card p-5">
                <h2 className="text-sm font-semibold text-foreground mb-3">
                  Actions rapides
                </h2>
                <div className="grid grid-cols-2 gap-2.5">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <Link
                        key={action.href}
                        href={action.href}
                        className="group flex flex-col items-center gap-2 rounded-xl p-3 text-center transition-all hover:scale-[1.02] hover:shadow-sm"
                        style={{
                          background: action.bg,
                          border: `1px solid ${action.color}22`,
                        }}
                      >
                        <Icon
                          className="h-5 w-5"
                          style={{ color: action.color }}
                        />
                        <span
                          className="text-xs font-medium"
                          style={{ color: action.color }}
                        >
                          {action.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Upcoming classes */}
              <div className="dash-card flex-1">
                <div className="flex items-center justify-between border-b border-border/60 px-4 py-3.5">
                  <h2 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    Cours à venir
                  </h2>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-0.5 text-xs font-medium hover:underline"
                    style={{ color: "oklch(0.52 0.14 155)" }}
                  >
                    Voir tout
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="p-3 space-y-2">
                  {upcomingClassItems.map((cls) => (
                    <div
                      key={cls.id}
                      className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-muted/30"
                      style={{
                        border: `1px solid ${cls.color}18`,
                        background: `${cls.color}08`,
                      }}
                    >
                      <div
                        className="mt-0.5 h-2 w-2 shrink-0 rounded-full"
                        style={{ background: cls.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {cls.subject}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {cls.tutor}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className="text-[10px] font-medium"
                            style={{ color: cls.color }}
                          >
                            {cls.date} · {cls.time}
                          </span>
                        </div>
                      </div>
                      <span className="shrink-0 text-[10px] font-medium text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                        {cls.students} étudiants
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
