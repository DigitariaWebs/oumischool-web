import { Student } from "@/types";

export const STUDENT_COLOR = "oklch(0.62 0.16 80)";

export const subjectColors: Record<string, string> = {
  Physics: "oklch(0.65 0.12 220)",
  "UI/UX Design": "oklch(0.58 0.16 155)",
  Mathematics: "oklch(0.72 0.14 80)",
  "Graphic Design": "oklch(0.68 0.18 20)",
  Typography: "oklch(0.52 0.14 250)",
  "Colors & Elements": "oklch(0.62 0.16 340)",
  "3D Objects": "oklch(0.60 0.13 180)",
};

export function scoreColor(score: number): string {
  if (score >= 90) return "oklch(0.58 0.16 155)";
  if (score >= 75) return "oklch(0.62 0.16 80)";
  if (score >= 60) return "oklch(0.68 0.18 20)";
  return "oklch(0.577 0.245 27.325)";
}

export function getStudentInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function getStudentById(id: string): Student | undefined {
  return mockStudents.find((s) => s.id === id);
}

export function getStudentsByParentName(parentName: string): Student[] {
  return mockStudents.filter((s) => s.parentName === parentName);
}

export const mockStudents: Student[] = [
  {
    id: "s1",
    name: "Lucas Gavi",
    email: "lucas.gavi@student.oumischool.com",
    grade: "Classe 6",
    parentName: "Paulo Gavi",
    status: "actifs",
    enrolledSubjects: ["Mathematics", "Physics"],
    avgScore: 88,
    attendanceRate: 96,
    joinedDate: "Jan 2025",
    age: 12,
  },
  {
    id: "s2",
    name: "Sofia Gavi",
    email: "sofia.gavi@student.oumischool.com",
    grade: "Classe 3",
    parentName: "Paulo Gavi",
    status: "actifs",
    enrolledSubjects: ["Colors & Elements"],
    avgScore: 91,
    attendanceRate: 98,
    joinedDate: "Jan 2025",
    age: 9,
  },
  {
    id: "s3",
    name: "Mia Sanches",
    email: "mia.sanches@student.oumischool.com",
    grade: "Classe 8",
    parentName: "Alex Sanches",
    status: "actifs",
    enrolledSubjects: ["UI/UX Design", "Typography", "Graphic Design"],
    avgScore: 94,
    attendanceRate: 99,
    joinedDate: "Fév 2025",
    age: 14,
  },
  {
    id: "s4",
    name: "Youssef Zahra",
    email: "youssef.z@student.oumischool.com",
    grade: "Classe 4",
    parentName: "Fatima Zahra",
    status: "actifs",
    enrolledSubjects: ["Mathematics"],
    avgScore: 79,
    attendanceRate: 88,
    joinedDate: "Mar 2025",
    age: 10,
  },
  {
    id: "s5",
    name: "Nour Zahra",
    email: "nour.z@student.oumischool.com",
    grade: "Classe 2",
    parentName: "Fatima Zahra",
    status: "actifs",
    enrolledSubjects: ["Colors & Elements"],
    avgScore: 85,
    attendanceRate: 93,
    joinedDate: "Mar 2025",
    age: 8,
  },
  {
    id: "s6",
    name: "Amine Zahra",
    email: "amine.z@student.oumischool.com",
    grade: "Classe 1",
    parentName: "Fatima Zahra",
    status: "actifs",
    enrolledSubjects: ["Colors & Elements"],
    avgScore: 82,
    attendanceRate: 91,
    joinedDate: "Mar 2025",
    age: 6,
  },
  {
    id: "s7",
    name: "Diego Mendez",
    email: "diego.m@student.oumischool.com",
    grade: "Classe 7",
    parentName: "Carlos Mendez",
    status: "inactifs",
    enrolledSubjects: ["Mathematics", "Physics"],
    avgScore: 71,
    attendanceRate: 60,
    joinedDate: "Nov 2024",
    age: 13,
  },
  {
    id: "s8",
    name: "Rania Belkacem",
    email: "rania.b@student.oumischool.com",
    grade: "Classe 9",
    parentName: "Amina Belkacem",
    status: "actifs",
    enrolledSubjects: ["UI/UX Design", "Typography"],
    avgScore: 96,
    attendanceRate: 100,
    joinedDate: "Déc 2024",
    age: 15,
  },
  {
    id: "s9",
    name: "Tarek Belkacem",
    email: "tarek.b@student.oumischool.com",
    grade: "Classe 5",
    parentName: "Amina Belkacem",
    status: "actifs",
    enrolledSubjects: ["Mathematics", "3D Objects"],
    avgScore: 83,
    attendanceRate: 95,
    joinedDate: "Déc 2024",
    age: 11,
  },
  {
    id: "s10",
    name: "Camille Dupont",
    email: "camille.d@student.oumischool.com",
    grade: "Classe 1",
    parentName: "Jean-Pierre Dupont",
    status: "inactifs",
    enrolledSubjects: [],
    avgScore: 0,
    attendanceRate: 0,
    joinedDate: "Avr 2025",
    age: 7,
  },
  {
    id: "s11",
    name: "Ines Oukaci",
    email: "ines.o@student.oumischool.com",
    grade: "Classe 6",
    parentName: "Samira Oukaci",
    status: "actifs",
    enrolledSubjects: ["Graphic Design", "Typography"],
    avgScore: 89,
    attendanceRate: 97,
    joinedDate: "Sep 2024",
    age: 12,
  },
  {
    id: "s12",
    name: "Adam Bouras",
    email: "adam.b@student.oumischool.com",
    grade: "Classe 3",
    parentName: "Hicham Bouras",
    status: "actifs",
    enrolledSubjects: ["Mathematics"],
    avgScore: 77,
    attendanceRate: 85,
    joinedDate: "Jun 2025",
    age: 9,
  },
  {
    id: "s13",
    name: "Lina Bouras",
    email: "lina.b@student.oumischool.com",
    grade: "Classe 1",
    parentName: "Hicham Bouras",
    status: "actifs",
    enrolledSubjects: ["Colors & Elements"],
    avgScore: 80,
    attendanceRate: 90,
    joinedDate: "Jun 2025",
    age: 6,
  },
  {
    id: "s14",
    name: "Samir Cherif",
    email: "samir.c@student.oumischool.com",
    grade: "Classe 5",
    parentName: "Nadia Cherif",
    status: "actifs",
    enrolledSubjects: ["Mathematics", "Physics"],
    avgScore: 86,
    attendanceRate: 94,
    joinedDate: "Jan 2025",
    age: 11,
  },
  {
    id: "s15",
    name: "Leila Benali",
    email: "leila.b@student.oumischool.com",
    grade: "Classe 7",
    parentName: "Omar Benali",
    status: "actifs",
    enrolledSubjects: ["UI/UX Design", "Graphic Design"],
    avgScore: 92,
    attendanceRate: 98,
    joinedDate: "Oct 2024",
    age: 13,
  },
  {
    id: "s16",
    name: "Karim Benali",
    email: "karim.b@student.oumischool.com",
    grade: "Classe 4",
    parentName: "Omar Benali",
    status: "actifs",
    enrolledSubjects: ["Mathematics", "3D Objects"],
    avgScore: 81,
    attendanceRate: 92,
    joinedDate: "Oct 2024",
    age: 10,
  },
];
