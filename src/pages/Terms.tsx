import Seo from "@/components/seo/Seo";
import { Section } from "@/components/ui/Section";
import { useSettings } from "@/hooks/useSettings";

export default function Terms() {
  const { data: settings } = useSettings();
  return (
    <>
      <Seo title="Terms & Conditions" description="Terms and conditions for using the Mallanna Farms website and products." path="/terms-conditions" />
      <Section tone="cream" className="pt-28 sm:pt-32">
        <div className="mx-auto max-w-3xl">
          <span className="section-eyebrow">Legal</span>
          <h1 className="mt-2 font-display text-3xl font-semibold text-forest-900 sm:text-4xl">Terms & Conditions</h1>
          <p className="mt-2 text-sm text-forest-500">Last updated: August 13, 2026</p>

          <div className="mt-8 space-y-6 text-sm leading-relaxed text-forest-700 sm:text-base">
            <p>
              By accessing and using the Mallanna Farms website, you agree to the following terms and conditions.
              Please read them carefully.
            </p>

            <div>
              <h2 className="font-display text-lg font-semibold text-forest-900">Use of This Website</h2>
              <p className="mt-2">
                This website is provided to share information about Mallanna Farms, our free-range eggs, and to allow
                visitors to get in touch with us. Content on this website may not be copied, reproduced, or
                redistributed without permission.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg font-semibold text-forest-900">Product Information</h2>
              <p className="mt-2">
                We make every effort to ensure product information — including pricing, pack sizes and availability —
                is accurate and current. However, details may change without prior notice, and final availability and
                pricing will be confirmed at the time of order.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg font-semibold text-forest-900">Orders & Enquiries</h2>
              <p className="mt-2">
                Enquiries submitted through this website do not constitute a confirmed order. Orders are confirmed
                only after direct communication with Mallanna Farms.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg font-semibold text-forest-900">Limitation of Liability</h2>
              <p className="mt-2">
                Mallanna Farms is not liable for any indirect, incidental, or consequential damages arising from the
                use of this website.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg font-semibold text-forest-900">Changes to These Terms</h2>
              <p className="mt-2">
                We may update these terms from time to time. Continued use of this website after changes are posted
                constitutes acceptance of the revised terms.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg font-semibold text-forest-900">Contact Us</h2>
              <p className="mt-2">
                Questions about these terms can be directed to{" "}
                <a href={`mailto:${settings.contact_email}`} className="text-gold-600 hover:underline">
                  {settings.contact_email}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
