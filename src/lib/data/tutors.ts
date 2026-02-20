import {
  Lesson,
  LessonSeries,
  Subject,
  Tutor,
  TutorResource,
  TutorRevenue,
} from "@/types";

export const mockSubjects: Subject[] = [
  { id: "s1", name: "Physique", color: "oklch(0.65 0.12 220)" },
  { id: "s2", name: "Conception UI/UX", color: "oklch(0.58 0.16 155)" },
  { id: "s3", name: "Mathématiques", color: "oklch(0.72 0.14 80)" },
  { id: "s4", name: "Conception graphique", color: "oklch(0.68 0.18 20)" },
  { id: "s5", name: "Typographie", color: "oklch(0.52 0.14 250)" },
  { id: "s6", name: "Couleurs et éléments", color: "oklch(0.62 0.16 340)" },
  { id: "s7", name: "Objets 3D", color: "oklch(0.60 0.13 180)" },
];

export function getSubjectById(id: string): Subject | undefined {
  return mockSubjects.find((s) => s.id === id);
}

export function getSubjectColor(id: string): string {
  return getSubjectById(id)?.color ?? "oklch(0.58 0.16 155)";
}

export function getSubjectName(id: string): string {
  return getSubjectById(id)?.name ?? id;
}

/** @deprecated use subjectIds + mockSubjects */
export const subjectColors: Record<string, string> = Object.fromEntries(
  mockSubjects.map((s) => [s.name, s.color]),
);

export const statusStyles = {
  active: {
    background: "oklch(0.95 0.018 155)",
    color: "oklch(0.38 0.12 155)",
  },
  inactive: {
    background: "oklch(0.94 0.008 80)",
    color: "oklch(0.48 0.02 250)",
  },
  pending: {
    background: "oklch(0.96 0.03 80)",
    color: "oklch(0.52 0.14 80)",
  },
};

// ─── Lesson Series ─────────────────────────────────────────────────────────────

export const mockLessonSeries: LessonSeries[] = [
  // Physique — t1 (Aalvina)
  {
    id: "ls1",
    subjectId: "s1",
    tutorId: "t1",
    title: "Mécanique classique",
    description:
      "Une série progressive sur le mouvement, les forces et l'énergie.",
  },
  {
    id: "ls2",
    subjectId: "s1",
    tutorId: "t1",
    title: "Optique et lumière",
    description:
      "Comprendre la lumière, les miroirs, les lentilles et la diffraction.",
  },
  // Mathématiques — t3 (Omar)
  {
    id: "ls3",
    subjectId: "s3",
    tutorId: "t3",
    title: "Algèbre fondamentale",
    description: "Des expressions aux équations du second degré.",
  },
  {
    id: "ls4",
    subjectId: "s3",
    tutorId: "t3",
    title: "Géométrie euclidienne",
    description: "Théorèmes, preuves et figures dans le plan.",
  },
  // Conception UI/UX — t2 (Sara)
  {
    id: "ls5",
    subjectId: "s2",
    tutorId: "t2",
    title: "Fondamentaux du design",
    description:
      "Principes de base du design d'interface et d'expérience utilisateur.",
  },
  // Mathématiques — t5 (Mariam)
  {
    id: "ls6",
    subjectId: "s3",
    tutorId: "t5",
    title: "Géométrie et théorèmes",
    description: "Formes, angles et preuves géométriques.",
  },
  // Objets 3D — t8 (Yacine)
  {
    id: "ls7",
    subjectId: "s7",
    tutorId: "t8",
    title: "Introduction à Blender",
    description: "De zéro à la modélisation 3D avec Blender.",
  },
  // Couleurs — t7 (Leila)
  {
    id: "ls8",
    subjectId: "s6",
    tutorId: "t7",
    title: "Théorie des couleurs",
    description: "Roue chromatique, harmonies et application en design.",
  },
];

// ─── Lessons ──────────────────────────────────────────────────────────────────

