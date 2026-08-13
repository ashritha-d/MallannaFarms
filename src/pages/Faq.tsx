import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import Seo from "@/components/seo/Seo";
import PageHero from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { CardSkeleton, EmptyState, ErrorState } from "@/components/ui/States";
import { getFaqs } from "@/data/content";
import { FARM_IMAGES } from "@/data/seed";
import type { Faq } from "@/lib/database.types";

type Status = "loading" | "ready" | "error";

export default function FaqPage() {
  const [status, setStatus] = useState<Status>("loading");
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  const load = () => {
    setStatus("loading");
    getFaqs()
      .then((res) => {
        setFaqs(res.data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(load, []);

  return (
    <>
      <Seo
        title="Frequently Asked Questions"
        description="Answers to common questions about Mallanna Farms' free-range eggs, farming practices, freshness, and ordering."
        path="/faq"
      />
      <PageHero eyebrow="FAQ" title="Frequently Asked Questions" image={FARM_IMAGES.f3} />

      <Section tone="cream">
        <div className="mx-auto max-w-3xl">
          {status === "loading" && <CardSkeleton count={4} />}
          {status === "error" && <ErrorState onRetry={load} />}
          {status === "ready" && faqs.length === 0 && <EmptyState title="No FAQs yet" />}
          {status === "ready" && faqs.length > 0 && (
            <div className="space-y-3">
              {faqs.map((f) => {
                const isOpen = openId === f.id;
                return (
                  <div key={f.id} className="card overflow-hidden">
                    <button
                      onClick={() => setOpenId(isOpen ? null : f.id)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="font-display text-base font-semibold text-forest-900">{f.question}</span>
                      <ChevronDown className={`h-5 w-5 shrink-0 text-forest-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    <div
                      className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-5 text-sm leading-relaxed text-forest-600">{f.answer}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
