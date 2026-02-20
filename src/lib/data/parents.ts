import { formatCurrency } from "@/lib/utils";
import {
  Parent,
  ParentPlan,
  PaymentStatus,
  ParentStatus,
  PlanId,
} from "@/types";

export { formatCurrency };

export const mockPlans: ParentPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 350,
    color: "oklch(0.52 0.14 250)",
    maxChildren: 1,
    resourceAccess: false,
    prioritySupport: false,
    description: "1 enfant, accès aux cours de base.",
  },
  {
    id: "family",
    name: "Famille",
    price: 700,
    color: "oklch(0.58 0.16 155)",
    maxChildren: 3,
    resourceAccess: true,
    prioritySupport: false,
    description: "Jusqu'à 3 enfants, accès aux ressources inclus.",
  },
  {
    id: "premium",
    name: "Premium",
    price: 1100,
    color: "oklch(0.62 0.16 80)",
    maxChildren: null,
    resourceAccess: true,
    prioritySupport: true,
    description: "Enfants illimités, accès complet et support prioritaire.",
  },
  {
    id: "custom",
    name: "Sur mesure",
    price: 0,
    color: "oklch(0.52 0.12 300)",
    maxChildren: null,
    resourceAccess: true,
    prioritySupport: true,
    description: "Plan personnalisé négocié avec l'administration.",
  },
];

export function getPlanById(id: PlanId): ParentPlan | undefined {
  return mockPlans.find((p) => p.id === id);
}

export const mockParents: Parent[] = [
  {
    id: "par1",
    name: "Paulo Gavi",
    email: "paulo.gavi@gmail.com",
    phone: "+1 514 661 0201",
    location: "Montréal, Canada",
    status: "active",
    children: [
      { name: "Lucas Gavi", age: 12, grade: "Classe 6" },
      { name: "Sofia Gavi", age: 9, grade: "Classe 3" },
    ],
    paymentStatus: "paid",
    joinedDate: "Jan 2025",
    planId: "family",
    notes: "Préfère les communications par e-mail.",
    totalPayments: 4200,
    lastPaymentDate: "15 Jun 2025",
    nextPaymentDate: "15 Jul 2025",
    monthlyFee: 350,
  },
  {
    id: "par2",
    name: "Alex Sanches",
    email: "alex.sanches@gmail.com",
    phone: "+1 514 661 0202",
    location: "Montréal, Canada",
    status: "active",
    children: [{ name: "Mia Sanches", age: 14, grade: "Classe 8" }],
    paymentStatus: "paid",
    joinedDate: "Fév 2025",
    planId: "starter",
    notes: "",
    totalPayments: 1750,
    lastPaymentDate: "10 Jun 2025",
    nextPaymentDate: "10 Jul 2025",
    monthlyFee: 350,
  },
  {
    id: "par3",
    name: "Fatima Zahra",
    email: "f.zahra@yahoo.com",
    phone: "+1 514 661 0203",
    location: "Montréal, Canada",
    status: "active",
    children: [
      { name: "Youssef Zahra", age: 10, grade: "Classe 4" },
      { name: "Nour Zahra", age: 8, grade: "Classe 2" },
      { name: "Amine Zahra", age: 6, grade: "Classe 1" },
    ],
    paymentStatus: "pending",
    joinedDate: "Mar 2025",
    planId: "premium",
    notes: "Trois enfants inscrits — tarif famille appliqué.",
    totalPayments: 2800,
    lastPaymentDate: "01 Jun 2025",
    nextPaymentDate: "01 Jul 2025",
    monthlyFee: 900,
  },
  {
    id: "par4",
    name: "Carlos Mendez",
    email: "c.mendez@hotmail.com",
    phone: "+1 514 661 0204",
    location: "Montréal, Canada",
    status: "suspended",
    children: [{ name: "Diego Mendez", age: 13, grade: "Classe 7" }],
    paymentStatus: "overdue",
    joinedDate: "Nov 2024",
    planId: "starter",
    notes: "Compte suspendu pour non-paiement. Contacter avant réactivation.",
    totalPayments: 1050,
    lastPaymentDate: "15 Mar 2025",
    nextPaymentDate: "—",
    monthlyFee: 350,
  },
  {
    id: "par5",
    name: "Amina Belkacem",
    email: "amina.b@gmail.com",
    phone: "+1 514 661 0205",
    location: "Montréal, Canada",
    status: "active",
    children: [
      { name: "Rania Belkacem", age: 15, grade: "Classe 9" },
      { name: "Tarek Belkacem", age: 11, grade: "Classe 5" },
    ],
    paymentStatus: "paid",
    joinedDate: "Déc 2024",
    planId: "family",
    notes: "",
    totalPayments: 4200,
    lastPaymentDate: "20 Jun 2025",
    nextPaymentDate: "20 Jul 2025",
    monthlyFee: 700,
  },
  {
    id: "par6",
    name: "Jean-Pierre Dupont",
    email: "jp.dupont@gmail.com",
    phone: "+1 514 661 0206",
    location: "Montréal, Canada",
    status: "inactive",
    children: [{ name: "Camille Dupont", age: 7, grade: "Classe 1" }],
    paymentStatus: "pending",
    joinedDate: "Avr 2025",
    planId: "starter",
    notes: "En attente de confirmation d'inscription.",
    totalPayments: 350,
    lastPaymentDate: "01 Apr 2025",
    nextPaymentDate: "—",
    monthlyFee: 350,
  },
  {
    id: "par7",
    name: "Samira Oukaci",
    email: "samira.oukaci@gmail.com",
    phone: "+1 514 661 0207",
    location: "Montréal, Canada",
    status: "active",
    children: [{ name: "Ines Oukaci", age: 12, grade: "Classe 6" }],
    paymentStatus: "paid",
    joinedDate: "Sep 2024",
    planId: "starter",
    notes: "",
    totalPayments: 3500,
    lastPaymentDate: "05 Jun 2025",
    nextPaymentDate: "05 Jul 2025",
    monthlyFee: 350,
  },
  {
    id: "par8",
    name: "Hicham Bouras",
    email: "hicham.b@outlook.com",
    phone: "+1 514 661 0208",
    location: "Montréal, Canada",
    status: "active",
    children: [
      { name: "Adam Bouras", age: 9, grade: "Classe 3" },
      { name: "Lina Bouras", age: 6, grade: "Classe 1" },
    ],
    paymentStatus: "overdue",
    joinedDate: "Jun 2025",
    planId: "family",
    notes: "Paiement en retard de 2 semaines. Relance envoyée.",
    totalPayments: 0,
    lastPaymentDate: "—",
    nextPaymentDate: "01 Jul 2025",
    monthlyFee: 700,
  },
  {
    id: "par9",
    name: "Nadia Cherif",
    email: "nadia.cherif@gmail.com",
    phone: "+1 514 661 0209",
    location: "Laval, Canada",
    status: "active",
    children: [{ name: "Samir Cherif", age: 11, grade: "Classe 5" }],
    paymentStatus: "paid",
    joinedDate: "Jan 2025",
    planId: "starter",
    notes: "",
    totalPayments: 2100,
    lastPaymentDate: "12 Jun 2025",
    nextPaymentDate: "12 Jul 2025",
    monthlyFee: 350,
  },
  {
    id: "par10",
    name: "Omar Benali",
    email: "o.benali@gmail.com",
    phone: "+1 514 661 0210",
    location: "Brossard, Canada",
    status: "active",
    children: [
      { name: "Leila Benali", age: 13, grade: "Classe 7" },
      { name: "Karim Benali", age: 10, grade: "Classe 4" },
    ],
    paymentStatus: "paid",
    joinedDate: "Oct 2024",
    planId: "premium",
    notes: "Paiement automatique activé.",
    totalPayments: 6300,
    lastPaymentDate: "08 Jun 2025",
    nextPaymentDate: "08 Jul 2025",
    monthlyFee: 700,
  },
];

