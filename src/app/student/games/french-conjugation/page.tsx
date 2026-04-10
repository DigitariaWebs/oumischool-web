"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

const questions = [
  { prompt: "Nous (aller) ... au marché.", answer: "allons" },
  { prompt: "Ils (finir) ... leurs devoirs.", answer: "finissent" },
];

export default function FrenchConjugationGamePage() {
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const current = questions[index];

  const check = () => {
    const ok = value.trim().toLowerCase() === current.answer;
    setFeedback(ok ? "Parfait !" : "Essaie encore.");
    if (ok && index < questions.length - 1) {
      setTimeout(() => {
        setIndex((prev) => prev + 1);
        setValue("");
        setFeedback(null);
      }, 500);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Header */}
      <div className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent px-4 py-6 md:px-6 md:py-8">
        <div className="grid items-center gap-6 lg:grid-cols-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Jeu de Conjugaison
            </h1>
            <p className="mt-2 text-base text-gray-700">
              Am&apos;liore ta conjugaison en t&apos;amusant !
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <img
              src="/Mental health-cuate.svg"
              alt="Jeu de conjugaison"
              className="h-48 w-48 object-contain"
            />
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Jeu: Conjugaison</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="font-medium">{current.prompt}</p>
            <input
              className="w-full rounded-md border border-input px-3 py-2"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              aria-label="Réponse de conjugaison"
            />
            <Button onClick={check}>Valider</Button>
            {feedback ? (
              <p className="text-sm text-muted-foreground">{feedback}</p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
