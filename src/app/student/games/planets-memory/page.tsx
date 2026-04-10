"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo, useState } from "react";

const planets = ["Mercure", "Vénus", "Terre", "Mars"];

export default function PlanetsMemoryGamePage() {
  const cards = useMemo(() => [...planets, ...planets], []);
  const [revealed, setRevealed] = useState<number[]>([]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Header */}
      <div className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent px-4 py-6 md:px-6 md:py-8">
        <div className="grid items-center gap-6 lg:grid-cols-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Jeu Memory - Planètes
            </h1>
            <p className="mt-2 text-base text-gray-700">
              Trouve les paires de planètes ! Teste ta mémoire.
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <img
              src="/Mental health-cuate.svg"
              alt="Jeu memory"
              className="h-48 w-48 object-contain"
            />
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Jeu: Memory des planètes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {cards.map((label, index) => {
                const isOpen = revealed.includes(index);
                return (
                  <button
                    key={`${label}-${index}`}
                    className="rounded-lg border border-border p-3 text-sm hover:bg-muted"
                    onClick={() =>
                      setRevealed((prev) =>
                        prev.includes(index)
                          ? prev.filter((x) => x !== index)
                          : [...prev, index],
                      )
                    }
                    aria-label={`Carte ${index + 1}`}
                  >
                    {isOpen ? label : "?"}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
