"use client";

import { GenericSidebar } from "@/components/ui/generic-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuthProfile } from "@/hooks/auth";
import { clearAuthToken, getAuthToken } from "@/lib/api-client";
import { mapBackendRole } from "@/lib/auth-role";
import { useAuthStore } from "@/store/auth";
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
        title: "Leçons",
        url: "/dashboard/lessons",
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
  const setUser = useAuthStore((s) => s.setUser);
  const hasToken = !!getAuthToken();
  const { data: profile, isLoading, isError } = useAuthProfile(hasToken);

  useEffect(() => {
    if (!hasToken) {
      router.replace("/sign-in");
      return;
    }
    if (isError) {
      clearAuthToken();
      router.replace("/sign-in");
      return;
    }
    if (profile && mapBackendRole(profile.role) !== "admin") {
      clearAuthToken();
      router.replace("/sign-in?reason=role_blocked");
      return;
    }
    if (profile) {
      setUser(profile);
    }
  }, [hasToken, isError, profile, router, setUser]);

  if (!hasToken || isLoading) return null;
  if (profile && mapBackendRole(profile.role) !== "admin") return null;

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
            router.replace("/sign-in");
          }}
        />
        <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
      </div>
    </SidebarProvider>
  );
}
