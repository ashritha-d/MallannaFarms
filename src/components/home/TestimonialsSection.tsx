import { Star } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { useLanguage } from "@/contexts/LanguageContext";

// Sample/placeholder testimonials — clearly labelled as such below, and
// intentionally generic (no fabricated specific claims). Replace with real
// customer reviews once available.
const SAMPLE_TESTIMONIALS = [
  { name: "A Happy Customer", text: "The eggs taste noticeably fresher, and it's reassuring to know how the hens are raised." },
  { name: "A Happy Customer", text: "Ordering was easy and the team kept us updated about delivery. Will order again." },
  { name: "A Happy Customer", text: "Good to support a local farm that's transparent about how they raise their hens." },
];

export default function TestimonialsSection() {
  const { t } = useLanguage();
  return (
    <Section tone="cream">
      <SectionHeading eyebrow={t("section_testimonials_eyebrow")} title={t("section_testimonials_title")} />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {SAMPLE_TESTIMONIALS.map((review, i) => (
          <div key={i} className="card flex flex-col gap-3 p-6">
            <div className="flex items-center gap-1 text-gold-500">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="flex-1 text-sm leading-relaxed text-forest-700">“{review.text}”</p>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-forest-900">{review.name}</p>
              <span className="rounded-full bg-forest-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-forest-500">
                Sample review
              </span>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
