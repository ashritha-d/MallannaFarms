import Seo from "@/components/seo/Seo";
import { Section } from "@/components/ui/Section";
import { useSettings } from "@/hooks/useSettings";

export default function Delivery() {
  const { data: settings } = useSettings();
  return (
    <>
      <Seo title="Delivery" description="How ordering and delivery works at Mallanna Farms." path="/delivery" />
      <Section tone="cream" className="pt-28 sm:pt-32">
        <div className="mx-auto max-w-3xl">
          <span className="section-eyebrow">Support</span>
          <h1 className="mt-2 font-display text-3xl font-semibold text-forest-900 sm:text-4xl">Delivery & Ordering</h1>

          <div className="mt-8 space-y-6 text-sm leading-relaxed text-forest-700 sm:text-base">
            <div>
              <h2 className="font-display text-lg font-semibold text-forest-900">How Ordering Works</h2>
              <p className="mt-2">
                Add the free-range eggs you'd like to your cart and check out with your delivery details. This does
                not charge any payment online — it sends your order request to our team.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg font-semibold text-forest-900">Confirmation</h2>
              <p className="mt-2">
                We'll call or WhatsApp you shortly after you place an order to confirm the items, quantity, delivery
                date, and final payment method (cash or UPI on delivery, unless otherwise agreed).
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg font-semibold text-forest-900">Delivery Areas & Timing</h2>
              <p className="mt-2">
                Delivery availability and timing depend on your location. Our team will confirm whether we deliver to
                your area and the expected delivery window when we get in touch after your order.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg font-semibold text-forest-900">Freshness on Delivery</h2>
              <p className="mt-2">
                Eggs are collected, graded, and packed close to your delivery date so they arrive as fresh as
                possible. If anything about your order looks off on arrival, please contact us right away.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg font-semibold text-forest-900">Questions?</h2>
              <p className="mt-2">
                Reach us at{" "}
                <a href={`tel:${settings.contact_phone?.replace(/\s+/g, "")}`} className="text-gold-600 hover:underline">
                  {settings.contact_phone}
                </a>{" "}
                or{" "}
                <a href={`mailto:${settings.contact_email}`} className="text-gold-600 hover:underline">
                  {settings.contact_email}
                </a>{" "}
                — we're happy to help.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
