"use client";

import { PLANS, plans } from "@/constants";
import { useUpgradePlan } from "@/hooks/useUpgradePlan";
import { useSearchParams } from "next/navigation";
import { useRedirectWithLoader } from "@/hooks/useRedirectWithLoader";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect } from "react";
import ButtonWithLoading from "@/components/ButtonWithLoading";

type SubscriptionClientProps = {
  plan: string | null;
};

const SubscriptionClient = ({ plan }: SubscriptionClientProps) => {
  const { upgrade, isPending } = useUpgradePlan();
  const { loading, setLoading } = useRedirectWithLoader();
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  useEffect(() => {
    if (status === "approved") {
      toast.success("¡Pago aprobado! 🎉");
    }
  }, [status]);

  return (
    <main
      className="min-h-screen px-4 py-16"
      style={{ backgroundColor: "#faf9f6" }}
    >
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-violet-900">Elegí tu plan</h1>
        <p className="mt-2 text-gray-600">
          Comenzá gratis y mejorá cuando quieras
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
        {plans.map((p, idx) => {
          const isCurrent = p.id === plan;
          const isPro = plan === PLANS.PRO;

          return (
            <div
              key={idx}
              className={`flex h-[480px] flex-col justify-between rounded-2xl border p-8 shadow-md transition-all duration-300 ${
                p.highlight
                  ? "scale-[1.02] border-yellow-500 bg-yellow-50"
                  : "border-gray-300 bg-white"
              }`}
            >
              <div>
                <h2 className="mb-2 text-3xl font-bold text-violet-900">
                  {p.name}
                </h2>
                <p className="mb-4 text-lg font-semibold text-gray-700">
                  {p.price}
                </p>
                <ul className="mb-6 space-y-2 text-gray-600">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mt-[2px] mr-2 text-green-600">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <ButtonWithLoading
                redirectTo="/subscription"
                disabled={isCurrent || (isPro && isPending)}
                className={`transition ${
                  isCurrent
                    ? "cursor-not-allowed bg-gray-300"
                    : p.highlight
                      ? "bg-yellow-400 hover:bg-yellow-500"
                      : "bg-violet-900 hover:bg-violet-950"
                }`}
                onClickExtra={() => {
                  setLoading(true);
                  return upgrade({ setLoading, targetPlan: p.id });
                }}
              >
                {loading && !isCurrent ? (
                  <>{p.id === "free" ? "Volver al plan gratis" : p.cta}</>
                ) : isCurrent ? (
                  "Tu plan actual"
                ) : p.id === "free" ? (
                  "Volver al plan gratis"
                ) : (
                  p.cta
                )}
              </ButtonWithLoading>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default SubscriptionClient;
