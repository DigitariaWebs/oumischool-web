"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

export interface NavItem {
  label: string;
  href?: string;
  icon: React.ElementType;
  disabled?: boolean;
  children?: {
    label: string;
    href: string;
    disabled?: boolean;
  }[];
}

export interface ModuleNavigationBarProps {
  moduleIcon: React.ElementType;
  dashboardHref: string;
  navItems: NavItem[];
  isCollapsed?: boolean;
  showNav?: boolean;
}

export function ModuleNavigationBar({
  moduleIcon: ModuleIcon,
  dashboardHref,
  navItems,
  isCollapsed = false,
  showNav = true,
}: ModuleNavigationBarProps) {
  const pathname = usePathname();

  const isActiveItem = (item: NavItem) => {
    if (item.href && pathname === item.href) return true;
    if (item.children) {
      return item.children.some((child) => pathname === child.href);
    }
    return false;
  };

  return (
    <div className="border-t bg-muted/30">
      {showNav && (
        <nav className="flex items-center gap-1 px-6 py-2 overflow-x-auto">
          {/* Dashboard Link */}
          <Link
            href={dashboardHref}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-all whitespace-nowrap font-medium",
              pathname === dashboardHref
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-foreground hover:bg-accent hover:text-foreground",
            )}
            title={isCollapsed ? "Tableau de bord" : undefined}
          >
            <ModuleIcon className="h-4 w-4" />
            {!isCollapsed && <span>Tableau de bord</span>}
          </Link>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveItem(item);

            if (item.disabled) {
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg text-muted-foreground opacity-50 cursor-not-allowed whitespace-nowrap"
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="h-4 w-4" />
                  {!isCollapsed && <span>{item.label}</span>}
                </div>
              );
            }

            if (item.children) {
              const enabledChildren = item.children.filter(
                (child) => !child.disabled,
              );
              const hasEnabledChildren = enabledChildren.length > 0;

              if (!hasEnabledChildren) {
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg text-muted-foreground opacity-50 cursor-not-allowed whitespace-nowrap"
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className="h-4 w-4" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>
                );
              }

              return (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-all whitespace-nowrap font-medium",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-foreground hover:bg-accent hover:text-foreground",
                    )}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className="h-4 w-4" />
                    {!isCollapsed && (
                      <>
                        <span>{item.label}</span>
                        <ChevronDown className="h-3 w-3" />
                      </>
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    {item.children.map((child, index) => {
                      if (child.disabled) {
                        return (
                          <React.Fragment key={child.href}>
                            <DropdownMenuItem disabled>
                              <span className="text-muted-foreground">
                                {child.label}
                              </span>
                            </DropdownMenuItem>
                            {index < item.children!.length - 1 && (
                              <DropdownMenuSeparator />
                            )}
                          </React.Fragment>
                        );
                      }

                      return (
                        <React.Fragment key={child.href}>
                          <DropdownMenuItem asChild>
                            <Link
                              href={child.href}
                              className={cn(
                                "w-full cursor-pointer",
                                pathname === child.href &&
                                  "bg-accent text-accent-foreground",
                              )}
                            >
                              {child.label}
                            </Link>
                          </DropdownMenuItem>
                          {index < item.children!.length - 1 && (
                            <DropdownMenuSeparator />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href!}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-all whitespace-nowrap font-medium",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground hover:bg-accent hover:text-foreground",
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4" />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
