"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function MathAdditionGamePage() {
  const [a, setA] = useState(() => Math.ceil(Math.random() * 9));
  const [b, setB] = useState(() => Math.ceil(Math.random() * 9));
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const submit = () => {
    const ok = Number(answer) === a + b;
    setFeedback(ok ? "Bravo, bonne réponse !" : "Presque, réessaie.");
    if (ok) {
      setA(Math.ceil(Math.random() * 9));
      setB(Math.ceil(Math.random() * 9));
      setAnswer("");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Header */}
      <div className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent px-4 py-6 md:px-6 md:py-8">
        <div className="grid items-center gap-6 lg:grid-cols-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Jeu d&apos;Addition
            </h1>
            <p className="mt-2 text-base text-gray-700">
              Entrain&apos;-toi avec des calculs amusants !
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <img
              src="/Mental health-cuate.svg"
              alt="Jeu d'addition"
              className="h-48 w-48 object-contain"
            />
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Jeu: Addition</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-lg font-semibold">
              {a} + {b} = ?
            </p>
            <input
              className="w-full rounded-md border border-input px-3 py-2"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              aria-label="Réponse du calcul"
            />
            <Button onClick={submit}>Vérifier</Button>
            {feedback ? (
              <p className="text-sm text-muted-foreground">{feedback}</p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
