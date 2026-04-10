"use client";

import { StudentPageHeader } from "../../_components/common";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  BookOpen,
  Lightbulb,
  Play,
  CheckCircle2,
  Brain,
  Target,
  Clock,
} from "lucide-react";
import Link from "next/link";

// Type definitions
interface LessonExample {
  title: string;
  description: string;
  explanation: string;
  visual: string;
}

interface LessonContent {
  definition: string;
  formula: string;
  examples: LessonExample[];
  objectives: string[];
}

interface Lesson {
  id: string;
  title: string;
  subject: string;
  level: string;
  duration: string;
  description: string;
  content: LessonContent;
}

// Mock data - à remplacer par une vraie requête API
const lessons: Record<string, Lesson> = {
  fractions: {
    id: "fractions",
    title: "Leçon: Fractions",
    subject: "Mathématiques",
    level: "CE2",
    duration: "45 min",
    description:
      "Une fraction représente une part d'un tout: numérateur / dénominateur.",
    content: {
      definition:
        "Une fraction est un nombre qui représente une ou plusieurs parties égales d'un tout.",
      formula: "Fraction = Numérateur / Dénominateur",
      examples: [
        {
          title: "Exemple 1",
          description: "3/4 signifie 3 parts sur 4 parts égales",
          explanation:
            "Si tu divises une pizza en 4 parts égales et tu prends 3 parts, tu as mangé 3/4 de la pizza.",
          visual: "🍕 3/4",
        },
        {
          title: "Exemple 2",
          description: "1/2 signifie 1 part sur 2 parts égales",
          explanation:
            "Si tu divises un gâteau en 2 parts égales et tu prends 1 part, tu as 1/2 du gâteau.",
          visual: "🎂 1/2",
        },
        {
          title: "Exemple 3",
          description: "2/5 signifie 2 parts sur 5 parts égales",
          explanation:
            "Si tu divises une barre de chocolat en 5 carrés égaux et tu en prends 2, tu as 2/5 de la barre.",
          visual: "🍫 2/5",
        },
      ],
      tips: [
        "Le numérateur (en haut) c'est le nombre de parts que tu prends",
        "Le dénominateur (en bas) c'est le nombre total de parts",
        "Moins le dénominateur est grand, plus chaque part est grande",
      ],
    },
  },
};

export default function LessonDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const lesson = lessons[params.id] || lessons.fractions;

  return (
    <div className="flex min-h-full flex-col">
      <StudentPageHeader title={lesson.title} subtitle={lesson.description} />

      <div className="space-y-6 p-4 md:p-8">
        {/* Back Button */}
        <Button
          variant="outline"
          asChild
          className="w-fit rounded-xl h-11 font-semibold"
        >
          <Link href="/student/lessons">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Retour aux leçons
          </Link>
        </Button>

        {/* Lesson Info Header */}
        <Card className="overflow-hidden rounded-3xl border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
          <CardContent className="p-6 md:p-8">
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Matière
                </p>
                <p className="mt-2 text-lg font-bold text-gray-800 dark:text-white">
                  {lesson.subject}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Niveau
                </p>
                <p className="mt-2 text-lg font-bold text-gray-800 dark:text-white">
                  {lesson.level}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Durée
                </p>
                <p className="mt-2 text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {lesson.duration}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Statut
                </p>
                <Badge className="mt-2 bg-green-500 text-white font-semibold h-8 flex items-center justify-center w-fit">
                  <CheckCircle2 className="mr-1 h-4 w-4" />
                  Accessible
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Definition */}
            <Card className="overflow-hidden rounded-3xl border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 pb-4">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-white">
                  <Lightbulb className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  Définition
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                <div className="space-y-4">
                  <p className="text-lg font-medium text-gray-800 dark:text-white">
                    {lesson.content.definition}
                  </p>
                  <div className="rounded-2xl bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 border-2 border-blue-300 dark:border-blue-700 p-4">
                    <p className="text-sm font-bold text-blue-900 dark:text-blue-100">
                      Formule:
                    </p>
                    <p className="text-xl font-bold text-blue-700 dark:text-blue-300 mt-2 font-mono">
                      {lesson.content.formula}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Examples */}
            <Card className="overflow-hidden rounded-3xl border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950 dark:to-yellow-950 pb-4">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-white">
                  <Play className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  Exemples
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 md:p-8 space-y-4">
                {lesson.content.examples.map(
                  (example: LessonExample, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-2xl border-2 border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/30 dark:to-yellow-900/30 p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-lg font-bold text-orange-700 dark:text-orange-300">
                            {example.title}
                          </p>
                          <p className="text-sm font-semibold text-gray-800 dark:text-white mt-2">
                            {example.description}
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-3 leading-relaxed">
                            {example.explanation}
                          </p>
                        </div>
                        <div className="text-4xl shrink-0">
                          {example.visual}
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="overflow-hidden rounded-3xl border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 pb-4">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-white">
                  <Brain className="h-6 w-6 text-green-600 dark:text-green-400" />
                  Conseils importants
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                <ul className="space-y-3">
                  {lesson.content.tips.map((tip: string, idx: number) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 rounded-xl bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 p-3"
                    >
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-gray-800 dark:text-white">
                        {tip}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-6">
            {/* Learning Objectives */}
            <Card className="overflow-hidden rounded-3xl border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950 pb-4">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-white">
                  <Target className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  Objectifs
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Comprendre ce qu&apos;est une fraction
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Identifier le numérateur et le dénominateur
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Reconnaître des fractions dans la vie quotidienne
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Practice */}
            <Card className="overflow-hidden rounded-3xl border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-rose-50 to-red-50 dark:from-rose-950 dark:to-red-950 pb-4">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-white">
                  <Target className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                  À toi de jouer!
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  Teste ce que tu as appris avec des exercices pratiques.
                </p>
                <Button className="h-12 w-full rounded-xl text-base font-semibold bg-rose-500 hover:bg-rose-600">
                  <Play className="mr-2 h-5 w-5" />
                  Commencer les exercices
                </Button>
              </CardContent>
            </Card>

            {/* Progress */}
            <Card className="overflow-hidden rounded-3xl border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950 dark:to-blue-950 pb-4">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-white">
                  <BookOpen className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                  Ta progression
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                        COMPRÉHENSION
                      </p>
                      <p className="text-xs font-bold text-gray-800 dark:text-white">
                        60%
                      </p>
                    </div>
                    <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                        style={{ width: "60%" }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                        PRATIQUE
                      </p>
                      <p className="text-xs font-bold text-gray-800 dark:text-white">
                        40%
                      </p>
                    </div>
                    <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-yellow-500"
                        style={{ width: "40%" }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
