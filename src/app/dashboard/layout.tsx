"use client";

import { GenericSidebar } from "@/components/ui/generic-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Users,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
          onLogout={() => router.push("/login")}
        />
        <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
      </div>
    </SidebarProvider>
  );
}