export const mockLessons: Lesson[] = [
  // ── Physique / Aalvina ──
  // Series: Mécanique classique (ls1)
  {
    id: "l1",
    subjectId: "s1",
    tutorId: "t1",
    title: "Introduction au mouvement",
    description: "Définitions cinématiques, vecteurs vitesse et accélération.",
    duration: "45 min",
    seriesId: "ls1",
    orderInSeries: 1,
    materials: [
      {
        id: "m1",
        title: "Fiche de cours – Cinématique",
        soldSeparately: false,
      },
      {
        id: "m2",
        title: "Exercices corrigés – Vecteurs",
        soldSeparately: true,
      },
    ],
  },
  {
    id: "l2",
    subjectId: "s1",
    tutorId: "t1",
    title: "Les lois de Newton",
    description:
      "Énoncé, démonstration et applications des trois lois de Newton.",
    duration: "50 min",
    seriesId: "ls1",
    orderInSeries: 2,
    materials: [
      { id: "m3", title: "Résumé – 3 lois de Newton", soldSeparately: false },
    ],
  },
  {
    id: "l3",
    subjectId: "s1",
    tutorId: "t1",
    title: "Travail et énergie",
    description: "Énergie cinétique, potentielle et conservation de l'énergie.",
    duration: "45 min",
    seriesId: "ls1",
    orderInSeries: 3,
  },
  // Series: Optique et lumière (ls2)
  {
    id: "l4",
    subjectId: "s1",
    tutorId: "t1",
    title: "Nature de la lumière",
    description: "Dualité onde-corpuscule et spectre électromagnétique.",
    duration: "40 min",
    seriesId: "ls2",
    orderInSeries: 1,
  },
  {
    id: "l5",
    subjectId: "s1",
    tutorId: "t1",
    title: "Réflexion et réfraction",
    description: "Lois de Snell-Descartes et applications pratiques.",
    duration: "45 min",
    seriesId: "ls2",
    orderInSeries: 2,
  },
  // Standalone Physique / Aalvina
  {
    id: "l6",
    subjectId: "s1",
    tutorId: "t1",
    title: "Histoire de la physique",
    description: "Des philosophes grecs à la physique quantique.",
    duration: "35 min",
    materials: [
      {
        id: "m4",
        title: "Frise chronologique – Histoire de la physique",
        soldSeparately: true,
      },
      { id: "m5", title: "Bibliographie commentée", soldSeparately: true },
    ],
  },

  // ── Conception UI/UX / Sara ──
  // Series: Fondamentaux du design (ls5)
  {
    id: "l7",
    subjectId: "s2",
    tutorId: "t2",
    title: "Qu'est-ce que l'UX ?",
    description:
      "Définition, histoire et importance du design centré utilisateur.",
    duration: "30 min",
    seriesId: "ls5",
    orderInSeries: 1,
  },
  {
    id: "l8",
    subjectId: "s2",
    tutorId: "t2",
    title: "Principes de l'UI",
    description: "Hiérarchie visuelle, couleur, typographie en interface.",
    duration: "40 min",
    seriesId: "ls5",
    orderInSeries: 2,
  },
  {
    id: "l9",
    subjectId: "s2",
    tutorId: "t2",
    title: "Wireframing et zoning",
    description: "Méthodes de wireframe, lo-fi vs hi-fi.",
    duration: "50 min",
    seriesId: "ls5",
    orderInSeries: 3,
    materials: [
      {
        id: "m6",
        title: "Template wireframe imprimable",
        soldSeparately: false,
      },
      { id: "m7", title: "Kit UI lo-fi (Figma)", soldSeparately: true },
    ],
  },
  // Standalone UI/UX / Sara
  {
    id: "l10",
    subjectId: "s2",
    tutorId: "t2",
    title: "Prototypage Figma",
    description: "Créer un prototype interactif de A à Z dans Figma.",
    duration: "60 min",
    materials: [
      {
        id: "m8",
        title: "Fichier Figma – Prototype de référence",
        soldSeparately: true,
      },
      { id: "m9", title: "Guide pas-à-pas (PDF)", soldSeparately: false },
    ],
  },

  // ── Mathématiques / Omar ──
  // Series: Algèbre fondamentale (ls3)
  {
    id: "l11",
    subjectId: "s3",
    tutorId: "t3",
    title: "Expressions algébriques",
    description: "Simplification, factorisation et développement.",
    duration: "45 min",
    seriesId: "ls3",
    orderInSeries: 1,
  },
  {
    id: "l12",
    subjectId: "s3",
    tutorId: "t3",
    title: "Équations du premier degré",
    description: "Résolution, représentation graphique et problèmes appliqués.",
    duration: "45 min",
    seriesId: "ls3",
    orderInSeries: 2,
  },
  {
    id: "l13",
    subjectId: "s3",
    tutorId: "t3",
    title: "Équations du second degré",
    description: "Discriminant, formule quadratique et factorisation.",
    duration: "50 min",
    seriesId: "ls3",
    orderInSeries: 3,
    materials: [
      {
        id: "m10",
        title: "Fiche mémo – Formule quadratique",
        soldSeparately: false,
      },
      {
        id: "m11",
        title: "Série d'exercices – Équations du 2nd degré",
        soldSeparately: true,
      },
    ],
  },
  // Series: Géométrie euclidienne (ls4)
  {
    id: "l14",
    subjectId: "s3",
    tutorId: "t3",
    title: "Triangles et propriétés",
    description: "Congruence, semblance et théorème de Pythagore.",
    duration: "45 min",
    seriesId: "ls4",
    orderInSeries: 1,
  },
  {
    id: "l15",
    subjectId: "s3",
    tutorId: "t3",
    title: "Cercles et angles inscrits",
    description: "Propriétés du cercle, arcs et angles.",
    duration: "50 min",
    seriesId: "ls4",
    orderInSeries: 2,
  },
  // Standalone Maths / Omar
  {
    id: "l16",
    subjectId: "s3",
    tutorId: "t3",
    title: "Préparation examen classe 9",
    description: "Révision complète du programme de classe 9.",
    duration: "60 min",
    materials: [
      {
        id: "m12",
        title: "Annales – Classe 9 (3 dernières années)",
        soldSeparately: true,
      },
      { id: "m13", title: "Formulaire de révision", soldSeparately: false },
      { id: "m14", title: "Corrigés détaillés", soldSeparately: true },
    ],
  },

  // ── Mathématiques / Mariam ──
  // Series: Géométrie et théorèmes (ls6)
  {
    id: "l17",
    subjectId: "s3",
    tutorId: "t5",
    title: "Formes et périmètres",
    description: "Calcul de périmètre et aire de figures planes.",
    duration: "40 min",
    seriesId: "ls6",
    orderInSeries: 1,
  },
  {
    id: "l18",
    subjectId: "s3",
    tutorId: "t5",
    title: "Le théorème de Thalès",
    description: "Énoncé, cas particuliers et applications.",
    duration: "45 min",
    seriesId: "ls6",
    orderInSeries: 2,
  },
  // Standalone Maths / Mariam
  {
    id: "l19",
    subjectId: "s3",
    tutorId: "t5",
    title: "Motifs numériques",
    description: "Suites arithmétiques et géométriques pour débutants.",
    duration: "35 min",
  },

  // ── Couleurs et éléments / Leila ──
  // Series: Théorie des couleurs (ls8)
  {
    id: "l20",
    subjectId: "s6",
    tutorId: "t7",
    title: "La roue chromatique",
    description:
      "Couleurs primaires, secondaires, tertiaires et complémentaires.",
    duration: "35 min",
    seriesId: "ls8",
    orderInSeries: 1,
    materials: [
      {
        id: "m15",
        title: "Poster – Roue chromatique (PDF imprimable)",
        soldSeparately: true,
      },
    ],
  },
  {
    id: "l21",
    subjectId: "s6",
    tutorId: "t7",
    title: "Harmonies de couleurs",
    description: "Schémas analogues, complémentaires et triadiques.",
    duration: "40 min",
    seriesId: "ls8",
    orderInSeries: 2,
  },
  // Standalone / Leila
  {
    id: "l22",
    subjectId: "s6",
    tutorId: "t7",
    title: "Bases de composition",
    description: "Règle des tiers, équilibre et point focal.",
    duration: "40 min",
  },

  // ── Objets 3D / Yacine ──
  // Series: Introduction à Blender (ls7)
  {
    id: "l23",
    subjectId: "s7",
    tutorId: "t8",
    title: "Interface et navigation",
    description:
      "Découverte de l'interface Blender et navigation dans la scène.",
    duration: "30 min",
    seriesId: "ls7",
    orderInSeries: 1,
    materials: [
      {
        id: "m16",
        title: "Raccourcis clavier Blender (cheat sheet)",
        soldSeparately: false,
      },
    ],
  },
  {
    id: "l24",
    subjectId: "s7",
    tutorId: "t8",
    title: "Modélisation de base",
    description: "Extrusion, loop cut et modificateurs essentiels.",
    duration: "50 min",
    seriesId: "ls7",
    orderInSeries: 2,
  },
  {
    id: "l25",
    subjectId: "s7",
    tutorId: "t8",
    title: "Matériaux et rendu",
    description: "Shaders PBR, éclairage et rendu Cycles.",
    duration: "55 min",
    seriesId: "ls7",
    orderInSeries: 3,
    materials: [
      {
        id: "m17",
        title: "Pack de textures PBR (sample)",
        soldSeparately: true,
      },
      {
        id: "m18",
        title: "Scène Blender – Exemple de rendu",
        soldSeparately: true,
      },
    ],
  },
];

