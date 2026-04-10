"use client";

import { StudentPageHeader } from "../_components/common";
import { NotebookIllustration } from "../_components/illustrations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Clock,
  Target,
  ArrowRight,
  Zap,
  Award,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

// Mock data - à remplacer par une vraie requête API
const allLessons = [
  {
    id: "math-fractions",
    path: "/student/lessons/math-fractions",
    title: "Fractions",
    subject: "Mathématiques",
    level: "CE2",
    duration: "45 min",
    description: "Comprendre ce qu'est une fraction: numérateur / dénominateur",
    progress: 60,
    status: "in_progress",
    difficulty: "Moyen",
    icon: "📐",
  },
  {
    id: "math-addition",
    path: "/student/lessons/math-addition",
    title: "Addition des nombres entiers",
    subject: "Mathématiques",
    level: "CE1",
    duration: "30 min",
    description: "Maîtriser l'addition avec des nombres jusqu'à 100",
    progress: 100,
    status: "completed",
    difficulty: "Facile",
    icon: "➕",
  },
  {
    id: "french-conjugaison",
    path: "/student/lessons/french-conjugaison",
    title: "Conjugaison: Le présent",
    subject: "Français",
    level: "CE2",
    duration: "50 min",
    description:
      "Apprendre la conjugaison des verbes au présent de l'indicatif",
    progress: 0,
    status: "not_started",
    difficulty: "Moyen",
    icon: "📝",
  },
  {
    id: "french-grammaire",
    path: "/student/lessons/french-grammaire",
    title: "Les noms et adjectifs",
    subject: "Français",
    level: "CE1",
    duration: "40 min",
    description: "Identifier et distinguer les noms et les adjectifs",
    progress: 75,
    status: "in_progress",
    difficulty: "Facile",
    icon: "📚",
  },
  {
    id: "science-ecosysteme",
    path: "/student/lessons/science-ecosysteme",
    title: "Les écosystèmes",
    subject: "Sciences",
    level: "CM1",
    duration: "60 min",
    description: "Comprendre les relations dans un écosystème",
    progress: 30,
    status: "in_progress",
    difficulty: "Difficile",
    icon: "🌿",
  },
  {
    id: "history-egyptians",
    path: "/student/lessons/history-egyptians",
    title: "Les Égyptiens",
    subject: "Histoire",
    level: "CM1",
    duration: "55 min",
    description: "Découvrir la civilisation égyptienne antique",
    progress: 0,
    status: "not_started",
    difficulty: "Moyen",
    icon: "🏛️",
  },
];

function getStatusColor(status: string) {
  switch (status) {
    case "completed":
      return "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300";
    case "in_progress":
      return "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300";
    default:
      return "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "completed":
      return "Terminée";
    case "in_progress":
      return "En cours";
    default:
      return "À commencer";
  }
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "Facile":
      return "bg-green-500/10 text-green-600 dark:text-green-400";
    case "Moyen":
      return "bg-orange-500/10 text-orange-600 dark:text-orange-400";
    case "Difficile":
      return "bg-red-500/10 text-red-600 dark:text-red-400";
    default:
      return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
  }
}

export default function LessonsPage() {
  const completedCount = allLessons.filter(
    (l) => l.status === "completed",
  ).length;
  const inProgressCount = allLessons.filter(
    (l) => l.status === "in_progress",
  ).length;
  const totalHours = Math.round(
    allLessons.reduce((sum, l) => sum + parseInt(l.duration), 0) / 60,
  );

  return (
    <div className="flex min-h-full flex-col">
      <StudentPageHeader
        title="Mes Leçons"
        subtitle="Apprends à ton rythme avec tes leçons assignées"
      />

      {/* Header Section */}
      <div className="border-b border-border/50 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 px-3 py-8 md:px-6 md:py-12">
        <div className="grid items-center gap-6 lg:grid-cols-2">
          <div>
            <h2 className="text-4xl font-black text-gray-800 dark:text-white">
              Tes leçons
            </h2>
            <p className="mt-3 text-lg font-medium text-gray-700 dark:text-gray-300">
              Progresse à ton rythme dans chaque matière
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <NotebookIllustration />
          </div>
        </div>
      </div>

      <div className="space-y-6 p-4 md:p-8">
        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="overflow-hidden rounded-3xl border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Terminées
                  </p>
                  <p className="mt-3 text-4xl font-bold text-green-600">
                    {completedCount}
                  </p>
                </div>
                <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-green-200 dark:bg-green-800">
                  <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-3xl border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-950 dark:to-cyan-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    En cours
                  </p>
                  <p className="mt-3 text-4xl font-bold text-blue-600">
                    {inProgressCount}
                  </p>
                </div>
                <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-blue-200 dark:bg-blue-800">
                  <Zap className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-3xl border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950 dark:to-pink-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Temps total
                  </p>
                  <p className="mt-3 text-4xl font-bold text-purple-600">
                    {totalHours}h
                  </p>
                </div>
                <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-purple-200 dark:bg-purple-800">
                  <Clock className="h-8 w-8 text-purple-600 dark:text-purple-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button variant="default" className="rounded-xl h-10 font-semibold">
            Toutes
          </Button>
          <Button variant="outline" className="rounded-xl h-10 font-semibold">
            En cours
          </Button>
          <Button variant="outline" className="rounded-xl h-10 font-semibold">
            Terminées
          </Button>
          <Button variant="outline" className="rounded-xl h-10 font-semibold">
            Mathématiques
          </Button>
          <Button variant="outline" className="rounded-xl h-10 font-semibold">
            Français
          </Button>
        </div>

        {/* Lessons Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allLessons.map((lesson) => (
            <Link key={lesson.id} href={lesson.path}>
              <Card className="overflow-hidden rounded-3xl border-0 shadow-lg transition-all hover:shadow-2xl hover:scale-105 h-full cursor-pointer">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div
                    className={`p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-b-2 border-blue-200 dark:border-blue-800`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-5xl">{lesson.icon}</div>
                      <Badge className={`${getStatusColor(lesson.status)}`}>
                        {getStatusLabel(lesson.status)}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                        {lesson.title}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {lesson.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Badge variant="outline" className="rounded-lg text-xs">
                          {lesson.subject}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`rounded-lg text-xs ${getDifficultyColor(lesson.difficulty)}`}
                        >
                          {lesson.difficulty}
                        </Badge>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                          PROGRESSION
                        </p>
                        <p className="text-xs font-bold text-gray-800 dark:text-white">
                          {lesson.progress}%
                        </p>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                          style={{ width: `${lesson.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {lesson.duration}
                      </p>
                      <ArrowRight className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