export const paymentStatusStyles: Record<
  PaymentStatus,
  { background: string; color: string; label: string }
> = {
  paid: {
    background: "oklch(0.95 0.018 155)",
    color: "oklch(0.38 0.12 155)",
    label: "Payé",
  },
  pending: {
    background: "oklch(0.96 0.03 80)",
    color: "oklch(0.52 0.14 80)",
    label: "En attente",
  },
  overdue: {
    background: "oklch(0.96 0.025 20)",
    color: "oklch(0.48 0.16 20)",
    label: "En retard",
  },
  unpaid: {
    background: "oklch(0.96 0.025 20)",
    color: "oklch(0.48 0.16 20)",
    label: "Non payé",
  },
};

export const parentStatusStyles: Record<
  ParentStatus,
  { background: string; color: string; label: string }
> = {
  active: {
    background: "oklch(0.95 0.018 155)",
    color: "oklch(0.38 0.12 155)",
    label: "Actif",
  },
  inactive: {
    background: "oklch(0.94 0.008 80)",
    color: "oklch(0.48 0.02 250)",
    label: "Inactif",
  },
  suspended: {
    background: "oklch(0.96 0.025 20)",
    color: "oklch(0.48 0.16 20)",
    label: "Suspendu",
  },
};

export const PARENT_COLOR = "oklch(0.52 0.14 250)";

export function getParentById(id: string): Parent | undefined {
  return mockParents.find((p) => p.id === id);
}

export function getParentInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
