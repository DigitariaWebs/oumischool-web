# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.0] - 2026-04-18

### Added

- **Child lesson materials on web (V3 parity):** Calendar-event detail page now renders the linked `Lesson` with its materials list; locked materials show a 🔒 badge and disabled state with "Ressource non débloquée" caption, unlocked materials open the existing `ResourceViewer` via `studentApi.resource(id)`
- **Locked-material indicator on lesson cards:** `/student/lessons` cards show a "🔒 Verrouillé" badge when the linked lesson contains any locked material
- **Session status + meeting link on `/student/sessions/[id]`:** Full status badge (REQUESTED → ACCEPTED → PENDING_PAYMENT → SCHEDULED → COMPLETED) using extended helpers, and "Rejoindre la session" button when status is SCHEDULED and meeting link is set
- **Settings: password change + email update:** `/student/settings` wires two modals to `PUT /users/me/password` and `PUT /users/me` via new `useChangePassword` / `useUpdateProfile` hooks; validates length + confirmation + email format
- **Client-side web-role gate:** `useLogin` and `getHomeRouteByRole` now reject tutor/parent roles with a banner ("L'accès web est réservé aux élèves et administrateurs")

### Changed

- **Student lessons data source:** `StudentCalendarEvent` now carries `lesson` (with `materials` + `locked` flag) and `lessonId`; calendar-event pickers are consolidated through a single `pickCalendarEvent` helper
- **Status helpers:** `getStatusLabel` / `getStatusBadgeClasses` extended to cover `REQUESTED`, `PENDING_PAYMENT` with French labels
- **Exercises page:** Simplified — only renders backend-backed resource games (`isGame=true`) after the tabs + hardcoded mini-game section was removed

### Removed

- **Tutor + parent self-service portals:** Deleted `/src/app/tutor/` and `/src/app/parent/` — web login is now restricted to child + admin roles; admin CRUD for tutor/parent records under `/dashboard/*` is unchanged
- **Static demo lesson pages:** Deleted `/student/lessons/{french-tenses,math-fractions,science-solar-system}` — child lessons now come exclusively from backend calendar events
- **Hardcoded mini-game routes:** Deleted `/student/games/{math-addition,french-conjugation,planets-memory}` — these had hardcoded questions, no backend integration, and no activity logging
- **Dead `/lessons/assigned` endpoint usage:** Removed `studentApi.assignedLessons` + `useStudentAssignedLessons` (server endpoint was removed in the V3 lesson refactor)
- **Inert settings cards:** Removed notification preference toggles, data export, account deletion, support/feedback buttons, and dead policy links from `/student/settings` — none had backing endpoints

- **Admin Lesson Management (V3-P4a):** New `/dashboard/lessons` CRUD surface so admins can author and edit platform lessons without the mobile app
  - List page (`src/app/dashboard/lessons/page.tsx`) with search, skeleton loading state, and columns for title, matière, niveau, créateur (name + role), contenus count, série, created date
  - Create and edit flows both run in modals (no dedicated pages) via the shared `LessonForm` component (`src/app/dashboard/lessons/lesson-form.tsx`) — title, subject select, grade select (CP → 3ème), description, materials picker with per-row resource dropdown
  - `?edit=<id>` search param auto-opens the edit modal on the list page (used by the tutor detail page inline actions)
  - Row actions: Modifier / Supprimer via dropdown menu; delete confirmation modal
  - New `src/hooks/lessons/` data layer: `lessonsApi` (list/detail/create/update/delete with `grade` filter), `useLessons` / `useLesson` / `useCreateLesson` / `useUpdateLesson` / `useDeleteLesson` with cache invalidation, and `Lesson` / `LessonAuthor` types including the author's tutor/parent profile
  - Sidebar gained a "Leçons" link under **Contenu**

- **Inline Lesson Edit/Delete on Tutor Detail Page (V3-P4a):** Each lesson row in the tutor detail `TutorLessonsSection` now exposes a ⋯ menu — Modifier navigates to `/dashboard/lessons?edit=<id>` (auto-opens the edit modal), Supprimer opens an in-page confirmation modal that calls `useDeleteLesson`

- **Admin Subject Management (#2):** New `/dashboard/subjects` page — create / edit / delete subjects with color picker, icon field, and search-enabled table (`8c516e2`)

- **Student Resources Page + Session Detail:** New student-facing pages with filtering UI, resource viewer, and session detail views with loading/error states (`3cf4918`)

- **Calendar Event Management Hooks:** New hooks and functions for working with calendar events from the dashboard (`b8c270c`)

- **Mini-Games as Separate Resource Category (C10):** Admin resource detail page now supports tagging interactive resources as mini-games
  - "Mini-jeu" checkbox in the edit modal — only shown for `type: interactive` resources
  - "Mini-jeu" badge in the resource detail header when `isGame` is true
  - `isGame` field added to `AdminResource` type and `UpdateResourcePayload`

### Changed

- **Interactive resource preview:** Dashboard now opens interactive resources directly via API URL instead of proxying through a Next.js route

### Fixed

- **Welcome Text Apostrophe Escaping:** Final apostrophe escape in welcome text (`73720ee`)

### Removed

- **Google SSO Login Flow:** Dropped the client-side Google OAuth surface from the web app — deleted `/(auth)/google/callback` handler and related UI (`64d1ee4`)

- **Student Profile Page:** Removed the standalone student profile page; related components updated or consolidated into other surfaces (`b8c270c`)

- **Resource view proxy route:** Deleted `app/resource/[id]/view/route.ts` — clients now hit the API directly, eliminating an unnecessary network hop
