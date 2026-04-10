import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FrenchTensesLessonPage() {
  return (
    <main className="p-4 md:p-6">
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Leçon: Temps verbaux</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Présent: action en cours.</p>
          <p>Passé composé: action terminée.</p>
          <p>Futur simple: action à venir.</p>
        </CardContent>
      </Card>
    </main>
  );
}
