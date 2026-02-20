"use client";

import { InfoCard, InfoCardContainer } from "@/components/ui/info-card";
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

const recentActivity = [
  {
    id: 1,
    type: "tutor",
    action: "Nouveau tuteur inscrit",
    name: "Aalvina Fatehi",
    subject: "Physique",
    time: "il y a 2 min",
    status: "pending",
  },
  {
    id: 2,
    type: "parent",
    action: "Parent a inscrit des enfants",
    name: "Paulo Gavi",
    subject: "2 enfants ajoutés",
    time: "il y a 18 min",
    status: "success",
  },
  {
    id: 3,
    type: "resource",
    action: "Ressource publiée",
    name: "Conception UI de base",
    subject: "Design • Module 1",
    time: "il y a 1 h",
    status: "success",
  },
  {
    id: 4,
    type: "student",
    action: "Étudiant a terminé l&apos;examen",
    name: "Alex Sanches",
    subject: "Typographie — 94%",
    time: "il y a 2 h",
    status: "success",
  },
  {
    id: 5,
    type: "tutor",
    action: "Horaire du tuteur mis à jour",
    name: "Mariam Khoury",
    subject: "Mathématiques",
    time: "il y a 3 h",
    status: "info",
  },
  {
    id: 6,
    type: "parent",
    action: "Compte parent signalé",
    name: "Carlos Mendez",
    subject: "Paiement en retard",
    time: "il y a 5 h",
    status: "warning",
  },
];

const upcomingClasses = [
  {
    id: 1,
    subject: "Histoire de la physique",
    tutor: "Aalvina Fatehi",
    time: "12 h – 15 h",
    date: "20 fév",
    students: 12,
    color: "oklch(0.58 0.16 155)",
  },
  {
    id: 2,
    subject: "Conception UI de base",
    tutor: "Sara Benali",
    time: "08:00 – 09:30",
    date: "20 fév",
    students: 8,
    color: "oklch(0.72 0.14 80)",
  },
  {
    id: 3,
    subject: "Géométrie",
    tutor: "Omar Hadj",
    time: "09:00 – 11:00",
    date: "21 fév",
    students: 15,
    color: "oklch(0.65 0.12 220)",
  },
  {
    id: 4,
    subject: "Couleurs et éléments",
    tutor: "Nina Roussel",
    time: "10:00 – 12:00",
    date: "21 fév",
    students: 10,
    color: "oklch(0.68 0.18 20)",
  },
];

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
              value="184"
              subtext="+6 ce mois"
              color="green"
            />
            <InfoCard
              icon={UsersRound}
              title="Parents actifs"
              value="872"
              subtext="+23 ce mois"
              color="blue"
            />
            <InfoCard
              icon={Users}
              title="Étudiants inscrits"
              value="2,418"
              subtext="+112 ce mois"
              color="orange"
            />
            <InfoCard
              icon={BookOpen}
              title="Ressources"
              value="3,204"
              subtext="+48 publiées"
              color="purple"
            />
          </InfoCardContainer>

          {/* Secondary metrics row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: "Satisfaction moy.",
                value: "96%",
                trend: "+2%",
                up: true,
              },
              {
                label: "Cours aujourd&apos;hui",
                value: "24",
                trend: "+4",
                up: true,
              },
              {
                label: "Approbations en attente",
                value: "7",
                trend: "-3",
                up: false,
              },
              {
                label: "Sessions actives",
                value: "11",
                trend: "+11",
                up: true,
              },
            ].map((m) => (
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
                {recentActivity.map((item) => {
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
                  {upcomingClasses.map((cls) => (
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
