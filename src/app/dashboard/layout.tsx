"use client";

import { GenericSidebar } from "@/components/ui/generic-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuthProfile } from "@/hooks/auth";
import { clearAuthToken, getAuthToken } from "@/lib/api-client";
import {
  Banknote,
  BookOpen,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Users,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const menuSections = [
  {
    items: [
      {
        title: "Aperçu",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Utilisateurs",
    items: [
      {
        title: "Tuteurs",
        url: "/dashboard/tutors",
        icon: GraduationCap,
      },
      {
        title: "Parents",
        url: "/dashboard/parents",
        icon: UsersRound,
      },
      {
        title: "Étudiants",
        url: "/dashboard/students",
        icon: Users,
      },
    ],
  },
  {
    label: "Contenu",
    items: [
      {
        title: "Ressources",
        url: "/dashboard/resources",
        icon: BookOpen,
      },
      {
        title: "Matières",
        url: "/dashboard/subjects",
        icon: GraduationCap,
      },
    ],
  },
  {
    label: "Paiements",
    items: [
      {
        title: "Abonnements",
        url: "/dashboard/payments/subscriptions",
        icon: CreditCard,
      },
      {
        title: "Paiements",
        url: "/dashboard/payments/payouts",
        icon: Banknote,
      },
    ],
  },
  {
    items: [
      {
        title: "Paramètres",
        url: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const hasToken = !!getAuthToken();
  const { data: profile, isLoading, isError } = useAuthProfile(hasToken);

  useEffect(() => {
    if (!hasToken) {
      router.replace("/login");
      return;
    }
    if (isError) {
      clearAuthToken();
      router.replace("/login");
      return;
    }
    if (profile && String(profile.role).toUpperCase() !== "ADMIN") {
      clearAuthToken();
      router.replace("/login?reason=admin_only");
    }
  }, [hasToken, isError, profile, router]);

  if (!hasToken || isLoading) return null;
  if (profile && String(profile.role).toUpperCase() !== "ADMIN") return null;

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <GenericSidebar
          header={
            <Image
              src="/logo.png"
              alt="OumiSchool"
              width={120}
              height={32}
              className="h-8 w-auto"
            />
          }
          menuSections={menuSections}
          showCollapseAll={false}
          showSearch={false}
          onLogout={() => {
            clearAuthToken();
            router.replace("/login");
          }}
        />
        <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
      </div>
    </SidebarProvider>
  );
}
