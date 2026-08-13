import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Seo from "@/components/seo/Seo";
import PageHero from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { useCart } from "@/contexts/CartContext";
import { useSettings } from "@/hooks/useSettings";
import { submitOrder } from "@/data/content";
import { ROUTES } from "@/routes";
import { FARM_IMAGES, FALLBACK_PRODUCT_IMAGE } from "@/data/seed";

type FormState = { name: string; phone: string; email: string; address: string; city: string; pincode: string; notes: string };
const EMPTY: FormState = { name: "", phone: "", email: "", address: "", city: "", pincode: "", notes: "" };

export default function Checkout() {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const { data: settings } = useSettings();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const validate = (): boolean => {
    const next: Partial<FormState> = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!/^[\d+\s-]{7,15}$/.test(form.phone.trim())) next.phone = "Please enter a valid phone number.";
    if (!form.address.trim()) next.address = "Please enter your delivery address.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || !validate()) return;
    setStatus("submitting");
    const res = await submitOrder({
      customerName: form.name,
      phone: form.phone,
      email: form.email,
      address: form.address,
      city: form.city,
      pincode: form.pincode,
      notes: form.notes,
      items: items.map((i) => ({
        product_id: i.productId,
        name: i.name,
        pack_size: i.packSize,
        image: i.image,
        price: i.price,
        quantity: i.quantity,
      })),
      subtotal,
    });
    if (res.ok) {
      setStatus("success");
      setOrderNumber(res.orderNumber);
      clearCart();
    } else {
      setStatus("error");
      setErrorMsg(res.error ?? "Something went wrong.");
    }
  };

  if (status === "success") {
    return (
      <>
        <Seo title="Order Received" description="Your Mallanna Farms order has been received." path="/checkout" />
        <Section tone="cream" className="pt-32">
          <div className="mx-auto max-w-lg text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-forest-100 text-forest-700">
              <CheckCircle2 className="h-8 w-8" />
            </span>
            <h1 className="mt-5 font-display text-2xl font-semibold text-forest-900 sm:text-3xl">Thank you for your order!</h1>
            {orderNumber && <p className="mt-2 text-sm text-forest-500">Order reference: {orderNumber}</p>}
            <p className="mt-4 text-forest-600">
              We've received your order request. Our team will call or WhatsApp you shortly to confirm details and
              delivery — no payment has been charged online.
            </p>
            <Link to={ROUTES.products} className="btn-primary mt-8 inline-flex">
              Continue Shopping
            </Link>
          </div>
        </Section>
      </>
    );
  }

  return (
    <>
      <Seo title="Checkout" description="Complete your Mallanna Farms order." path="/checkout" />
      <PageHero eyebrow="Checkout" title="Complete Your Order" image={FARM_IMAGES.eggCartonBowl} />

      <Section tone="cream">
        {items.length === 0 ? (
          <div className="mx-auto max-w-md py-4 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-forest-300" />
            <p className="mt-4 font-display text-lg text-forest-800">Your cart is empty</p>
            <p className="mt-1 text-sm text-forest-500">Add some farm-fresh eggs before checking out.</p>
            <Link to={ROUTES.products} className="btn-primary mt-6 inline-flex">
              Shop Our Eggs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-14">
            <div className="lg:col-span-3">
              <div className="card p-6 sm:p-8">
                <h2 className="font-display text-xl font-semibold text-forest-900">Delivery Details</h2>
                <form onSubmit={onSubmit} className="mt-6 space-y-5" noValidate>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field label="Full Name" required error={errors.name}>
                      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
                    </Field>
                    <Field label="Phone Number" required error={errors.phone}>
                      <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" type="tel" />
                    </Field>
                  </div>
                  <Field label="Email (optional)">
                    <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" type="email" />
                  </Field>
                  <Field label="Delivery Address" required error={errors.address}>
                    <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={3} className="input resize-none" />
                  </Field>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field label="City / Village">
                      <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input" />
                    </Field>
                    <Field label="Pincode">
                      <input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} className="input" />
                    </Field>
                  </div>
                  <Field label="Order Notes (optional)">
                    <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="input resize-none" />
                  </Field>

                  {status === "error" && <p className="rounded-lg bg-earth-50 px-4 py-3 text-sm text-earth-700">{errorMsg}</p>}

                  <button type="submit" disabled={status === "submitting"} className="btn-primary w-full">
                    {status === "submitting" ? "Placing Order…" : `Place Order — ₹${subtotal}`}
                  </button>
                  <p className="text-center text-xs text-forest-500">
                    No online payment is collected. We'll confirm your order and delivery by phone/WhatsApp.
                  </p>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="card p-6 sm:p-8">
                <h2 className="font-display text-lg font-semibold text-forest-900">Order Summary</h2>
                <ul className="mt-5 space-y-4">
                  {items.map((item) => (
                    <li key={item.productId} className="flex gap-3">
                      <img src={item.image || FALLBACK_PRODUCT_IMAGE} alt={item.name} className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-forest-900">{item.name}</p>
                        {item.packSize && <p className="text-xs text-forest-500">{item.packSize}</p>}
                        <div className="mt-1.5 flex items-center justify-between">
                          <div className="flex items-center gap-1 rounded-full border border-forest-900/15 px-1">
                            <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} aria-label="Decrease quantity" className="rounded-full p-1 text-forest-700 hover:bg-forest-100">
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-5 text-center text-xs font-medium">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} aria-label="Increase quantity" className="rounded-full p-1 text-forest-700 hover:bg-forest-100">
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="text-sm font-semibold text-forest-900">₹{item.price * item.quantity}</span>
                        </div>
                      </div>
                      <button onClick={() => removeItem(item.productId)} aria-label={`Remove ${item.name}`} className="h-fit rounded-lg p-1.5 text-forest-400 hover:bg-earth-50 hover:text-earth-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 border-t border-forest-900/10 pt-4">
                  <div className="flex items-center justify-between text-base">
                    <span className="font-semibold text-forest-800">Subtotal</span>
                    <span className="font-display text-xl font-semibold text-forest-900">₹{subtotal}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-dashed border-forest-300 bg-forest-50 p-5 text-sm text-forest-600">
                <p className="font-semibold text-forest-800">Need help ordering?</p>
                <p className="mt-1">
                  Call us at{" "}
                  <a href={`tel:${settings.contact_phone?.replace(/\s+/g, "")}`} className="text-gold-600 hover:underline">
                    {settings.contact_phone}
                  </a>{" "}
                  or email{" "}
                  <a href={`mailto:${settings.contact_email}`} className="text-gold-600 hover:underline">
                    {settings.contact_email}
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        )}
      </Section>
    </>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-forest-800">
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
