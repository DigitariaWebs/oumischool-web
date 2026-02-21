"use client";

import { cn } from "@/lib/utils";
import {
  AvailabilitySlot,
  ScheduleSession,
  SessionMode,
  SessionStatus,
  SessionType,
  TutorSchedule,
} from "@/types";
import {
  Ban,
  CalendarOff,
  ChevronLeft,
  ChevronRight,
  MapPin,
  RefreshCw,
  User,
  Users,
  Video,
} from "lucide-react";
import React, { useRef, useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const DAY_SHORT = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MONTH_SHORT = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Juin",
  "Juil",
  "Août",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];
const MONTH_FULL = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const HOUR_START = 7;
const HOUR_END = 21;
// Each hour = 56px. Makes 30-min slot = 28px — enough for content.
const HOUR_H = 56;
const GUTTER_W = 44; // px, left hour-label column

function toMin(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}
function topPx(time: string) {
  return ((toMin(time) - HOUR_START * 60) / 60) * HOUR_H;
}
function heightPx(start: string, end: string) {
  return ((toMin(end) - toMin(start)) / 60) * HOUR_H;
}
function fmt2(n: number) {
  return String(n).padStart(2, "0");
}

// ─── Overlap layout ───────────────────────────────────────────────────────────
// Groups overlapping sessions into columns so they sit side-by-side.

interface LayoutSession {
  session: ScheduleSession;
  col: number;
  totalCols: number;
}

function layoutSessions(sessions: ScheduleSession[]): LayoutSession[] {
  // Sort by start time
  const sorted = [...sessions].sort(
    (a, b) => toMin(a.startTime) - toMin(b.startTime),
  );

  const result: LayoutSession[] = [];

  const clusters: { sessions: ScheduleSession[]; colEnds: number[] }[] = [];
  let currentCluster: {
    sessions: ScheduleSession[];
    colEnds: number[];
  } | null = null;
  let clusterEnd = 0;

  for (const s of sorted) {
    const start = toMin(s.startTime);
    const end = toMin(s.endTime);
    if (!currentCluster || start >= clusterEnd) {
      currentCluster = { sessions: [], colEnds: [] };
      clusters.push(currentCluster);
      clusterEnd = 0;
    }
    currentCluster.sessions.push(s);
    clusterEnd = Math.max(clusterEnd, end);
  }

  for (const cluster of clusters) {
    const localColEnds: number[] = [];
    const placed: { session: ScheduleSession; col: number }[] = [];

    for (const s of cluster.sessions) {
      const start = toMin(s.startTime);
      // Find the first free column
      let col = localColEnds.findIndex((e) => e <= start);
      if (col === -1) {
        col = localColEnds.length;
        localColEnds.push(0);
      }
      localColEnds[col] = toMin(s.endTime);
      placed.push({ session: s, col });
    }

    const totalCols = localColEnds.length;
    for (const { session, col } of placed) {
      result.push({ session, col, totalCols });
    }
  }

  return result;
}

// ─── Session styling ──────────────────────────────────────────────────────────
// Maps type × status → visual tokens used by both card and pill.

interface SessionStyle {
  bg: string; // card background (idle)
  bgHover: string; // card background (hovered)
  accent: string; // strong color — title, time text
  ring: string; // hover ring
  shadow: string; // hover shadow
  pillBg: string; // monthly pill background
  pillBgHover: string;
  dimmed: boolean; // cancelled / completed → reduced opacity treatment
  strikethrough: boolean;
  statusBadge?: { label: string; bg: string; color: string };
}

