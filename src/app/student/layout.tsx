"use client";

import { StudentMobileNav } from "./_components/mobile-nav";
import { RoleGuard } from "@/components/auth/role-guard";
import { GenericSidebar } from "@/components/ui/generic-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuthStore } from "@/store/auth";
import {
  BookMarked,
  BookOpen,
  Gamepad2,
  LayoutDashboard,
  Settings,
  Trophy,
  UserCircle2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const menuSections = [
  {
    items: [
      { title: "Leçons", url: "/student", icon: LayoutDashboard },
      { title: "Jeux", url: "/student/exercises", icon: Gamepad2 },
      { title: "Biblio", url: "/student/resources", icon: BookOpen },
      { title: "Progrès", url: "/student/progress", icon: Trophy },
      { title: "Profil", url: "/student/profile", icon: UserCircle2 },
      { title: "Paramètres", url: "/student/settings", icon: Settings },
    ],
  },
];

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const clear = useAuthStore((s) => s.clear);
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <RoleGuard allowedRoles={["child"]}>
        <div className="min-h-screen bg-background">
          <main className="pb-[5.5rem]">{children}</main>
          <StudentMobileNav />
        </div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={["child"]}>
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
              clear();
              router.replace("/sign-in");
            }}
          />
          <main className="flex flex-1 flex-col overflow-auto">{children}</main>
        </div>
      </SidebarProvider>
    </RoleGuard>
  );
}
