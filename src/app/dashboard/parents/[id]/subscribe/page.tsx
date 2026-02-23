"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";
import { stripePromise } from "@/lib/stripe";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CreditCard } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState } from "react";

interface Plan {
  id: string;
  name: string;
  price: number;
  description?: string;
}

interface IntentResponse {
  clientSecret: string;
  orderId: string;
  amount: number;
}

function CheckoutForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard/parents`,
      },
    });

    if (error) {
      setErrorMessage(error.message ?? "Payment failed");
      setIsProcessing(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-border/60 p-4">
        <PaymentElement />
      </div>

      {errorMessage && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full gap-2 rounded-xl text-white"
        style={{ background: "oklch(0.52 0.14 250)" }}
      >
        <CreditCard className="h-4 w-4" />
        {isProcessing ? "Traitement..." : "Confirmer le paiement"}
      </Button>
    </form>
  );
}

export default function SubscribeParentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ planId?: string }>;
}) {
  const { id } = use(params);
  const { planId } = use(searchParams);
  const router = useRouter();

  const { data: plans = [] } = useQuery({
    queryKey: ["plans"],
    queryFn: () => api.get<Plan[]>("/subscriptions/plans"),
  });

  const selectedPlan = plans.find((p) => p.id === planId) ?? plans[0];

  const { data: intent, isLoading: intentLoading } = useQuery({
    queryKey: ["subscription-intent", planId],
    queryFn: () =>
      api.post<IntentResponse>("/payments/subscriptions/create-intent", {
        planId: selectedPlan?.id,
      }),
    enabled: !!selectedPlan,
  });

  if (!selectedPlan || intentLoading || !intent) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Préparation du paiement…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Link href={`/dashboard/parents/${id}`}>
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-base font-semibold text-foreground">
            Abonnement — {selectedPlan.name}
          </h1>
          <p className="text-xs text-muted-foreground">
            {selectedPlan.price.toFixed(2)} CAD / mois
          </p>
        </div>
      </div>

      {/* Plan card */}
      <div
        className="mb-6 rounded-xl border border-border/60 p-4"
        style={{ background: "oklch(0.96 0.012 250)" }}
      >
        <p className="text-sm font-medium text-foreground">
          {selectedPlan.name}
        </p>
        <p className="text-2xl font-bold text-foreground mt-1">
          ${selectedPlan.price.toFixed(2)}{" "}
          <span className="text-sm font-normal text-muted-foreground">CAD</span>
        </p>
        {selectedPlan.description && (
          <p className="mt-1 text-xs text-muted-foreground">
            {selectedPlan.description}
          </p>
        )}
      </div>

      {/* Stripe Elements */}
      <Elements
        stripe={stripePromise}
        options={{ clientSecret: intent.clientSecret }}
      >
        <CheckoutForm
          onSuccess={() => router.push(`/dashboard/parents/${id}`)}
        />
      </Elements>
    </div>
  );
}
