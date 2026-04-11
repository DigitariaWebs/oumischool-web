"use client";

import { cn } from "@/lib/utils";
import { BookOpen, Gamepad2, House, Settings, Trophy } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { title: "Accueil", href: "/student", icon: House },
  { title: "Jeux", href: "/student/exercises", icon: Gamepad2 },
  { title: "Biblio", href: "/student/resources", icon: BookOpen },
  { title: "Progrès", href: "/student/progress", icon: Trophy },
  { title: "Réglages", href: "/student/settings", icon: Settings },
];

export function StudentMobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigation étudiant mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur"
    >
      <ul className="mx-auto grid w-full max-w-md grid-cols-5 gap-1">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-label={item.title}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center rounded-xl px-1 text-[11px] font-medium transition",
                  active
                    ? "bg-primary/12 text-primary"
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                )}
              >
                <Icon className="mb-1 h-4 w-4" aria-hidden="true" />
                <span>{item.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