// ─── Tutor Resources ──────────────────────────────────────────────────────────

export const mockTutorResources: TutorResource[] = [
  // ── Aalvina / Physique ──
  {
    id: "tr1",
    tutorId: "t1",
    title: "Formulaire de physique – Classe 8-9",
    description: "Toutes les formules essentielles pour les niveaux 8 et 9.",
    type: "document",
    status: "published",
    subjectId: "s1",
    fileSize: "1.2 Mo",
    views: 312,
    downloads: 148,
    uploadedDate: "Jan 2025",
  },
  {
    id: "tr2",
    tutorId: "t1",
    title: "Vidéo – Introduction à la mécanique",
    description:
      "Présentation vidéo des concepts fondamentaux de la mécanique.",
    type: "video",
    status: "published",
    subjectId: "s1",
    lessonId: "l1",
    fileSize: "245 Mo",
    views: 198,
    downloads: 54,
    uploadedDate: "Jan 2025",
  },
  {
    id: "tr3",
    tutorId: "t1",
    title: "Schémas – Optique géométrique",
    description: "Illustrations annotées des miroirs, lentilles et rayons.",
    type: "image",
    status: "published",
    subjectId: "s1",
    lessonId: "l5",
    fileSize: "3.8 Mo",
    views: 87,
    downloads: 63,
    uploadedDate: "Fév 2025",
  },
  {
    id: "tr4",
    tutorId: "t1",
    title: "Guide de révision générale",
    description: "Document de révision indépendant, tous sujets confondus.",
    type: "document",
    status: "draft",
    fileSize: "0.9 Mo",
    views: 0,
    downloads: 0,
    uploadedDate: "Fév 2025",
  },

  // ── Sara / UI/UX ──
  {
    id: "tr5",
    tutorId: "t2",
    title: "Kit de démarrage Figma",
    description: "Composants de base prêts à l'emploi pour débutants Figma.",
    type: "other",
    status: "published",
    subjectId: "s2",
    lessonId: "l10",
    fileSize: "8.4 Mo",
    views: 421,
    downloads: 209,
    uploadedDate: "Mar 2025",
  },
  {
    id: "tr6",
    tutorId: "t2",
    title: "Checklist UX – Audit d'interface",
    description: "Liste de vérification pour évaluer une interface existante.",
    type: "document",
    status: "published",
    subjectId: "s2",
    fileSize: "0.4 Mo",
    views: 256,
    downloads: 134,
    uploadedDate: "Mar 2025",
  },
  {
    id: "tr7",
    tutorId: "t2",
    title: "Enregistrement – Cours wireframing",
    description: "Replay de la session en direct sur le wireframing.",
    type: "video",
    status: "archived",
    subjectId: "s2",
    lessonId: "l9",
    fileSize: "512 Mo",
    views: 93,
    downloads: 12,
    uploadedDate: "Avr 2025",
  },

  // ── Omar / Mathématiques ──
  {
    id: "tr8",
    tutorId: "t3",
    title: "Fiches de révision – Algèbre",
    description: "Résumés des chapitres d'algèbre du programme classe 7-9.",
    type: "document",
    status: "published",
    subjectId: "s3",
    fileSize: "2.1 Mo",
    views: 534,
    downloads: 311,
    uploadedDate: "Nov 2024",
  },
  {
    id: "tr9",
    tutorId: "t3",
    title: "Exercices – Géométrie euclidienne",
    description: "Série d'exercices progressifs avec corrigés détaillés.",
    type: "document",
    status: "published",
    subjectId: "s3",
    lessonId: "l14",
    fileSize: "1.7 Mo",
    views: 289,
    downloads: 178,
    uploadedDate: "Déc 2024",
  },
  {
    id: "tr10",
    tutorId: "t3",
    title: "Podcast – Méthodes de résolution",
    description:
      "Audio explicatif sur les stratégies de résolution de problèmes.",
    type: "audio",
    status: "published",
    fileSize: "28 Mo",
    views: 112,
    downloads: 67,
    uploadedDate: "Jan 2025",
  },

  // ── Leila / Couleurs ──
  {
    id: "tr11",
    tutorId: "t7",
    title: "Planche de palettes – Harmonies chromatiques",
    description: "Collection de palettes prêtes à l'emploi par harmonie.",
    type: "image",
    status: "published",
    subjectId: "s6",
    lessonId: "l21",
    fileSize: "5.2 Mo",
    views: 178,
    downloads: 99,
    uploadedDate: "Sep 2024",
  },
  {
    id: "tr12",
    tutorId: "t7",
    title: "Guide – Composition visuelle",
    description: "Principes de composition expliqués avec exemples visuels.",
    type: "document",
    status: "published",
    subjectId: "s6",
    fileSize: "3.0 Mo",
    views: 143,
    downloads: 88,
    uploadedDate: "Oct 2024",
  },

  // ── Yacine / 3D ──
  {
    id: "tr13",
    tutorId: "t8",
    title: "Projet Blender – Scène débutant",
    description: "Fichier .blend de la scène réalisée en cours.",
    type: "other",
    status: "published",
    subjectId: "s7",
    lessonId: "l24",
    fileSize: "22 Mo",
    views: 201,
    downloads: 115,
    uploadedDate: "Avr 2025",
  },
];

