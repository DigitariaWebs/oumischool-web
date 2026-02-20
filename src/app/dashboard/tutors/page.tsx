"use client";

import type { ColumnDef } from "@/components/ui/DataTable";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getSubjectColor,
  getSubjectName,
  mockSubjects,
  mockTutors,
} from "@/lib/data/tutors";
import { Tutor, TutorStatus } from "@/types";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  GraduationCap,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  Star,
  Users,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// ─── Quick-view modal content ────────────────────────────────────────────────

function TutorQuickView({ tutor }: { tutor: Tutor }) {
  const primarySubjectId = tutor.subjectIds[0];
  const color = getSubjectColor(primarySubjectId);
  const initials = tutor.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6">
      {/* Profile header */}
      <div className="flex items-start gap-4">
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-sm"
          style={{ background: color }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-semibold text-foreground">
              {tutor.name}
            </h3>
            <StatusBadge status={tutor.status} />
          </div>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            {tutor.subjectIds.map((sid) => (
              <span key={sid} className="flex items-center gap-1">
                <BookOpen
                  className="h-3.5 w-3.5"
                  style={{ color: getSubjectColor(sid) }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: getSubjectColor(sid) }}
                >
                  {getSubjectName(sid)}
                </span>
              </span>
            ))}
            <span className="text-muted-foreground/40">·</span>
            <span className="text-xs text-muted-foreground">
              {tutor.experience} d&apos;expérience
            </span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {tutor.bio}
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          {
            label: "Étudiants",
            value: tutor.students || "—",
            icon: Users,
            color: "oklch(0.52 0.14 250)",
            bg: "oklch(0.93 0.02 250)",
          },
          {
            label: "Évaluation",
            value: tutor.rating ? tutor.rating.toFixed(1) : "—",
            icon: Star,
            color: "oklch(0.62 0.16 80)",
            bg: "oklch(0.95 0.03 80)",
          },
          {
            label: "Cours",
            value: tutor.totalClasses || "—",
            icon: CalendarDays,
            color,
            bg: `${color}18`,
          },
          {
            label: "Achèvement",
            value: tutor.completionRate ? `${tutor.completionRate}%` : "—",
            icon: CheckCircle2,
            color: "oklch(0.58 0.16 155)",
            bg: "oklch(0.95 0.018 155)",
          },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="flex flex-col items-center gap-1.5 rounded-xl p-3"
              style={{ background: s.bg }}
            >
              <Icon className="h-4 w-4" style={{ color: s.color }} />
              <span className="text-base font-bold" style={{ color: s.color }}>
                {s.value}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Contact & details */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Mail, label: tutor.email },
          { icon: Phone, label: tutor.phone },
          { icon: MapPin, label: tutor.location },
          {
            icon: Clock,
            label: tutor.responseTime
              ? `Répond ${tutor.responseTime}`
              : "Temps de réponse N/D",
          },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/30 px-3 py-2.5"
          >
            <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="text-xs text-foreground/80 truncate">{label}</span>
          </div>
        ))}
      </div>

      {/* Qualifications */}
      {tutor.qualifications.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
            Diplômes
          </p>
          <ul className="space-y-1.5">
            {tutor.qualifications.map((q) => (
              <li key={q} className="flex items-start gap-2 text-sm">
                <GraduationCap
                  className="mt-0.5 h-3.5 w-3.5 shrink-0"
                  style={{ color }}
                />
                <span className="text-foreground/80">{q}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Upcoming classes preview */}
      {tutor.upcomingClasses.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
            Cours à venir
          </p>
          <div className="space-y-2">
            {tutor.upcomingClasses.slice(0, 2).map((cls) => {
              const clsColor = getSubjectColor(cls.subjectId);
              return (
                <div
                  key={cls.subjectId + cls.date}
                  className="flex items-center justify-between rounded-xl border border-border/50 px-3 py-2"
                  style={{ background: `${clsColor}08` }}
                >
                  <div>
                    <p className="text-xs font-medium text-foreground">
                      {getSubjectName(cls.subjectId)}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {cls.date} · {cls.time}
                    </p>
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                    {cls.students} étudiants
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Row actions ─────────────────────────────────────────────────────────────

function TutorActions({
  tutor,
  onView,
  onApprove,
  onReject,
}: {
  tutor: Tutor;
  onView: (t: Tutor) => void;
  onApprove?: (t: Tutor) => void;
  onReject?: (t: Tutor) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 rounded-lg p-0 text-muted-foreground hover:text-foreground"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem
          className="gap-2 text-xs"
          onClick={() => onView(tutor)}
        >
          <Eye className="h-3.5 w-3.5" />
          Aperçu rapide
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 text-xs" asChild>
          <Link href={`/dashboard/tutors/${tutor.id}`}>
            <ExternalLink className="h-3.5 w-3.5" />
            Profil complet
          </Link>
        </DropdownMenuItem>
        {tutor.status === "pending" && onApprove && onReject && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 text-xs text-green-700 focus:text-green-700 focus:bg-green-50"
              onClick={() => onApprove(tutor)}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Approuver
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 text-xs text-red-600 focus:text-red-600 focus:bg-red-50"
              onClick={() => onReject(tutor)}
            >
              <XCircle className="h-3.5 w-3.5" />
              Rejeter
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Column definitions ───────────────────────────────────────────────────────

function buildColumns(
  onView: (t: Tutor) => void,
  onApprove?: (t: Tutor) => void,
  onReject?: (t: Tutor) => void,
): ColumnDef<Tutor>[] {
  return [
    {
      key: "name",
      label: "Tuteur",
      sortable: true,
      render: (tutor) => {
        const initials = tutor.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();
        const color = getSubjectColor(tutor.subjectIds[0]);
        return (
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: color }}
            >
              {initials}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {tutor.name}
              </p>
              <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Mail className="h-3 w-3" />
                {tutor.email}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      key: "subjectIds",
      label: "Matière(s)",
      sortable: false,
      render: (tutor) => (
        <div className="flex flex-wrap gap-1.5">
          {tutor.subjectIds.map((sid) => (
            <div key={sid} className="flex items-center gap-1">
              <BookOpen
                className="h-3.5 w-3.5"
                style={{ color: getSubjectColor(sid) }}
              />
              <span className="text-sm" style={{ color: getSubjectColor(sid) }}>
                {getSubjectName(sid)}
              </span>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "status",
      label: "Statut",
      sortable: true,
      render: (tutor) => <StatusBadge status={tutor.status} />,
    },
    {
      key: "students",
      label: "Étudiants",
      sortable: true,
      render: (tutor) => (
        <span className="text-sm font-medium text-foreground">
          {tutor.students || "—"}
        </span>
      ),
    },
    {
      key: "rating",
      label: "Évaluation",
      sortable: true,
      render: (tutor) => {
        if (!tutor.rating)
          return <span className="text-xs text-muted-foreground">—</span>;
        return (
          <div className="flex items-center gap-1">
            <Star
              className="h-3.5 w-3.5 fill-current"
              style={{ color: "oklch(0.72 0.14 80)" }}
            />
            <span className="text-sm font-medium">
              {tutor.rating.toFixed(1)}
            </span>
          </div>
        );
      },
    },
    {
      key: "experience",
      label: "Expérience",
      sortable: false,
      render: (tutor) => (
        <span className="text-sm text-muted-foreground">
          {tutor.experience}
        </span>
      ),
    },
    {
      key: "location",
      label: "Emplacement",
      sortable: true,
      render: (tutor) => (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          {tutor.location}
        </div>
      ),
    },
    {
      key: "joinedDate",
      label: "Rejoint",
      sortable: true,
      render: (tutor) => (
        <span className="text-sm text-muted-foreground">
          {tutor.joinedDate}
        </span>
      ),
    },
    {
      key: "id",
      label: "Actions",
      sortable: false,
      render: (tutor) => (
        <TutorActions
          tutor={tutor}
          onView={onView}
          onApprove={onApprove}
          onReject={onReject}
        />
      ),
    },
  ];
}

// ─── Pending-specific columns (slimmer) ──────────────────────────────────────

function buildPendingColumns(
  onView: (t: Tutor) => void,
  onApprove: (t: Tutor) => void,
  onReject: (t: Tutor) => void,
): ColumnDef<Tutor>[] {
  return [
    {
      key: "name",
      label: "Candidat",
      sortable: true,
      render: (tutor) => {
        const initials = tutor.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();
        const color = getSubjectColor(tutor.subjectIds[0]);
        return (
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: color }}
            >
              {initials}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {tutor.name}
              </p>
              <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Mail className="h-3 w-3" />
                {tutor.email}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      key: "subjectIds",
      label: "Matière(s)",
      sortable: false,
      render: (tutor) => (
        <div className="flex flex-wrap gap-1.5">
          {tutor.subjectIds.map((sid) => (
            <div key={sid} className="flex items-center gap-1">
              <BookOpen
                className="h-3.5 w-3.5"
                style={{ color: getSubjectColor(sid) }}
              />
              <span className="text-sm" style={{ color: getSubjectColor(sid) }}>
                {getSubjectName(sid)}
              </span>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "experience",
      label: "Expérience",
      sortable: false,
      render: (tutor) => (
        <span className="text-sm text-muted-foreground">
          {tutor.experience}
        </span>
      ),
    },
    {
      key: "location",
      label: "Emplacement",
      sortable: true,
      render: (tutor) => (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          {tutor.location}
        </div>
      ),
    },
    {
      key: "phone",
      label: "Téléphone",
      sortable: false,
      render: (tutor) => (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Phone className="h-3.5 w-3.5 shrink-0" />
          {tutor.phone}
        </div>
      ),
    },
    {
      key: "joinedDate",
      label: "Appliqué",
      sortable: true,
      render: (tutor) => (
        <span className="text-sm text-muted-foreground">
          {tutor.joinedDate}
        </span>
      ),
    },
    {
      key: "id",
      label: "Actions",
      sortable: false,
      render: (tutor) => (
        <TutorActions
          tutor={tutor}
          onView={onView}
          onApprove={onApprove}
          onReject={onReject}
        />
      ),
    },
  ];
}

// ─── Add form default ─────────────────────────────────────────────────────────

const defaultFormState = {
  name: "",
  email: "",
  phone: "",
  subjectIds: [] as string[],
  experience: "",
  status: "pending" as TutorStatus,
};

const filters = [
  {
    key: "subjectIds",
    label: "Matière",
    options: mockSubjects.map((s) => ({ label: s.name, value: s.id })),
  },
  {
    key: "status",
    label: "Statut",
    options: [
      { label: "Tous", value: "all" },
      { label: "Actif", value: "active" },
      { label: "Inactif", value: "inactive" },
      { label: "En attente", value: "pending" },
    ],
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TutorsPage() {
  const [tutors, setTutors] = useState<Tutor[]>(mockTutors);
  const [addOpen, setAddOpen] = useState(false);
  const [viewTutor, setViewTutor] = useState<Tutor | null>(null);
  const [form, setForm] = useState<{
    name: string;
    email: string;
    phone: string;
    subjectIds: string[];
    experience: string;
    status: "active" | "inactive" | "pending";
  }>(defaultFormState);

  const activeTutors = tutors.filter((t) => t.status !== "pending");
  const pendingTutors = tutors.filter((t) => t.status === "pending");

  const handleAdd = () => {
    if (!form.name || !form.email || !form.subjectIds.length) return;
    const newTutor: Tutor = {
      id: `t${Date.now()}`,
      name: form.name,
      email: form.email,
      phone: form.phone,
      subjectIds: form.subjectIds,
      status: "pending",
      students: 0,
      rating: 0,
      joinedDate: new Date().toLocaleDateString("en-GB", {
        month: "short",
        year: "numeric",
      }),
      experience: form.experience || "N/A",
      bio: "",
      location: "—",
      languages: [],
      availability: "—",
      classesThisMonth: 0,
      totalClasses: 0,
      completionRate: 0,
      responseTime: "N/A",
      qualifications: [],
      recentStudents: [],
      upcomingClasses: [],
      monthlyEarnings: 0,
    };
    setTutors((prev) => [newTutor, ...prev]);
    setForm(defaultFormState);
    setAddOpen(false);
  };

  const handleApprove = (tutor: Tutor) => {
    setTutors((prev) =>
      prev.map((t) => (t.id === tutor.id ? { ...t, status: "active" } : t)),
    );
  };

  const handleReject = (tutor: Tutor) => {
    setTutors((prev) => prev.filter((t) => t.id !== tutor.id));
  };

  const allColumns = buildColumns(setViewTutor);
  // filter by subjectIds array membership
  const pendingColumns = buildPendingColumns(
    setViewTutor,
    handleApprove,
    handleReject,
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-background px-6">
        <div>
          <h1 className="flex items-center gap-2 text-base font-semibold text-foreground tracking-tight">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            Tuteurs
          </h1>
          <p className="text-xs text-muted-foreground">
            {activeTutors.length} actifs
            {pendingTutors.length > 0 && (
              <>
                {" · "}
                <span
                  className="font-medium"
                  style={{ color: "oklch(0.52 0.14 80)" }}
                >
                  {pendingTutors.length} en attente de révision
                </span>
              </>
            )}
          </p>
        </div>
        <Button
          size="sm"
          className="gap-1.5 rounded-xl text-white"
          style={{ background: "oklch(0.58 0.16 155)" }}
          onClick={() => setAddOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Ajouter tuteur
        </Button>
      </header>

      {/* Tabs + content */}
      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="all" className="h-full">
          <div className="border-b border-border/60 bg-background px-6 pt-3">
            <TabsList variant="line">
              <TabsTrigger value="all" className="gap-1.5">
                Tous les tuteurs
                <span
                  className="rounded-full px-1.5 py-0 text-[10px] font-semibold"
                  style={{
                    background: "oklch(0.94 0.008 80)",
                    color: "oklch(0.48 0.02 250)",
                  }}
                >
                  {activeTutors.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="pending" className="gap-1.5">
                En attente de révision
                {pendingTutors.length > 0 && (
                  <span
                    className="rounded-full px-1.5 py-0 text-[10px] font-semibold"
                    style={{
                      background: "oklch(0.96 0.03 80)",
                      color: "oklch(0.52 0.14 80)",
                    }}
                  >
                    {pendingTutors.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="p-6">
            <DataTable
              data={activeTutors}
              columns={allColumns}
              filters={filters}
              searchKeys={["name", "email", "location"]}
              itemsPerPage={8}
              onRowClick={setViewTutor}
            />
          </TabsContent>

          <TabsContent value="pending" className="p-6">
            {pendingTutors.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ background: "oklch(0.95 0.018 155)" }}
                >
                  <CheckCircle2
                    className="h-7 w-7"
                    style={{ color: "oklch(0.58 0.16 155)" }}
                  />
                </div>
                <p className="text-sm font-medium text-foreground">
                  Aucune demande en attente
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Toutes les demandes de tuteur ont été examinées.
                </p>
              </div>
            ) : (
              <>
                <div
                  className="mb-4 flex items-start gap-3 rounded-xl border px-4 py-3"
                  style={{
                    background: "oklch(0.96 0.03 80)",
                    borderColor: "oklch(0.88 0.08 80)",
                  }}
                >
                  <Clock
                    className="mt-0.5 h-4 w-4 shrink-0"
                    style={{ color: "oklch(0.52 0.14 80)" }}
                  />
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "oklch(0.42 0.12 80)" }}
                  >
                    <strong>
                      {pendingTutors.length} demande de tuteur
                      {pendingTutors.length > 1 ? "s" : ""}
                    </strong>{" "}
                    en attente de révision. Utilisez <strong>Approuver</strong>{" "}
                    pour activer ou <strong>Rejeter</strong> pour supprimer le
                    candidat. Vous pouvez également voir les détails complets
                    avant de décider.
                  </p>
                </div>
                <DataTable
                  data={pendingTutors}
                  columns={pendingColumns}
                  searchKeys={["name", "email"]}
                  itemsPerPage={8}
                  onRowClick={setViewTutor}
                />
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Quick-view modal */}
      <Modal
        open={!!viewTutor}
        onOpenChange={(open) => !open && setViewTutor(null)}
        type="details"
        title="Profil du tuteur"
        description="Aperçu rapide — ouvrez le profil complet pour tous les détails."
        size="md"
        icon={null}
        actions={{
          primary: viewTutor
            ? {
                label: "Ouvrir le profil complet",
                onClick: () => {
                  window.location.href = `/dashboard/tutors/${viewTutor.id}`;
                },
                icon: <ExternalLink className="h-3.5 w-3.5" />,
              }
            : undefined,
          secondary: {
            label: "Fermer",
            onClick: () => setViewTutor(null),
            variant: "outline",
          },
        }}
      >
        {viewTutor && <TutorQuickView tutor={viewTutor} />}
      </Modal>

      {/* Add Tutor modal */}
      <Modal
        open={addOpen}
        onOpenChange={setAddOpen}
        type="form"
        title="Ajouter un nouveau tuteur"
        description="Remplissez les détails pour inscrire un nouveau tuteur sur la plateforme."
        size="md"
        actions={{
          primary: { label: "Ajouter tuteur", onClick: handleAdd },
          secondary: {
            label: "Annuler",
            onClick: () => {
              setForm(defaultFormState);
              setAddOpen(false);
            },
            variant: "outline",
          },
        }}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="tutor-name">Nom complet</Label>
              <Input
                id="tutor-name"
                placeholder="ex. Aalvina Fatehi"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tutor-email">E-mail</Label>
              <Input
                id="tutor-email"
                type="email"
                placeholder="tutor@oumischool.com"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="tutor-phone">Téléphone</Label>
              <Input
                id="tutor-phone"
                placeholder="+1 514 555 0100"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tutor-experience">Expérience</Label>
              <Input
                id="tutor-experience"
                placeholder="ex. 3 ans"
                value={form.experience}
                onChange={(e) =>
                  setForm((f) => ({ ...f, experience: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Matières</Label>
              <div className="flex flex-col gap-1.5 rounded-lg border border-input bg-background p-2">
                {mockSubjects.map((s) => (
                  <label
                    key={s.id}
                    className="flex items-center gap-2 cursor-pointer px-1 py-0.5 rounded hover:bg-muted/50"
                  >
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={form.subjectIds.includes(s.id)}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          subjectIds: e.target.checked
                            ? [...f.subjectIds, s.id]
                            : f.subjectIds.filter((id) => id !== s.id),
                        }))
                      }
                    />
                    <BookOpen className="h-3 w-3" style={{ color: s.color }} />
                    <span className="text-sm">{s.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Statut</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, status: v as Tutor["status"] }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
