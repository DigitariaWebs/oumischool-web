"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo, useState } from "react";

const planets = ["Mercure", "Vénus", "Terre", "Mars"];

export default function PlanetsMemoryGamePage() {
  const cards = useMemo(() => [...planets, ...planets], []);
  const [revealed, setRevealed] = useState<number[]>([]);

  return (
    <main className="p-4 md:p-6">
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
    </main>
  );
}
