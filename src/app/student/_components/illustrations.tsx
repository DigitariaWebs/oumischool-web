/**
 * Illustration components for empty states and decorations
 * Images from https://storyset.com/education
 */

export function EmptyScheduleIllustration() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <img
        src="/Notebook-amico.svg"
        alt="Calendrier vide"
        className="mb-6 h-48 w-48 object-contain"
      />
      <h3 className="text-lg font-semibold text-gray-800">
        Aucun cours planifié
      </h3>
      <p className="mt-2 max-w-xs text-sm text-gray-600">
        Reviens bientôt pour voir tes prochaines sessions
      </p>
    </div>
  );
}

export function EmptyLessonsIllustration() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <img
        src="/Learning-bro.svg"
        alt="Pas de leçons"
        className="mb-6 h-48 w-48 object-contain"
      />
      <h3 className="text-lg font-semibold text-gray-800">
        Aucune leçon assignée
      </h3>
      <p className="mt-2 max-w-xs text-sm text-gray-600">
        Tes leçons apparaîtront ici quand tes tuteurs les ajouteront
      </p>
    </div>
  );
}

export function OnlineLearningIllustration() {
  return (
    <img
      src="/Online learning-bro.svg"
      alt="Apprentissage en ligne"
      className="mx-auto h-40 w-40 object-contain"
    />
  );
}

export function WebinarIllustration() {
  return (
    <img
      src="/Webinar-cuate.svg"
      alt="Webinaire"
      className="h-48 w-48 object-contain"
    />
  );
}

export function WelcomeIllustration() {
  return (
    <img
      src="/Learning-bro.svg"
      alt="Bienvenue"
      className="h-48 w-48 object-contain"
    />
  );
}

export function MentalHealthIllustration() {
  return (
    <img
      src="/Mental health-cuate.svg"
      alt="Bien-être mental"
      className="mx-auto h-40 w-40 object-contain"
    />
  );
}

export function ProblemSolvingIllustration() {
  return (
    <img
      src="/Problem solving-cuate.svg"
      alt="Résolution de problèmes"
      className="mx-auto h-40 w-40 object-contain"
    />
  );
}

export function NotebookIllustration() {
  return (
    <img
      src="/Notebook-amico.svg"
      alt="Cahier et leçons"
      className="mx-auto h-40 w-40 object-contain"
    />
  );
}