// ─── Tutor Revenue ─────────────────────────────────────────────────────────────

export const mockTutorRevenue: Record<string, TutorRevenue> = {
  // ── Aalvina / Physique ──
  t1: {
    total: 3200,
    bySubject: [
      {
        subjectId: "s1",
        amount: 3200,
        standaloneAmount: 180,
        series: [
          {
            seriesId: "ls1",
            amount: 1680,
            sales: 38,
            lessons: [
              { lessonId: "l1", amount: 630, sales: 14 },
              { lessonId: "l2", amount: 585, sales: 13 },
              { lessonId: "l3", amount: 465, sales: 11 },
            ],
          },
          {
            seriesId: "ls2",
            amount: 1340,
            sales: 24,
            lessons: [
              { lessonId: "l4", amount: 670, sales: 12 },
              { lessonId: "l5", amount: 670, sales: 12 },
            ],
          },
        ],
        standaloneLessons: [{ lessonId: "l6", amount: 180, sales: 6 }],
      },
    ],
  },

  // ── Sara / UI/UX ──
  t2: {
    total: 2400,
    bySubject: [
      {
        subjectId: "s2",
        amount: 2400,
        standaloneAmount: 280,
        series: [
          {
            seriesId: "ls5",
            amount: 2120,
            sales: 28,
            lessons: [
              { lessonId: "l7", amount: 640, sales: 8 },
              { lessonId: "l8", amount: 740, sales: 10 },
              { lessonId: "l9", amount: 740, sales: 10 },
            ],
          },
        ],
        standaloneLessons: [{ lessonId: "l10", amount: 280, sales: 7 }],
      },
    ],
  },

  // ── Omar / Mathématiques ──
  t3: {
    total: 4100,
    bySubject: [
      {
        subjectId: "s3",
        amount: 4100,
        standaloneAmount: 360,
        series: [
          {
            seriesId: "ls3",
            amount: 2090,
            sales: 33,
            lessons: [
              { lessonId: "l11", amount: 630, sales: 10 },
              { lessonId: "l12", amount: 715, sales: 11 },
              { lessonId: "l13", amount: 745, sales: 12 },
            ],
          },
          {
            seriesId: "ls4",
            amount: 1650,
            sales: 23,
            lessons: [
              { lessonId: "l14", amount: 770, sales: 11 },
              { lessonId: "l15", amount: 880, sales: 12 },
            ],
          },
        ],
        standaloneLessons: [{ lessonId: "l16", amount: 360, sales: 6 }],
      },
    ],
  },

  // ── Mariam / Mathématiques ──
  t5: {
    total: 2800,
    bySubject: [
      {
        subjectId: "s3",
        amount: 2800,
        standaloneAmount: 175,
        series: [
          {
            seriesId: "ls6",
            amount: 2625,
            sales: 41,
            lessons: [
              { lessonId: "l17", amount: 1280, sales: 20 },
              { lessonId: "l18", amount: 1345, sales: 21 },
            ],
          },
        ],
        standaloneLessons: [{ lessonId: "l19", amount: 175, sales: 5 }],
      },
    ],
  },

  // ── Leila / Couleurs ──
  t7: {
    total: 1900,
    bySubject: [
      {
        subjectId: "s6",
        amount: 1900,
        standaloneAmount: 210,
        series: [
          {
            seriesId: "ls8",
            amount: 1690,
            sales: 22,
            lessons: [
              { lessonId: "l20", amount: 760, sales: 10 },
              { lessonId: "l21", amount: 930, sales: 12 },
            ],
          },
        ],
        standaloneLessons: [{ lessonId: "l22", amount: 210, sales: 6 }],
      },
    ],
  },

  // ── Yacine / Objets 3D ──
  t8: {
    total: 1400,
    bySubject: [
      {
        subjectId: "s7",
        amount: 1400,
        standaloneAmount: 0,
        series: [
          {
            seriesId: "ls7",
            amount: 1400,
            sales: 13,
            lessons: [
              { lessonId: "l23", amount: 300, sales: 4 },
              { lessonId: "l24", amount: 480, sales: 6 },
              { lessonId: "l25", amount: 620, sales: 7 },
            ],
          },
        ],
        standaloneLessons: [],
      },
    ],
  },
};

