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
    <main className="p-4 md:p-6">
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
    </main>
  );
}
