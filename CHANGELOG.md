# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

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