// ─── Mock Tutors ──────────────────────────────────────────────────────────────

export const mockTutors: Tutor[] = [
  {
    id: "t1",
    name: "Aalvina Fatehi",
    email: "aalvina@oumischool.com",
    phone: "+1 514 555 0101",
    subjectIds: ["s1"],
    status: "active",
    students: 24,
    rating: 4.9,
    joinedDate: "Jan 2025",
    experience: "5 ans",
    bio: "Éducatrice passionnée en physique avec une formation en physique théorique et appliquée. Je me spécialise dans la rendre les concepts complexes accessibles grâce à des exemples concrets et des démonstrations interactives.",
    location: "Montréal, Canada",
    languages: ["Arabe", "Français", "Anglais"],
    availability: "Lun–Ven, 9 h – 18 h",
    classesThisMonth: 18,
    totalClasses: 210,
    completionRate: 97,
    responseTime: "< 1 heure",
    qualifications: [
      "M.Sc. Physique – Université d'Alger",
      "B.Sc. Physique – USTHB",
      "Éducateur en ligne certifié",
    ],
    recentStudents: [
      { name: "Mia Sanches", grade: "Classe 8", progress: 94 },
      { name: "Rania Belkacem", grade: "Classe 9", progress: 88 },
      { name: "Lucas Gavi", grade: "Classe 6", progress: 76 },
    ],
    upcomingClasses: [
      { subjectId: "s1", date: "20 fév", time: "12:00", students: 12 },
      { subjectId: "s1", date: "21 fév", time: "10:00", students: 8 },
      { subjectId: "s1", date: "22 fév", time: "14:00", students: 10 },
    ],
    monthlyEarnings: 3200,
    revenue: mockTutorRevenue["t1"],
    resources: mockTutorResources.filter((r) => r.tutorId === "t1"),
  },
  {
    id: "t2",
    name: "Sara Benali",
    email: "sara.benali@oumischool.com",
    phone: "+1 514 555 0102",
    subjectIds: ["s2"],
    status: "active",
    students: 18,
    rating: 4.7,
    joinedDate: "Mar 2025",
    experience: "3 ans",
    bio: "Conceptrice UX devenue éducatrice, apportant une expérience industrielle des meilleurs studios de design. J'enseigne la pensée design centrée sur l'humain, Figma, et les flux de travail de conception de produits de bout en bout.",
    location: "Montréal, Canada",
    languages: ["Arabe", "Français"],
    availability: "Mar–Sam, 10 h – 19 h",
    classesThisMonth: 14,
    totalClasses: 98,
    completionRate: 94,
    responseTime: "< 2 heures",
    qualifications: [
      "B.Des. Design d'interaction – ESAD",
      "Certificat Google UX Design",
      "Formateur certifié Figma",
    ],
    recentStudents: [
      { name: "Mia Sanches", grade: "Classe 8", progress: 96 },
      { name: "Ines Oukaci", grade: "Classe 6", progress: 82 },
      { name: "Tarek Belkacem", grade: "Classe 5", progress: 71 },
    ],
    upcomingClasses: [
      { subjectId: "s2", date: "20 fév", time: "10:00", students: 8 },
      { subjectId: "s2", date: "21 fév", time: "11:00", students: 6 },
    ],
    monthlyEarnings: 2400,
    revenue: mockTutorRevenue["t2"],
    resources: mockTutorResources.filter((r) => r.tutorId === "t2"),
  },
  {
    id: "t3",
    name: "Omar Hadj",
    email: "omar.hadj@oumischool.com",
    phone: "+1 514 555 0103",
    subjectIds: ["s3"],
    status: "active",
    students: 31,
    rating: 4.8,
    joinedDate: "Nov 2024",
    experience: "7 ans",
    bio: "Éducateur en maths avec 7 ans d'expérience d'enseignement de la classe 4 à la préparation à l'université. Connu pour rendre les concepts abstraits concrets et construire des bases solides en résolution de problèmes.",
    location: "Montréal, Canada",
    languages: ["Arabe", "Français"],
    availability: "Lun–Sam, 8 h – 17 h",
    classesThisMonth: 24,
    totalClasses: 380,
    completionRate: 99,
    responseTime: "< 30 min",
    qualifications: [
      "M.Sc. Mathématiques appliquées – ENS Constantine",
      "B.Sc. Mathématiques – Université de Constantine",
      "Examinateur certifié IB Maths",
    ],
    recentStudents: [
      { name: "Lucas Gavi", grade: "Classe 6", progress: 88 },
      { name: "Youssef Zahra", grade: "Classe 4", progress: 79 },
      { name: "Tarek Belkacem", grade: "Classe 5", progress: 83 },
    ],
    upcomingClasses: [
      { subjectId: "s3", date: "21 fév", time: "9:00", students: 15 },
      { subjectId: "s3", date: "22 fév", time: "8:00", students: 11 },
      { subjectId: "s3", date: "24 fév", time: "10:00", students: 5 },
    ],
    monthlyEarnings: 4100,
    revenue: mockTutorRevenue["t3"],
    resources: mockTutorResources.filter((r) => r.tutorId === "t3"),
  },
  {
    id: "t4",
    name: "Nina Roussel",
    email: "nina.roussel@oumischool.com",
    phone: "+1 514 555 0104",
    subjectIds: ["s4"],
    status: "inactive",
    students: 0,
    rating: 4.5,
    joinedDate: "Fév 2025",
    experience: "4 ans",
    bio: "Conceptrice graphique et illustratrice spécialisée dans l'identité de marque et le design éditorial. Actuellement en congé temporaire, mais a auparavant animé des cours populaires sur les principes de design.",
    location: "Montréal, Canada",
    languages: ["Français", "Anglais"],
    availability: "Actuellement indisponible",
    classesThisMonth: 0,
    totalClasses: 62,
    completionRate: 91,
    responseTime: "1–2 jours",
    qualifications: [
      "BFA Conception graphique – École des Beaux-Arts d'Alger",
      "Expert certifié Adobe – Illustrator",
    ],
    recentStudents: [],
    upcomingClasses: [],
    monthlyEarnings: 0,
  },
  {
    id: "t5",
    name: "Mariam Khoury",
    email: "mariam.k@oumischool.com",
    phone: "+1 514 555 0105",
    subjectIds: ["s3"],
    status: "active",
    students: 22,
    rating: 4.6,
    joinedDate: "Déc 2024",
    experience: "6 ans",
    bio: "Tuteur dédié en maths spécialisé en géométrie et théorie des nombres. J'adopte une approche patiente, étape par étape, et adapte les séances au rythme d'apprentissage de chaque étudiant.",
    location: "Montréal, Canada",
    languages: ["Arabe", "Français", "Anglais"],
    availability: "Lun–Jeu, 14 h – 20 h",
    classesThisMonth: 16,
    totalClasses: 244,
    completionRate: 95,
    responseTime: "< 1 heure",
    qualifications: [
      "B.Sc. Éducation mathématique – Université d'Annaba",
      "Certificat Cambridge International Education",
    ],
    recentStudents: [
      { name: "Adam Bouras", grade: "Classe 3", progress: 77 },
      { name: "Nour Zahra", grade: "Classe 2", progress: 85 },
    ],
    upcomingClasses: [
      { subjectId: "s3", date: "21 fév", time: "15:00", students: 9 },
      { subjectId: "s3", date: "22 fév", time: "16:00", students: 7 },
    ],
    monthlyEarnings: 2800,
    revenue: mockTutorRevenue["t5"],
    resources: mockTutorResources.filter((r) => r.tutorId === "t5"),
  },
  {
    id: "t6",
    name: "Karim Zerrouk",
    email: "karim.z@oumischool.com",
    phone: "+1 514 555 0106",
    subjectIds: ["s5"],
    status: "pending",
    students: 0,
    rating: 0,
    joinedDate: "Mai 2025",
    experience: "2 ans",
    bio: "Concepteur de caractères et artiste en lettering avec une expérience freelance pour des maisons d'édition et des agences de branding. Impatient de partager ma passion pour les formes de lettres et les systèmes typographiques.",
    location: "Montréal, Canada",
    languages: ["Arabe", "Français"],
    availability: "Week-ends, 10 h – 16 h",
    classesThisMonth: 0,
    totalClasses: 0,
    completionRate: 0,
    responseTime: "N/A",
    qualifications: [
      "BFA Design de communication – ESBA Tlemcen",
      "Intensif d'été TypeMedia – Académie royale des arts",
    ],
    recentStudents: [],
    upcomingClasses: [],
    monthlyEarnings: 0,
  },
  {
    id: "t7",
    name: "Leila Mansouri",
    email: "leila.m@oumischool.com",
    phone: "+1 514 555 0107",
    subjectIds: ["s6"],
    status: "active",
    students: 14,
    rating: 4.4,
    joinedDate: "Sep 2024",
    experience: "4 ans",
    bio: "Artiste et éducatrice en art passionnée par la théorie des couleurs et la composition visuelle. Mes cours mélangent les principes artistiques traditionnels avec l'application numérique moderne.",
    location: "Montréal, Canada",
    languages: ["Arabe", "Français"],
    availability: "Mer–Dim, 9 h – 17 h",
    classesThisMonth: 12,
    totalClasses: 148,
    completionRate: 93,
    responseTime: "< 3 heures",
    qualifications: [
      "BFA Beaux-arts – Université de Blida",
      "Éducatrice en art certifiée – Ministère de l'Éducation",
    ],
    recentStudents: [
      { name: "Sofia Gavi", grade: "Classe 3", progress: 91 },
      { name: "Nour Zahra", grade: "Classe 2", progress: 85 },
      { name: "Amine Zahra", grade: "Classe 1", progress: 82 },
    ],
    upcomingClasses: [
      { subjectId: "s6", date: "20 fév", time: "14:00", students: 7 },
      { subjectId: "s6", date: "21 fév", time: "11:00", students: 5 },
    ],
    monthlyEarnings: 1900,
    revenue: mockTutorRevenue["t7"],
    resources: mockTutorResources.filter((r) => r.tutorId === "t7"),
  },
  {
    id: "t8",
    name: "Yacine Boudali",
    email: "yacine.b@oumischool.com",
    phone: "+1 514 555 0108",
    subjectIds: ["s7"],
    status: "active",
    students: 9,
    rating: 4.3,
    joinedDate: "Avr 2025",
    experience: "3 ans",
    bio: "Artiste 3D avec expérience en film, jeux et visualisation architecturale. Je rends la modélisation 3D accessible aux débutants en utilisant Blender et Cinema 4D.",
    location: "Montréal, Canada",
    languages: ["Arabe", "Français", "Anglais"],
    availability: "Lun–Ven, 17 h – 22 h",
    classesThisMonth: 8,
    totalClasses: 54,
    completionRate: 88,
    responseTime: "< 2 heures",
    qualifications: [
      "B.Sc. Graphisme informatique – Université de Sétif",
      "Formateur certifié Blender Foundation",
    ],
    recentStudents: [
      { name: "Tarek Belkacem", grade: "Classe 5", progress: 83 },
    ],
    upcomingClasses: [
      { subjectId: "s7", date: "22 fév", time: "18:00", students: 4 },
    ],
    monthlyEarnings: 1400,
    revenue: mockTutorRevenue["t8"],
    resources: mockTutorResources.filter((r) => r.tutorId === "t8"),
  },
  {
    id: "t9",
    name: "Hana Meziani",
    email: "hana.m@oumischool.com",
    phone: "+1 514 555 0109",
    subjectIds: ["s1"],
    status: "pending",
    students: 0,
    rating: 0,
    joinedDate: "Mai 2025",
    experience: "1 an",
    bio: "Diplômée récente en physique avec un focus sur l'électromagnétisme et la mécanique quantique. J'apporte une perspective fraîche et adaptée aux étudiants sur des sujets difficiles.",
    location: "Montréal, Canada",
    languages: ["Arabe", "Français", "Anglais"],
    availability: "Mar–Sam, 8 h – 14 h",
    classesThisMonth: 0,
    totalClasses: 0,
    completionRate: 0,
    responseTime: "N/A",
    qualifications: ["M.Sc. Physique – USTHB Alger"],
    recentStudents: [],
    upcomingClasses: [],
    monthlyEarnings: 0,
  },
];
