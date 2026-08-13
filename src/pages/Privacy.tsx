import Seo from "@/components/seo/Seo";
import { Section } from "@/components/ui/Section";
import { useSettings } from "@/hooks/useSettings";

export default function Privacy() {
  const { data: settings } = useSettings();
  return (
    <>
      <Seo title="Privacy Policy" description="Mallanna Farms privacy policy — how we collect, use and protect your information." path="/privacy-policy" />
      <Section tone="cream" className="pt-28 sm:pt-32">
        <div className="mx-auto max-w-3xl">
          <span className="section-eyebrow">Legal</span>
          <h1 className="mt-2 font-display text-3xl font-semibold text-forest-900 sm:text-4xl">Privacy Policy</h1>
          <p className="mt-2 text-sm text-forest-500">Last updated: August 13, 2026</p>

          <div className="prose-farm mt-8 space-y-6 text-sm leading-relaxed text-forest-700 sm:text-base">
            <p>
              Mallanna Farms ("we", "us", "our") respects your privacy. This Privacy Policy explains what information
              we collect through this website, how we use it, and the choices you have.
            </p>

            <div>
              <h2 className="font-display text-lg font-semibold text-forest-900">Information We Collect</h2>
              <p className="mt-2">
                When you use our Contact form, we collect the information you provide — your name, phone number,
                email address, subject and message. We do not knowingly collect sensitive personal information
                through this website.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg font-semibold text-forest-900">How We Use Information</h2>
              <p className="mt-2">
                We use the information you submit solely to respond to your enquiry, provide information about our
                products, and improve our services. We do not sell or rent your personal information to third
                parties.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg font-semibold text-forest-900">Data Storage & Security</h2>
              <p className="mt-2">
                Enquiries submitted through this website are stored securely in our database and are only accessible
                to authorised Mallanna Farms administrators.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg font-semibold text-forest-900">Cookies</h2>
              <p className="mt-2">
                This website may use minimal, essential cookies or local storage to keep the site functioning
                properly. We do not use invasive third-party tracking.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg font-semibold text-forest-900">Your Rights</h2>
              <p className="mt-2">
                You may request access to, correction of, or deletion of any personal information you've shared with
                us by contacting us using the details below.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg font-semibold text-forest-900">Contact Us</h2>
              <p className="mt-2">
                For any privacy-related questions, please contact us at{" "}
                <a href={`mailto:${settings.contact_email}`} className="text-gold-600 hover:underline">
                  {settings.contact_email}
                </a>{" "}
                or {settings.contact_phone}.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
