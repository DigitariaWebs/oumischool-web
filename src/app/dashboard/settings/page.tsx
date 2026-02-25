"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCommission,
  useUpdateCommission,
  usePlans,
  useCreatePlan,
  useUpdatePlan,
  useDeletePlan,
  useReactivatePlan,
  type Plan,
} from "@/hooks/settings";
import { formatCurrency } from "@/lib/utils";
import { useSettingsStore } from "@/store/settings";
import {
  Settings,
  Percent,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Loader2,
  CreditCard,
  Plus,
  Pencil,
  Trash2,
  RotateCcw,
  X,
  Check,
  Users,
  FileText,
  Gem,
  Download,
  HeadphonesIcon,
  BarChart3,
} from "lucide-react";
import { useState } from "react";

const EXAMPLE_AMOUNT = 1000;

interface PlanFormData {
  name: string;
  price: string;
  description: string;
  features: string[];
  maxChildren: string;
  includesFreeResources: boolean;
  includesPaidResources: boolean;
  maxResourceDownloads: string;
  hasPrioritySupport: boolean;
  hasAdvancedAnalytics: boolean;
}

const initialPlanForm: PlanFormData = {
  name: "",
  price: "",
  description: "",
  features: [""],
  maxChildren: "",
  includesFreeResources: false,
  includesPaidResources: false,
  maxResourceDownloads: "0",
  hasPrioritySupport: false,
  hasAdvancedAnalytics: false,
};

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

  // Plans state
  const { data: plansData, isLoading: plansLoading } = usePlans();
  const createPlan = useCreatePlan();
  const updatePlan = useUpdatePlan();
  const deletePlan = useDeletePlan();
  const reactivatePlan = useReactivatePlan();

  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [planForm, setPlanForm] = useState<PlanFormData>(initialPlanForm);
  const [planFormError, setPlanFormError] = useState("");
  const [planSaving, setPlanSaving] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openCreateModal = () => {
    setEditingPlan(null);
    setPlanForm(initialPlanForm);
    setPlanFormError("");
    setPlanModalOpen(true);
  };

  const openEditModal = (plan: Plan) => {
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name,
      price: plan.price.toString(),
      description: plan.description || "",
      features: plan.features.length > 0 ? plan.features : [""],
      maxChildren: plan.maxChildren?.toString() || "",
      includesFreeResources: plan.includesFreeResources ?? false,
      includesPaidResources: plan.includesPaidResources ?? false,
      maxResourceDownloads: (plan.maxResourceDownloads ?? 0).toString(),
      hasPrioritySupport: plan.hasPrioritySupport ?? false,
      hasAdvancedAnalytics: plan.hasAdvancedAnalytics ?? false,
    });
    setPlanFormError("");
    setPlanModalOpen(true);
  };

  const openDeleteModal = (plan: Plan) => {
    setPlanToDelete(plan);
    setDeleteModalOpen(true);
  };

  const handlePlanFormChange = (
    field: keyof PlanFormData,
    value: string | string[] | boolean,
  ) => {
    setPlanForm((prev) => ({ ...prev, [field]: value }));
    setPlanFormError("");
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...planForm.features];
    newFeatures[index] = value;
    setPlanForm((prev) => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setPlanForm((prev) => ({ ...prev, features: [...prev.features, ""] }));
  };

  const removeFeature = (index: number) => {
    if (planForm.features.length <= 1) return;
    const newFeatures = planForm.features.filter((_, i) => i !== index);
    setPlanForm((prev) => ({ ...prev, features: newFeatures }));
  };

  const handlePlanSubmit = async () => {
    const features = planForm.features.filter((f) => f.trim() !== "");
    if (!planForm.name.trim()) {
      setPlanFormError("Le nom du plan est requis");
      return;
    }
    const price = parseFloat(planForm.price);
    if (isNaN(price) || price < 0) {
      setPlanFormError("Le prix doit être un nombre positif");
      return;
    }
    const maxChildren = planForm.maxChildren
      ? parseInt(planForm.maxChildren)
      : null;
    if (maxChildren !== null && (isNaN(maxChildren) || maxChildren < 1)) {
      setPlanFormError(
        "Le nombre d'enfants doit être positif ou vide (illimité)",
      );
      return;
    }
    const maxResourceDownloads = parseInt(planForm.maxResourceDownloads) || 0;
    if (isNaN(maxResourceDownloads) || maxResourceDownloads < 0) {
      setPlanFormError("Le nombre de téléchargements doit être positif");
      return;
    }

    setPlanSaving(true);
    try {
      const data = {
        name: planForm.name.trim(),
        price,
        description: planForm.description.trim() || undefined,
        features,
        maxChildren,
        includesFreeResources: planForm.includesFreeResources,
        includesPaidResources: planForm.includesPaidResources,
        maxResourceDownloads,
        hasPrioritySupport: planForm.hasPrioritySupport,
        hasAdvancedAnalytics: planForm.hasAdvancedAnalytics,
      };

      if (editingPlan) {
        await updatePlan.mutateAsync({ id: editingPlan.id, data });
      } else {
        await createPlan.mutateAsync(data);
      }
      setPlanModalOpen(false);
    } catch (err) {
      setPlanFormError(
        err instanceof Error ? err.message : "Une erreur est survenue",
      );
    } finally {
      setPlanSaving(false);
    }
  };

  const handleDeletePlan = async () => {
    if (!planToDelete) return;
    setDeleting(true);
    try {
      await deletePlan.mutateAsync(planToDelete.id);
      setDeleteModalOpen(false);
      setPlanToDelete(null);
    } catch {
      // error handled by mutation
    } finally {
      setDeleting(false);
    }
  };

  const handleReactivatePlan = async (plan: Plan) => {
    try {
      await reactivatePlan.mutateAsync(plan.id);
    } catch {
      // error handled by mutation
    }
  };

  const plans = plansData || [];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-background px-4 md:px-6">
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

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="space-y-6">
          {/* Commission Card */}
          <div className="dash-card overflow-hidden">
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

            <div className="p-6 space-y-6">
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

          {/* Plans Card */}
          <div className="dash-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: "oklch(0.93 0.02 250)" }}
                >
                  <CreditCard
                    className="h-4 w-4"
                    style={{ color: "oklch(0.52 0.14 250)" }}
                  />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">
                    Plans d&apos;abonnement
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Gérer les plans disponibles à l&apos;achat
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                className="rounded-xl h-8 text-xs gap-1.5"
                style={{ background: "oklch(0.58 0.16 155)" }}
                onClick={openCreateModal}
              >
                <Plus className="h-3 w-3" />
                Ajouter
              </Button>
            </div>

            <div className="p-6">
              {plansLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : plans.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Aucun plan disponible
                </p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className="relative rounded-xl border p-4 transition-all"
                      style={{
                        background: plan.isActive
                          ? "oklch(1 0 0)"
                          : "oklch(0.98 0 0)",
                        borderColor: plan.isActive
                          ? "oklch(0.87 0.06 155)"
                          : "oklch(0.92 0 0)",
                        opacity: plan.isActive ? 1 : 0.7,
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {plan.name}
                          </h3>
                          <span
                            className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                            style={{
                              background: plan.isActive
                                ? "oklch(0.9 0.06 155)"
                                : "oklch(0.92 0 0)",
                              color: plan.isActive
                                ? "oklch(0.35 0.1 155)"
                                : "oklch(0.5 0 0)",
                            }}
                          >
                            {plan.isActive ? "Actif" : "Inactif"}
                          </span>
                        </div>
                        <div className="text-right">
                          <p
                            className="text-lg font-bold"
                            style={{ color: "oklch(0.35 0.1 250)" }}
                          >
                            {formatCurrency(plan.price)}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            /mois
                          </p>
                        </div>
                      </div>

                      {plan.description && (
                        <p className="text-xs text-muted-foreground mb-3">
                          {plan.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {plan.maxChildren ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                            <Users className="h-3 w-3" />
                            {plan.maxChildren} enfant
                            {plan.maxChildren > 1 ? "s" : ""}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                            <Users className="h-3 w-3" />
                            Enfants illimités
                          </span>
                        )}
                        {plan.includesFreeResources && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-green-50 text-green-700 border border-green-100">
                            <FileText className="h-3 w-3" />
                            Ressources gratuites
                          </span>
                        )}
                        {plan.includesPaidResources && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-purple-50 text-purple-700 border border-purple-100">
                            <Gem className="h-3 w-3" />
                            Ressources payantes
                          </span>
                        )}
                        {plan.maxResourceDownloads > 0 && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-orange-50 text-orange-700 border border-orange-100">
                            <Download className="h-3 w-3" />
                            {plan.maxResourceDownloads} téléchargement
                            {plan.maxResourceDownloads > 1 ? "s" : ""}/mois
                          </span>
                        )}
                        {plan.hasPrioritySupport && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-teal-50 text-teal-700 border border-teal-100">
                            <HeadphonesIcon className="h-3 w-3" />
                            Support prioritaire
                          </span>
                        )}
                        {plan.hasAdvancedAnalytics && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                            <BarChart3 className="h-3 w-3" />
                            Analytics avancé
                          </span>
                        )}
                      </div>

                      {plan.features.length > 0 && (
                        <ul className="space-y-1 mb-3">
                          {plan.features.slice(0, 3).map((feature, idx) => (
                            <li
                              key={idx}
                              className="text-xs text-muted-foreground flex items-center gap-1.5"
                            >
                              <Check className="h-3 w-3 text-green-500" />
                              {feature}
                            </li>
                          ))}
                          {plan.features.length > 3 && (
                            <li className="text-xs text-muted-foreground">
                              +{plan.features.length - 3} autres
                            </li>
                          )}
                        </ul>
                      )}

                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                        <span>
                          {plan._count.subscriptions} abonnement
                          {plan._count.subscriptions !== 1 ? "s" : ""}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs rounded-lg flex-1"
                          onClick={() => openEditModal(plan)}
                        >
                          <Pencil className="h-3 w-3 mr-1" />
                          Modifier
                        </Button>
                        {plan.isActive ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs rounded-lg text-destructive hover:text-destructive"
                            onClick={() => openDeleteModal(plan)}
                            disabled={plan._count.subscriptions > 0}
                            title={
                              plan._count.subscriptions > 0
                                ? "Impossible de désactiver un plan avec des abonnés"
                                : "Désactiver"
                            }
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs rounded-lg"
                            onClick={() => handleReactivatePlan(plan)}
                          >
                            <RotateCcw className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Plan Modal */}
      {planModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setPlanModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-background p-6 shadow-xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">
                {editingPlan ? "Modifier le plan" : "Nouveau plan"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setPlanModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="planName">Nom du plan</Label>
                <Input
                  id="planName"
                  value={planForm.name}
                  onChange={(e) => handlePlanFormChange("name", e.target.value)}
                  placeholder="Ex: Premium"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="planPrice">Prix (€)</Label>
                <Input
                  id="planPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={planForm.price}
                  onChange={(e) =>
                    handlePlanFormChange("price", e.target.value)
                  }
                  placeholder="Ex: 29.99"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="planDescription">Description</Label>
                <textarea
                  id="planDescription"
                  value={planForm.description}
                  onChange={(e) =>
                    handlePlanFormChange("description", e.target.value)
                  }
                  placeholder="Description optionnelle..."
                  className="flex min-h-[80px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="planMaxChildren">Enfants maximum</Label>
                <Input
                  id="planMaxChildren"
                  type="number"
                  min="1"
                  value={planForm.maxChildren}
                  onChange={(e) =>
                    handlePlanFormChange("maxChildren", e.target.value)
                  }
                  placeholder="Laisser vide pour illimité"
                />
                <p className="text-[10px] text-muted-foreground">
                  Laissez vide pour un nombre illimité d&apos;enfants
                </p>
              </div>

              <div className="space-y-3">
                <Label>Restrictions du plan</Label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox
                      id="includesFreeResources"
                      checked={planForm.includesFreeResources}
                      onCheckedChange={(checked) =>
                        handlePlanFormChange(
                          "includesFreeResources",
                          checked as boolean,
                        )
                      }
                    />
                    <span className="flex items-center gap-1.5">
                      <FileText className="h-4 w-4 text-green-600" />
                      Accès aux ressources gratuites
                    </span>
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox
                      id="includesPaidResources"
                      checked={planForm.includesPaidResources}
                      onCheckedChange={(checked) =>
                        handlePlanFormChange(
                          "includesPaidResources",
                          checked as boolean,
                        )
                      }
                    />
                    <span className="flex items-center gap-1.5">
                      <Gem className="h-4 w-4 text-purple-600" />
                      Achat de ressources payantes
                    </span>
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox
                      id="hasPrioritySupport"
                      checked={planForm.hasPrioritySupport}
                      onCheckedChange={(checked) =>
                        handlePlanFormChange(
                          "hasPrioritySupport",
                          checked as boolean,
                        )
                      }
                    />
                    <span className="flex items-center gap-1.5">
                      <HeadphonesIcon className="h-4 w-4 text-teal-600" />
                      Support prioritaire
                    </span>
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox
                      id="hasAdvancedAnalytics"
                      checked={planForm.hasAdvancedAnalytics}
                      onCheckedChange={(checked) =>
                        handlePlanFormChange(
                          "hasAdvancedAnalytics",
                          checked as boolean,
                        )
                      }
                    />
                    <span className="flex items-center gap-1.5">
                      <BarChart3 className="h-4 w-4 text-indigo-600" />
                      Analytics avancé
                    </span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxResourceDownloads">
                  Téléchargements mensuels
                </Label>
                <Input
                  id="maxResourceDownloads"
                  type="number"
                  min="0"
                  value={planForm.maxResourceDownloads}
                  onChange={(e) =>
                    handlePlanFormChange("maxResourceDownloads", e.target.value)
                  }
                  placeholder="0 = illimité"
                />
                <p className="text-[10px] text-muted-foreground">
                  Nombre de ressources téléchargeables par mois (0 = illimité)
                </p>
              </div>

              <div className="space-y-2">
                <Label>Fonctionnalités</Label>
                {planForm.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={feature}
                      onChange={(e) =>
                        handleFeatureChange(index, e.target.value)
                      }
                      placeholder="Ex: Support prioritaire"
                    />
                    {planForm.features.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive"
                        onClick={() => removeFeature(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={addFeature}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Ajouter une fonctionnalité
                </Button>
              </div>

              {planFormError && (
                <p className="text-xs text-destructive">{planFormError}</p>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setPlanModalOpen(false)}
                className="rounded-xl"
              >
                Annuler
              </Button>
              <Button
                className="rounded-xl"
                style={{ background: "oklch(0.58 0.16 155)" }}
                onClick={handlePlanSubmit}
                disabled={planSaving}
              >
                {planSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enregistrement…
                  </>
                ) : editingPlan ? (
                  "Enregistrer"
                ) : (
                  "Créer le plan"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && planToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setDeleteModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-sm rounded-2xl bg-background p-6 shadow-xl mx-4">
            <h2 className="text-lg font-semibold mb-2">Désactiver le plan</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Êtes-vous sûr de vouloir désactiver le plan &quot;
              <strong>{planToDelete.name}</strong>&quot; ?
              {planToDelete._count.subscriptions > 0 && (
                <span className="block mt-2 text-destructive">
                  Attention: {planToDelete._count.subscriptions} abonnement
                  {planToDelete._count.subscriptions > 1 ? "s" : ""} actif
                  {planToDelete._count.subscriptions > 1 ? "s" : ""} sous ce
                  plan.
                </span>
              )}
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteModalOpen(false)}
                className="rounded-xl"
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                className="rounded-xl"
                onClick={handleDeletePlan}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Désactivation…
                  </>
                ) : (
                  "Désactiver"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