function getSessionStyle(
  type: SessionType,
  status: SessionStatus,
  subjectColor: string,
): SessionStyle {
  const c = subjectColor;

  // Base per type
  const typeTokens: Record<
    SessionType,
    {
      bg: string;
      bgHover: string;
      accent: string;
      ring: string;
      shadow: string;
      pillBg: string;
      pillBgHover: string;
    }
  > = {
    individual: {
      bg: `${c}14`,
      bgHover: `${c}22`,
      accent: c,
      ring: `${c}40`,
      shadow: `${c}1a`,
      pillBg: `${c}14`,
      pillBgHover: `${c}22`,
    },
    group: {
      // Groups get a slightly stronger, warmer fill to distinguish them
      bg: `${c}1c`,
      bgHover: `${c}2a`,
      accent: c,
      ring: `${c}50`,
      shadow: `${c}22`,
      pillBg: `${c}1c`,
      pillBgHover: `${c}2a`,
    },
  };

  const base = typeTokens[type];

  // Status overrides
  const statusBadge: Record<
    Exclude<SessionStatus, "scheduled">,
    { label: string; bg: string; color: string }
  > = {
    completed: {
      label: "Terminé",
      bg: "oklch(0.94 0.008 155)",
      color: "oklch(0.42 0.12 155)",
    },
    cancelled: {
      label: "Annulé",
      bg: "oklch(0.95 0.015 20)",
      color: "oklch(0.50 0.14 20)",
    },
  };

  if (status === "cancelled") {
    return {
      ...base,
      bg: "oklch(0.96 0.006 0 / 0.7)",
      bgHover: "oklch(0.94 0.008 0 / 0.8)",
      accent: "oklch(0.55 0.01 0)",
      ring: "oklch(0.80 0.01 0 / 0.6)",
      shadow: "oklch(0 0 0 / 0.04)",
      pillBg: "oklch(0.95 0.005 0 / 0.8)",
      pillBgHover: "oklch(0.93 0.008 0 / 0.9)",
      dimmed: true,
      strikethrough: false,
      statusBadge: statusBadge.cancelled,
    };
  }

  if (status === "completed") {
    return {
      ...base,
      bg: `${c}0a`,
      bgHover: `${c}12`,
      accent: `${c}99`,
      ring: `${c}25`,
      shadow: `${c}0e`,
      pillBg: `${c}0a`,
      pillBgHover: `${c}14`,
      dimmed: true,
      strikethrough: false,
      statusBadge: statusBadge.completed,
    };
  }

  return { ...base, dimmed: false, strikethrough: false };
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function ModeIcon({
  mode,
  className,
  style,
}: {
  mode: SessionMode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return mode === "online" ? (
    <Video className={cn("h-3 w-3", className)} style={style} />
  ) : (
    <MapPin className={cn("h-3 w-3", className)} style={style} />
  );
}

// ─── Shared tooltip ───────────────────────────────────────────────────────────

function SessionTooltip({
  session,
  subjectColor,
  side,
}: {
  session: ScheduleSession;
  subjectColor: string;
  side: "left" | "right";
}) {
  const isOnline = session.mode === "online";
  const isGroup = session.type === "group";
  const durationMin = toMin(session.endTime) - toMin(session.startTime);
  const style = getSessionStyle(session.type, session.status, subjectColor);
  const accent = style.accent;
  const isCancelled = session.status === "cancelled";

  return (
    <div
      className={cn(
        "absolute top-0 z-50 w-64 rounded-xl border border-border/60 bg-popover shadow-2xl pointer-events-none overflow-hidden",
        side === "left" ? "left-full ml-2" : "right-full mr-2",
      )}
    >
      {/* Header */}
      <div className="px-3 pt-3 pb-2.5" style={{ background: style.bg }}>
        {/* Status badge if non-scheduled */}
        {style.statusBadge && (
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-px text-[10px] font-semibold mb-1.5"
            style={{
              background: style.statusBadge.bg,
              color: style.statusBadge.color,
            }}
          >
            {isCancelled && <Ban className="h-2.5 w-2.5" />}
            {style.statusBadge.label}
          </span>
        )}
        <p
          className={cn(
            "text-[11px] font-bold leading-snug text-foreground",
            isCancelled && "line-through opacity-50",
          )}
        >
          {session.title}
        </p>
        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
          <span
            className="inline-flex items-center gap-1 text-[11px] font-bold tabular-nums rounded-md px-1.5 py-0.5"
            style={{ background: `${accent}22`, color: accent }}
          >
            {session.startTime} – {session.endTime}
          </span>
          <span className="text-[10px] font-medium text-muted-foreground rounded px-1.5 py-0.5 bg-muted/50 tabular-nums">
            {durationMin} min
          </span>
          {session.recurringWeekly && (
            <RefreshCw className="h-2.5 w-2.5 ml-auto opacity-40" />
          )}
        </div>
      </div>

      <div className="h-px bg-border/40" />

      <div className="px-3 py-2.5 space-y-1.5">
        {/* Mode */}
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-semibold"
            style={{ background: `${accent}12`, color: accent }}
          >
            <ModeIcon mode={session.mode} />
            {isOnline ? "En ligne" : "Présentiel"}
          </span>
          {!isOnline && session.location && (
            <span className="text-[10px] text-muted-foreground truncate">
              {session.location}
            </span>
          )}
        </div>

        {/* Type */}
        <div className="flex items-center gap-1.5">
          {isGroup ? (
            <Users className="h-3 w-3 shrink-0 text-muted-foreground" />
          ) : (
            <User className="h-3 w-3 shrink-0 text-muted-foreground" />
          )}
          <span className="text-[11px] font-medium text-foreground/80">
            {isGroup
              ? `Groupe · ${session.students.length} élève${session.students.length > 1 ? "s" : ""}`
              : (session.students[0]?.name ?? "—")}
          </span>
        </div>

        {/* Students */}
        {isGroup && session.students.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {session.students.slice(0, 6).map((s) => (
              <span
                key={s.id}
                className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium"
                style={{ background: `${accent}12`, color: accent }}
              >
                {s.name.split(" ")[0]}
              </span>
            ))}
            {session.students.length > 6 && (
              <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                +{session.students.length - 6}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Shared pill (monthly view) ───────────────────────────────────────────────

function SessionPill({
  session,
  subjectColor,
  tooltipSide,
}: {
  session: ScheduleSession;
  subjectColor: string;
  tooltipSide: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const style = getSessionStyle(session.type, session.status, subjectColor);
  const isCancelled = session.status === "cancelled";
  const isCompleted = session.status === "completed";

  return (
    <div
      className={cn("relative", style.dimmed && "opacity-60")}
      onMouseEnter={() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setOpen(true), 100);
      }}
      onMouseLeave={() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setOpen(false), 80);
      }}
    >
      <div
        className="flex items-center gap-1.5 rounded-md px-1.5 py-0.75 overflow-hidden cursor-pointer transition-all duration-100"
        style={{ background: open ? style.pillBgHover : style.pillBg }}
      >
        {/* type indicator dot */}
        <span
          className={cn(
            "shrink-0 rounded-sm",
            session.type === "group" ? "h-2 w-2" : "h-1.5 w-1.5 rounded-full",
          )}
          style={{
            background: isCancelled ? "oklch(0.70 0.01 0)" : style.accent,
          }}
        />
        <span
          className={cn(
            "text-[10px] font-bold tabular-nums shrink-0 leading-none",
            isCancelled && "line-through opacity-50",
          )}
          style={{ color: style.accent }}
        >
          {session.startTime}
        </span>
        <span
          className={cn(
            "text-[10px] font-medium truncate min-w-0 hidden sm:block leading-none",
            isCompleted ? "text-muted-foreground/60" : "text-foreground/65",
            isCancelled && "line-through opacity-40",
          )}
        >
          {session.title.split(" — ")[0].trim()}
        </span>
      </div>
      {open && (
        <SessionTooltip
          session={session}
          subjectColor={subjectColor}
          side={tooltipSide}
        />
      )}
    </div>
  );
}

// ─── Weekly session block ─────────────────────────────────────────────────────

function SessionBlock({
  layout,
  subjectColor,
  columnIndex,
  totalColumns,
}: {
  layout: LayoutSession;
  subjectColor: string;
  columnIndex: number;
  totalColumns: number;
}) {
  const { session, col, totalCols } = layout;
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const top = topPx(session.startTime);
  const h = Math.max(heightPx(session.startTime, session.endTime) - 2, 18);

  const tiny = h < 22;
  const short = h < 38;
  const medium = h < 60;

  const pct = 100 / totalCols;
  const leftPct = col * pct;
  const tooltipSide: "left" | "right" =
    columnIndex < Math.ceil(totalColumns / 2) ? "left" : "right";

  const st = getSessionStyle(session.type, session.status, subjectColor);
  const isGroup = session.type === "group";
  const isCancelled = session.status === "cancelled";
  const isCompleted = session.status === "completed";

  return (
    <div
      className={cn(
        "absolute cursor-pointer select-none",
        st.dimmed && "opacity-60",
      )}
      style={{
        top,
        height: h,
        left: `calc(${leftPct}% + 2px)`,
        width: `calc(${pct}%   - 4px)`,
        zIndex: open ? 20 : 3, // above availability strip (z=1)
      }}
      onMouseEnter={() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setOpen(true), 100);
      }}
      onMouseLeave={() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setOpen(false), 80);
      }}
    >
      {/* ── Card ── */}
      <div
        className="h-full w-full rounded-lg overflow-hidden flex flex-col transition-all duration-100"
        style={{
          background: open ? st.bgHover : st.bg,
          boxShadow: open
            ? `0 0 0 1.5px ${st.ring}, 0 4px 16px ${st.shadow}`
            : `0 1px 2px oklch(0 0 0 / 0.06)`,
        }}
      >
        {/* Type indicator bar — top edge, thin */}
        {!tiny && (
          <div
            className="w-full shrink-0"
            style={{
              height: 2,
              background: isCancelled
                ? "oklch(0.75 0.01 0)"
                : isCompleted
                  ? `${st.accent}`
                  : isGroup
                    ? st.accent
                    : `${st.accent}cc`,
              opacity: isCancelled ? 0.35 : isCompleted ? 0.4 : 1,
            }}
          />
        )}

        {tiny ? (
          <div
            className="h-full w-full"
            style={{
              background: isCancelled
                ? "oklch(0.88 0.008 0)"
                : `${st.accent}28`,
            }}
          />
        ) : short ? (
          <div className="flex items-center gap-1.5 px-2 h-full">
            {/* type shape: square=group, circle=individual */}
            <span
              className={cn(
                "shrink-0",
                isGroup ? "h-2 w-2 rounded-sm" : "h-1.5 w-1.5 rounded-full",
              )}
              style={{
                background: isCancelled ? "oklch(0.70 0.01 0)" : st.accent,
              }}
            />
            <span
              className={cn(
                "text-[10px] font-bold tabular-nums leading-none truncate",
                isCancelled && "opacity-40",
              )}
              style={{ color: st.accent }}
            >
              {session.startTime}
            </span>
          </div>
        ) : (
          <div className="flex flex-col px-2 pt-1 pb-1.5 h-full overflow-hidden gap-0.5">
            {/* Row 1: time + icons */}
            <div className="flex items-center gap-1 shrink-0 min-w-0">
              <span
                className={cn(
                  "text-[10px] font-bold tabular-nums leading-none",
                  isCancelled && "opacity-40",
                )}
                style={{ color: st.accent }}
              >
                {session.startTime}
              </span>
              {!medium && (
                <span
                  className={cn(
                    "text-[10px] tabular-nums leading-none",
                    isCancelled && "opacity-30",
                  )}
                  style={{ color: `${st.accent}90` }}
                >
                  –{session.endTime}
                </span>
              )}
              <span className="flex items-center gap-0.5 ml-auto shrink-0">
                <ModeIcon
                  mode={session.mode}
                  style={{ color: `${st.accent}80` }}
                />
                {isGroup ? (
                  <Users
                    className="h-3 w-3"
                    style={{ color: `${st.accent}60` }}
                  />
                ) : (
                  <User
                    className="h-3 w-3"
                    style={{ color: `${st.accent}60` }}
                  />
                )}
              </span>
            </div>

            {/* Row 2: title */}
            <p
              className={cn(
                "text-[10px] font-semibold leading-snug shrink-0",
                isCancelled
                  ? "line-through text-muted-foreground/50"
                  : "text-foreground/80",
                isCompleted && "text-foreground/50",
              )}
              style={{
                display: "-webkit-box",
                WebkitLineClamp: medium ? 1 : 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {session.title}
            </p>

            {/* Row 3: student footer */}
            {!medium && (
              <div className="mt-auto flex items-center gap-1 min-w-0">
                <span
                  className={cn(
                    "shrink-0 rounded-full",
                    isGroup ? "h-1.5 w-1.5 rounded-sm" : "h-1 w-1",
                  )}
                  style={{ background: `${st.accent}50` }}
                />
                <p className="text-[10px] text-muted-foreground leading-none truncate">
                  {isGroup
                    ? `${session.students.length} élève${session.students.length > 1 ? "s" : ""}`
                    : session.students[0]?.name}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {open && (
        <SessionTooltip
          session={session}
          subjectColor={subjectColor}
          side={tooltipSide}
        />
      )}
    </div>
  );
}

// ─── Weekly grid ──────────────────────────────────────────────────────────────

function WeeklyGrid({
  sessions,
  availability,
  getSubjectColor,
  weekStart,
}: {
  sessions: ScheduleSession[];
  availability: AvailabilitySlot[];
  getSubjectColor: (id: string) => string;
  weekStart: Date;
}) {
  const today = new Date();
  // Mon(1)–Sat(6)
  const visibleDays = [1, 2, 3, 4, 5, 6];
  const hours = Array.from(
    { length: HOUR_END - HOUR_START },
    (_, i) => HOUR_START + i,
  );
  const gridH = hours.length * HOUR_H;

  // Date for each column
  function dayDate(dow: number): Date {
    // weekStart is Monday
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + (dow - 1));
    return d;
  }

  function isToday(dow: number): boolean {
    const d = dayDate(dow);
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  }

  return (
    <div className="flex flex-col w-full">
      {/* ── Header row ── */}
      <div
        className="flex shrink-0 border-b border-border/60"
        style={{ paddingLeft: GUTTER_W }}
      >
        {visibleDays.map((dow) => {
          const d = dayDate(dow);
          const today_ = isToday(dow);
          return (
            <div
              key={dow}
              className="flex-1 min-w-0 py-2 flex flex-col items-center gap-0.5 border-l border-border/30 first:border-l-0"
            >
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                {DAY_SHORT[dow]}
              </span>
              <span
                className={cn(
                  "text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full",
                  today_
                    ? "bg-foreground text-background"
                    : "text-foreground/70",
                )}
              >
                {d.getDate()}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Scrollable body ── */}
      <div className="overflow-y-auto" style={{ maxHeight: 520 }}>
        <div className="flex" style={{ height: gridH }}>
          {/* Hour gutter */}
          <div className="shrink-0 relative" style={{ width: GUTTER_W }}>
            {hours.map((h, i) => (
              <div
                key={h}
                className="absolute right-0 pr-2 flex items-start"
                style={{ top: i * HOUR_H, height: HOUR_H }}
              >
                <span className="text-[10px] font-mono text-muted-foreground/50 -mt-2 leading-none">
                  {fmt2(h)}:00
                </span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {visibleDays.map((dow, colIdx) => {
            const daySessions = sessions.filter((s) => s.day === dow);
            const dayAvail = availability.filter((a) => a.day === dow);
            const laid = layoutSessions(daySessions);

            return (
              <div
                key={dow}
                className="flex-1 min-w-0 relative border-l border-border/30 first:border-l-0"
                style={{ height: gridH }}
              >
                {/* Hour lines */}
                {hours.map((h, i) => (
                  <div
                    key={h}
                    className="absolute inset-x-0 border-t border-border/25"
                    style={{ top: i * HOUR_H }}
                  />
                ))}
                {/* Half-hour lines */}
                {hours.map((h, i) => (
                  <div
                    key={`h-${h}`}
                    className="absolute inset-x-0 border-t border-border/12"
                    style={{ top: i * HOUR_H + HOUR_H / 2 }}
                  />
                ))}

                {/* Availability shading — z-index 1, sessions sit above at z-index 3 */}
                {dayAvail.map((slot, si) => {
                  const t = topPx(slot.startTime);
                  const hh = heightPx(slot.startTime, slot.endTime);
                  return (
                    <div
                      key={si}
                      className="absolute inset-x-0 pointer-events-none"
                      style={{
                        top: t,
                        height: hh,
                        zIndex: 1,
                        background: "oklch(0.58 0.16 155 / 0.07)",
                      }}
                    />
                  );
                })}

                {/* Sessions */}
                {/* Sessions at z-index 3 — always above availability strip */}
                {laid.map((l) => (
                  <SessionBlock
                    key={l.session.id}
                    layout={l}
                    subjectColor={getSubjectColor(l.session.subjectId)}
                    columnIndex={colIdx}
                    totalColumns={visibleDays.length}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Monthly grid ─────────────────────────────────────────────────────────────

function MonthlyGrid({
  sessions,
  getSubjectColor,
  year,
  month,
}: {
  sessions: ScheduleSession[];
  getSubjectColor: (id: string) => string;
  year: number;
  month: number; // 0-indexed
}) {
  const today = new Date();

  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array<null>(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  function sessionsForDay(dayOfMonth: number): ScheduleSession[] {
    const dow = new Date(year, month, dayOfMonth).getDay();
    return sessions
      .filter((s) => {
        if (s.recurringWeekly) return s.day === dow;
        if (s.date) {
          const d = new Date(s.date);
          return (
            d.getFullYear() === year &&
            d.getMonth() === month &&
            d.getDate() === dayOfMonth
          );
        }
        return false;
      })
      .sort((a, b) => toMin(a.startTime) - toMin(b.startTime));
  }

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <div className="w-full">
      {/* DOW header */}
      <div className="grid grid-cols-7 border-b border-border/60">
        {DAY_SHORT.map((d) => (
          <div
            key={d}
            className="py-2 text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wide"
          >
            {d}
          </div>
        ))}
      </div>
      {/* Weeks */}
      {weeks.map((week, wi) => (
        <div
          key={wi}
          className="grid grid-cols-7 border-b border-border/30 last:border-b-0"
        >
          {week.map((day, di) => {
            const isToday =
              day !== null &&
              today.getFullYear() === year &&
              today.getMonth() === month &&
              today.getDate() === day;
            const daySessions = day !== null ? sessionsForDay(day) : [];

            return (
              <div
                key={di}
                className={cn(
                  "min-h-22.5 p-1.5 flex flex-col gap-0.5 border-l border-border/20 first:border-l-0",
                  day === null && "bg-muted/15",
                )}
              >
                {day !== null && (
                  <>
                    <span
                      className={cn(
                        "self-start text-[11px] font-semibold w-5 h-5 flex items-center justify-center rounded-full leading-none",
                        isToday
                          ? "bg-foreground text-background"
                          : "text-muted-foreground",
                      )}
                    >
                      {day}
                    </span>
                    {daySessions.slice(0, 3).map((s) => {
                      const c = getSubjectColor(s.subjectId);
                      const side: "left" | "right" = di >= 4 ? "right" : "left";
                      return (
                        <SessionPill
                          key={s.id}
                          session={s}
                          subjectColor={c}
                          tooltipSide={side}
                        />
                      );
                    })}
                    {daySessions.length > 3 && (
                      <span className="text-[10px] text-muted-foreground px-1">
                        +{daySessions.length - 3}
                      </span>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── Availability sidebar ─────────────────────────────────────────────────────

function AvailabilityPanel({
  availability,
}: {
  availability: AvailabilitySlot[];
}) {
  const byDay: Record<number, AvailabilitySlot[]> = {};
  for (const slot of availability) {
    byDay[slot.day] = [...(byDay[slot.day] ?? []), slot];
  }
  const activeDays = [1, 2, 3, 4, 5, 6, 0].filter((d) => byDay[d]?.length);
  const green = "oklch(0.52 0.16 155)";

  return (
    <div className="dash-card overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border/60">
        <div
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: green }}
        />
        <h3 className="text-[11px] font-semibold text-foreground">
          Disponibilités
        </h3>
      </div>
      <div className="p-2.5 space-y-1.5">
        {activeDays.length === 0 ? (
          <p className="text-[11px] text-muted-foreground text-center py-3">
            Aucune disponibilité
          </p>
        ) : (
          activeDays.map((day) => (
            <div key={day} className="flex items-start gap-2">
              <span className="w-7 shrink-0 text-[10px] font-bold text-muted-foreground pt-0.5">
                {DAY_SHORT[day]}
              </span>
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                {byDay[day].map((slot, i) => (
                  <span
                    key={i}
                    className="rounded px-1.5 py-0.5 text-[10px] font-medium tabular-nums block"
                    style={{
                      background: "oklch(0.52 0.16 155 / 0.1)",
                      color: green,
                    }}
                  >
                    {slot.startTime} – {slot.endTime}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Heatmap bar */}
      {activeDays.length > 0 && (
        <div className="px-2.5 pb-2.5 pt-1">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5, 6, 0].map((day) => {
              const slots = byDay[day] ?? [];
              const mins = slots.reduce(
                (acc, s) => acc + toMin(s.endTime) - toMin(s.startTime),
                0,
              );
              const intensity = Math.min(mins / 480, 1);
              return (
                <div
                  key={day}
                  className="flex-1 flex flex-col items-center gap-0.5"
                >
                  <div
                    className="w-full rounded-sm"
                    style={{
                      height: 20,
                      background:
                        intensity > 0
                          ? `oklch(0.52 0.16 155 / ${0.15 + intensity * 0.55})`
                          : "oklch(0.93 0.005 250)",
                    }}
                    title={`${DAY_SHORT[day]}: ${Math.round(mins / 60)}h`}
                  />
                  <span className="text-[8px] text-muted-foreground/50 font-medium">
                    {DAY_SHORT[day]}
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

// ─── Stats sidebar ────────────────────────────────────────────────────────────

function WeekStats({ sessions }: { sessions: ScheduleSession[] }) {
  const weekly = sessions.filter((s) => s.recurringWeekly);
  const online = weekly.filter((s) => s.mode === "online").length;
  const presential = weekly.filter((s) => s.mode === "presential").length;
  const group = weekly.filter((s) => s.type === "group").length;
  const individual = weekly.filter((s) => s.type === "individual").length;
  const uniqueStudents = new Set(
    weekly.flatMap((s) => s.students.map((st) => st.id)),
  ).size;

  const rows = [
    {
      label: "Séances / sem.",
      value: weekly.length,
      color: "oklch(0.52 0.14 250)",
    },
    { label: "En ligne", value: online, color: "oklch(0.52 0.16 155)" },
    { label: "Présentiel", value: presential, color: "oklch(0.62 0.18 20)" },
    { label: "Groupe", value: group, color: "oklch(0.55 0.16 340)" },
    { label: "Particulier", value: individual, color: "oklch(0.65 0.14 80)" },
    {
      label: "Élèves uniques",
      value: uniqueStudents,
      color: "oklch(0.55 0.13 220)",
    },
  ];

  return (
    <div className="dash-card p-3 space-y-2.5">
      <h3 className="text-[11px] font-semibold text-foreground">
        Récapitulatif
      </h3>
      <div className="space-y-1.5">
        {rows.map(({ label, value, color }) => (
          <div key={label} className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-muted-foreground leading-none">
              {label}
            </span>
            <span
              className="text-xs font-bold tabular-nums leading-none"
              style={{ color }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Legend ───────────────────────────────────────────────────────────────────

function Legend() {
  const items: [React.ReactNode, string][] = [
    [<Video key="v" className="h-3 w-3" />, "En ligne"],
    [<MapPin key="m" className="h-3 w-3" />, "Présentiel"],
    [<User key="u" className="h-3 w-3" />, "Particulier"],
    [<Users key="us" className="h-3 w-3" />, "Groupe"],
    [
      <span
        key="av"
        className="inline-block h-2.5 w-2.5 rounded-[2px]"
        style={{
          background: "oklch(0.58 0.16 155 / 0.18)",
          borderLeft: "2px solid oklch(0.58 0.16 155 / 0.4)",
        }}
      />,
      "Disponible",
    ],
  ];

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground">
      {items.map(([icon, label]) => (
        <span key={label} className="flex items-center gap-1">
          {icon}
          {label}
        </span>
      ))}
    </div>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────

export interface ScheduleViewProps {
  schedule: TutorSchedule | undefined;
  getSubjectColor: (subjectId: string) => string;
  className?: string;
}

export function ScheduleView({
  schedule,
  getSubjectColor,
  className,
}: ScheduleViewProps) {
  type ViewMode = "week" | "month";
  const [view, setView] = useState<ViewMode>("week");
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);

  const today = new Date();

  // Compute the Monday of the current week + offset
  const currentMonday = new Date(today);
  const dow = today.getDay(); // 0=Sun
  const daysToMon = dow === 0 ? -6 : 1 - dow;
  currentMonday.setDate(today.getDate() + daysToMon + weekOffset * 7);

  const weekSat = new Date(currentMonday);
  weekSat.setDate(currentMonday.getDate() + 5);

  const weekLabel = (() => {
    const s = currentMonday;
    const e = weekSat;
    if (s.getMonth() === e.getMonth()) {
      return `${s.getDate()} – ${e.getDate()} ${MONTH_SHORT[s.getMonth()]} ${s.getFullYear()}`;
    }
    return `${s.getDate()} ${MONTH_SHORT[s.getMonth()]} – ${e.getDate()} ${MONTH_SHORT[e.getMonth()]} ${e.getFullYear()}`;
  })();

  const monthDate = new Date(
    today.getFullYear(),
    today.getMonth() + monthOffset,
    1,
  );
  const monthLabel = `${MONTH_FULL[monthDate.getMonth()]} ${monthDate.getFullYear()}`;

  if (!schedule) {
    return (
      <div
        className={cn(
          "dash-card flex flex-col items-center justify-center py-20 text-center",
          className,
        )}
      >
        <CalendarOff className="h-10 w-10 text-muted-foreground/25 mb-3" />
        <p className="text-sm font-semibold text-foreground">Aucun planning</p>
        <p className="mt-1 text-xs text-muted-foreground max-w-xs">
          Le planning de ce tuteur apparaîtra ici une fois configuré.
        </p>
      </div>
    );
  }

  const { sessions, availability } = schedule;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* View toggle */}
        <div className="flex items-center gap-0.5 rounded-lg border border-border/60 bg-muted/30 p-0.5">
          {(["week", "month"] as ViewMode[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                view === v
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {v === "week" ? "Semaine" : "Mois"}
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground tabular-nums min-w-0">
            {view === "week" ? weekLabel : monthLabel}
          </span>
          <div className="flex items-center">
            <button
              onClick={() =>
                view === "week"
                  ? setWeekOffset((o) => o - 1)
                  : setMonthOffset((o) => o - 1)
              }
              className="flex h-7 w-7 items-center justify-center rounded-l-lg border border-border/60 hover:bg-muted/50 transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() =>
                view === "week" ? setWeekOffset(0) : setMonthOffset(0)
              }
              className="h-7 px-2.5 border-y border-border/60 text-[11px] font-medium hover:bg-muted/40 transition-colors text-muted-foreground"
            >
              Auj.
            </button>
            <button
              onClick={() =>
                view === "week"
                  ? setWeekOffset((o) => o + 1)
                  : setMonthOffset((o) => o + 1)
              }
              className="flex h-7 w-7 items-center justify-center rounded-r-lg border border-border/60 hover:bg-muted/50 transition-colors"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="flex gap-4 items-start">
        {/* Calendar */}
        <div className="dash-card overflow-hidden flex-1 min-w-0">
          {view === "week" ? (
            <WeeklyGrid
              sessions={sessions}
              availability={availability}
              getSubjectColor={getSubjectColor}
              weekStart={currentMonday}
            />
          ) : (
            <MonthlyGrid
              sessions={sessions}
              getSubjectColor={getSubjectColor}
              year={monthDate.getFullYear()}
              month={monthDate.getMonth()}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="w-48 shrink-0 flex flex-col gap-3">
          <AvailabilityPanel availability={availability} />
          <WeekStats sessions={sessions} />
        </div>
      </div>

      {/* ── Legend ── */}
      <Legend />
    </div>
  );
}
