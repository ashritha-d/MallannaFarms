import { useState, type FormEvent } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import Seo from "@/components/seo/Seo";
import { Section } from "@/components/ui/Section";
import { useSettings } from "@/hooks/useSettings";
import { submitContactMessage } from "@/data/content";

type FormState = { name: string; phone: string; email: string; subject: string; message: string };
const EMPTY: FormState = { name: "", phone: "", email: "", subject: "", message: "" };

export default function Contact() {
  const { data: settings } = useSettings();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const validate = (): boolean => {
    const next: Partial<FormState> = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Please enter a valid email address.";
    if (!form.message.trim() || form.message.trim().length < 10) next.message = "Please enter a message (min. 10 characters).";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("submitting");
    const res = await submitContactMessage(form);
    if (res.ok) {
      setStatus("success");
      setForm(EMPTY);
    } else {
      setStatus("error");
      setErrorMsg(res.error ?? "Something went wrong.");
    }
  };

  return (
    <>
      <Seo
        title="Contact Us"
        description="Get in touch with Mallanna Farms — reach out for enquiries about our free-range eggs, farm visits, or partnerships."
        path="/contact"
      />
      <Section tone="cream" className="pt-28 sm:pt-32">
        <div className="mb-10 max-w-2xl">
          <span className="section-eyebrow">
            <span className="h-px w-8 bg-current opacity-60" />
            Contact Us
          </span>
          <h1 className="mt-3 text-3xl font-semibold text-forest-900 sm:text-4xl">We'd Love to Hear From You</h1>
        </div>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-14">
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl font-semibold text-forest-900">Get in Touch</h2>
            <ul className="mt-6 space-y-5">
              <li className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest-100 text-forest-700">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-forest-900">Farm Address</p>
                  <p className="text-sm text-forest-600">{settings.contact_address}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest-100 text-forest-700">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-forest-900">Phone</p>
                  <a href={`tel:${settings.contact_phone?.replace(/\s+/g, "")}`} className="text-sm text-forest-600 hover:text-gold-600">
                    {settings.contact_phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest-100 text-forest-700">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-forest-900">Email</p>
                  <a href={`mailto:${settings.contact_email}`} className="text-sm text-forest-600 hover:text-gold-600">
                    {settings.contact_email}
                  </a>
                </div>
              </li>
            </ul>

            {settings.contact_map_embed ? (
              <div className="mt-8 aspect-video overflow-hidden rounded-2xl shadow-card">
                <iframe
                  src={settings.contact_map_embed}
                  title="Mallanna Farms location"
                  loading="lazy"
                  className="h-full w-full border-0"
                />
              </div>
            ) : (
              <div className="mt-8 flex aspect-video items-center justify-center rounded-2xl border border-dashed border-forest-300 bg-forest-50 text-sm text-forest-500">
                Map will appear here once a Google Maps location is set in Admin → Settings.
              </div>
            )}
          </div>

          <div className="lg:col-span-3">
            <div className="card p-6 sm:p-8">
              <h2 className="font-display text-2xl font-semibold text-forest-900">Send Us a Message</h2>

              {status === "success" ? (
                <div className="mt-6 rounded-xl bg-forest-50 p-6 text-center">
                  <p className="font-display text-lg font-semibold text-forest-800">Thank you!</p>
                  <p className="mt-1 text-sm text-forest-600">Your message has been received. We'll get back to you soon.</p>
                  <button onClick={() => setStatus("idle")} className="btn-secondary mt-4">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="mt-6 space-y-5" noValidate>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field label="Name" id="name" required error={errors.name}>
                      <input
                        id="name"
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="input"
                        aria-invalid={!!errors.name}
                      />
                    </Field>
                    <Field label="Phone" id="phone">
                      <input
                        id="phone"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="input"
                      />
                    </Field>
                  </div>
                  <Field label="Email" id="email" required error={errors.email}>
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input"
                      aria-invalid={!!errors.email}
                    />
                  </Field>
                  <Field label="Subject" id="subject">
                    <input
                      id="subject"
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="input"
                    />
                  </Field>
                  <Field label="Message" id="message" required error={errors.message}>
                    <textarea
                      id="message"
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="input resize-none"
                      aria-invalid={!!errors.message}
                    />
                  </Field>

                  {status === "error" && (
                    <p className="rounded-lg bg-earth-50 px-4 py-3 text-sm text-earth-700">{errorMsg}</p>
                  )}

                  <button type="submit" disabled={status === "submitting"} className="btn-primary w-full sm:w-auto">
                    <Send className="h-4 w-4" />
                    {status === "submitting" ? "Sending…" : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

function Field({
  label,
  id,
  required,
  error,
  children,
}: {
  label: string;
  id: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-forest-800">
        {label} {required && <span className="text-earth-500">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-earth-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
