"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCommission, useUpdateCommission } from "@/hooks/settings";
import { formatCurrency } from "@/lib/utils";
import { useSettingsStore } from "@/store/settings";
import {
  Settings,
  Percent,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useState } from "react";

const EXAMPLE_AMOUNT = 1000;

export default function SettingsPage() {
  const { platformCut, setPlatformCut } = useSettingsStore();
  const { data: commissionData } = useCommission();
  const updateCommission = useUpdateCommission();
  const [inputValue, setInputValue] = useState("");
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  const activePlatformCut = commissionData?.commissionPct ?? platformCut;
  const effectiveInput = dirty
    ? inputValue
    : (activePlatformCut * 100).toString();
  const parsed = parseFloat(effectiveInput);
  const isValid = !isNaN(parsed) && parsed >= 0 && parsed <= 100;
  const previewCut = isValid ? parsed / 100 : activePlatformCut;

  const platformRevenue = EXAMPLE_AMOUNT * previewCut;
  const tutorRevenue = EXAMPLE_AMOUNT - platformRevenue;

  const handleChange = (value: string) => {
    setInputValue(value);
    setDirty(true);
    setSaved(false);
  };

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(parseFloat(e.target.value).toFixed(1));
  };

  const handleSave = async () => {
    if (!isValid || !dirty) return;
    try {
      await updateCommission.mutateAsync(parsed / 100);
      setPlatformCut(parsed / 100);
      setSaved(true);
      setDirty(false);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // error handled by mutation state
    }
  };

  const handleReset = () => {
    const current = (activePlatformCut * 100).toString();
    setInputValue(current);
    setDirty(false);
    setSaved(false);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-background px-6">
        <div>
          <h1 className="text-base font-semibold text-foreground tracking-tight flex items-center gap-2">
            <Settings className="h-4 w-4 text-muted-foreground" />
            Paramètres
          </h1>
          <p className="text-xs text-muted-foreground">
            Configuration de la plateforme
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl space-y-4">
          {/* Card */}
          <div className="dash-card overflow-hidden">
            {/* Card header */}
            <div className="flex items-center gap-3 border-b border-border/60 px-6 py-4">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
                style={{ background: "oklch(0.93 0.02 250)" }}
              >
                <Percent
                  className="h-4 w-4"
                  style={{ color: "oklch(0.52 0.14 250)" }}
                />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  Commission de la plateforme
                </h2>
                <p className="text-xs text-muted-foreground">
                  Pourcentage prélevé sur chaque transaction tuteur
                </p>
              </div>
            </div>

            {/* Card body */}
            <div className="p-6 space-y-6">
              {/* Slider + input row */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    Taux de commission
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      step={0.1}
                      value={effectiveInput}
                      onChange={(e) => handleChange(e.target.value)}
                      data-invalid={!isValid || undefined}
                      className="h-8 w-24 pr-7 text-right text-sm aria-invalid:border-destructive"
                    />
                    <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      %
                    </span>
                  </div>
                </div>

                {/* Slider */}
                <div className="relative py-1">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={0.1}
                    value={isValid ? parsed : activePlatformCut * 100}
                    onChange={handleSlider}
                    className="w-full h-1.5 appearance-none rounded-full outline-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, oklch(0.52 0.14 250) 0%, oklch(0.52 0.14 250) ${isValid ? parsed : activePlatformCut * 100}%, oklch(0.91 0.012 80) ${isValid ? parsed : activePlatformCut * 100}%, oklch(0.91 0.012 80) 100%)`,
                    }}
                  />
                  <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground/60">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              {/* Live preview */}
              <div
                className="rounded-xl border p-4 space-y-3"
                style={{
                  background: "oklch(0.985 0.004 80)",
                  borderColor: "oklch(0.91 0.012 80)",
                }}
              >
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Aperçu — transaction de {formatCurrency(EXAMPLE_AMOUNT)}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className="rounded-xl p-3.5"
                    style={{
                      background: "oklch(0.93 0.02 250)",
                      border: "1px solid oklch(0.86 0.04 250)",
                    }}
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      <TrendingUp
                        className="h-3.5 w-3.5"
                        style={{ color: "oklch(0.52 0.14 250)" }}
                      />
                      <span
                        className="text-[11px] font-medium"
                        style={{ color: "oklch(0.52 0.14 250)" }}
                      >
                        Plateforme
                      </span>
                    </div>
                    <p
                      className="text-xl font-bold"
                      style={{ color: "oklch(0.35 0.1 250)" }}
                    >
                      {formatCurrency(platformRevenue)}
                    </p>
                    <p
                      className="text-[11px] mt-0.5"
                      style={{ color: "oklch(0.52 0.14 250)" }}
                    >
                      {(previewCut * 100).toFixed(1)}% de la transaction
                    </p>
                  </div>

                  <div
                    className="rounded-xl p-3.5"
                    style={{
                      background: "oklch(0.95 0.018 155)",
                      border: "1px solid oklch(0.87 0.06 155)",
                    }}
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      <DollarSign
                        className="h-3.5 w-3.5"
                        style={{ color: "oklch(0.42 0.12 155)" }}
                      />
                      <span
                        className="text-[11px] font-medium"
                        style={{ color: "oklch(0.42 0.12 155)" }}
                      >
                        Tuteur
                      </span>
                    </div>
                    <p
                      className="text-xl font-bold"
                      style={{ color: "oklch(0.28 0.1 155)" }}
                    >
                      {formatCurrency(tutorRevenue)}
                    </p>
                    <p
                      className="text-[11px] mt-0.5"
                      style={{ color: "oklch(0.42 0.12 155)" }}
                    >
                      {((1 - previewCut) * 100).toFixed(1)}% de la transaction
                    </p>
                  </div>
                </div>

                {/* Bar */}
                <div
                  className="h-1.5 w-full rounded-full overflow-hidden"
                  style={{ background: "oklch(0.91 0.012 80)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-200"
                    style={{
                      width: `${(previewCut * 100).toFixed(1)}%`,
                      background: "oklch(0.52 0.14 250)",
                    }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  {saved && (
                    <span
                      className="flex items-center gap-1.5 text-xs font-medium"
                      style={{ color: "oklch(0.58 0.16 155)" }}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Modifications enregistrées
                    </span>
                  )}
                  {!isValid && (
                    <span className="text-xs text-destructive">
                      Valeur invalide (0 – 100)
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {dirty && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-xl text-muted-foreground h-8 text-xs"
                      onClick={handleReset}
                    >
                      Annuler
                    </Button>
                  )}
                  <Button
                    size="sm"
                    disabled={!isValid || !dirty || updateCommission.isPending}
                    className="rounded-xl text-white h-8 text-xs gap-1.5 disabled:opacity-40"
                    style={{ background: "oklch(0.58 0.16 155)" }}
                    onClick={handleSave}
                  >
                    {updateCommission.isPending ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Enregistrement…
                      </>
                    ) : (
                      "Enregistrer"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
