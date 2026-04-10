import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MathFractionsLessonPage() {
  return (
    <main className="p-4 md:p-6">
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Leçon: Fractions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            Une fraction représente une part d’un tout: numérateur /
            dénominateur.
          </p>
          <p>Exemple: 3/4 signifie 3 parts sur 4 parts égales.</p>
        </CardContent>
      </Card>
    </main>
  );
}
