"use client";

import { StudentPageHeader } from "../_components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useAuthProfile,
  useChangePassword,
  useUpdateProfile,
} from "@/hooks/auth";
import { Info, Loader2, Lock, Mail } from "lucide-react";
import { useState } from "react";

export default function StudentSettingsPage() {
  const profileQuery = useAuthProfile(true);
  const changePassword = useChangePassword();
  const updateProfile = useUpdateProfile();

  const [passwordOpen, setPasswordOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);

  const resetPasswordForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setNewPasswordConfirm("");
    setPasswordError(null);
    setPasswordSuccess(null);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);
    if (newPassword.length < 8) {
      setPasswordError(
        "Le nouveau mot de passe doit faire au moins 8 caractères.",
      );
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      setPasswordError("Les mots de passe ne correspondent pas.");
      return;
    }
    try {
      await changePassword.mutateAsync({ currentPassword, newPassword });
      setPasswordSuccess("Mot de passe mis à jour.");
      setTimeout(() => {
        setPasswordOpen(false);
        resetPasswordForm();
      }, 900);
    } catch (err) {
      setPasswordError(
        err instanceof Error
          ? err.message
          : "Impossible de modifier le mot de passe.",
      );
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setEmailSuccess(null);
    if (!email.includes("@")) {
      setEmailError("Adresse email invalide.");
      return;
    }
    try {
      await updateProfile.mutateAsync({ email });
      setEmailSuccess("Email mis à jour.");
      setTimeout(() => setEmailOpen(false), 900);
    } catch (err) {
      setEmailError(
        err instanceof Error
          ? err.message
          : "Impossible de mettre à jour l'email.",
      );
    }
  };

  return (
    <div className="flex min-h-full flex-col">
      <StudentPageHeader title="Paramètres" subtitle="Gère ton compte" />

      <div className="mx-auto w-full max-w-3xl space-y-5 p-4 md:p-8">
        {/* Compte & sécurité */}
        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2.5 text-base font-semibold">
              <Lock className="h-4 w-4 text-muted-foreground" />
              Compte & sécurité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-border/70 p-3">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Email
                </p>
                <p className="mt-0.5 truncate text-sm font-medium text-foreground">
                  {profileQuery.data?.email ?? "—"}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEmailError(null);
                  setEmailSuccess(null);
                  setEmail(profileQuery.data?.email ?? "");
                  setEmailOpen(true);
                }}
              >
                <Mail className="mr-2 h-4 w-4" />
                Modifier
              </Button>
            </div>
            <Button
              variant="outline"
              className="h-10 w-full justify-start rounded-xl text-sm font-medium"
              onClick={() => {
                resetPasswordForm();
                setPasswordOpen(true);
              }}
            >
              <Lock className="mr-2 h-4 w-4" />
              Modifier mon mot de passe
            </Button>
          </CardContent>
        </Card>

        {/* À propos */}
        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2.5 text-base font-semibold">
              <Info className="h-4 w-4 text-muted-foreground" />À propos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Rôle</span>
              <span className="font-medium text-foreground">
                {profileQuery.data?.role ?? "—"}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-border/60 pt-3">
              <span className="text-muted-foreground">Développé par</span>
              <span className="font-medium text-foreground">
                OumiSchool · 2026
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Password dialog */}
      <Dialog
        open={passwordOpen}
        onOpenChange={(open) => {
          setPasswordOpen(open);
          if (!open) resetPasswordForm();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier le mot de passe</DialogTitle>
            <DialogDescription>
              Entre ton mot de passe actuel puis choisis-en un nouveau (8
              caractères minimum).
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="currentPassword">Mot de passe actuel</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="newPasswordConfirm">Confirmer</Label>
              <Input
                id="newPasswordConfirm"
                type="password"
                value={newPasswordConfirm}
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                required
                minLength={8}
              />
            </div>
            {passwordError ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                {passwordError}
              </p>
            ) : null}
            {passwordSuccess ? (
              <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
                {passwordSuccess}
              </p>
            ) : null}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPasswordOpen(false)}
                disabled={changePassword.isPending}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={changePassword.isPending}>
                {changePassword.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  "Enregistrer"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Email dialog */}
      <Dialog
        open={emailOpen}
        onOpenChange={(open) => {
          setEmailOpen(open);
          if (!open) {
            setEmailError(null);
            setEmailSuccess(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mettre à jour mon email</DialogTitle>
            <DialogDescription>
              Cette adresse sera utilisée pour te connecter et recevoir les
              messages de l&apos;école.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateEmail} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="email">Nouvelle adresse email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {emailError ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                {emailError}
              </p>
            ) : null}
            {emailSuccess ? (
              <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
                {emailSuccess}
              </p>
            ) : null}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEmailOpen(false)}
                disabled={updateProfile.isPending}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={updateProfile.isPending}>
                {updateProfile.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  "Enregistrer"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
