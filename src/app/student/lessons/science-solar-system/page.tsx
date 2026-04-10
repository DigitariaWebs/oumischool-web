import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ScienceSolarSystemLessonPage() {
  return (
    <main className="p-4 md:p-6">
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Leçon: Système solaire</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Le Soleil est au centre du système solaire.</p>
          <p>Les planètes gravitent autour du Soleil sur des orbites.</p>
        </CardContent>
      </Card>
    </main>
  );
}
