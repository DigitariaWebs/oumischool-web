"use client";

import { RoleGuard } from "@/components/auth/role-guard";

export default function ParentHomePage() {
  return (
    <RoleGuard allowedRoles={["parent"]}>
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-lg rounded-2xl border border-border bg-card p-6">
          <h1 className="text-xl font-semibold">Espace parent</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Le portail parent web sera enrichi progressivement. Vous êtes bien
            connecté avec un profil parent.
          </p>
        </div>
      </main>
    </RoleGuard>
  );
}
