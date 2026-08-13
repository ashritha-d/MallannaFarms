import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { ROUTES } from "@/routes";
import { FALLBACK_PRODUCT_IMAGE } from "@/data/seed";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const goCheckout = () => {
    closeCart();
    navigate(ROUTES.checkout);
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[110] bg-forest-950/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeCart}
        aria-hidden={!isOpen}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed inset-y-0 right-0 z-[120] flex w-full max-w-md flex-col bg-cream-50 shadow-lift transition-transform duration-300 safe-top safe-bottom ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-forest-900/10 px-5 py-4">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-forest-900">
            <ShoppingBag className="h-5 w-5" />
            Your Cart {items.length > 0 && <span className="text-sm font-normal text-forest-500">({items.length})</span>}
          </h2>
          <button onClick={closeCart} aria-label="Close cart" className="rounded-full p-1.5 text-forest-600 hover:bg-forest-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="h-12 w-12 text-forest-300" />
            <p className="font-display text-lg text-forest-800">Your cart is empty</p>
            <p className="text-sm text-forest-500">Add some farm-fresh eggs to get started.</p>
            <button
              onClick={() => {
                closeCart();
                navigate(ROUTES.products);
              }}
              className="btn-primary mt-2"
            >
              Shop Our Eggs
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.productId} className="flex gap-3">
                    <img
                      src={item.image || FALLBACK_PRODUCT_IMAGE}
                      alt={item.name}
                      className="h-20 w-20 shrink-0 rounded-xl object-cover"
                    />
                    <div className="flex flex-1 flex-col">
                      <p className="text-sm font-semibold text-forest-900">{item.name}</p>
                      {item.packSize && <p className="text-xs text-forest-500">{item.packSize}</p>}
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2 rounded-full border border-forest-900/15 px-1">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            aria-label="Decrease quantity"
                            className="rounded-full p-1.5 text-forest-700 hover:bg-forest-100"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-5 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            aria-label="Increase quantity"
                            className="rounded-full p-1.5 text-forest-700 hover:bg-forest-100"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="font-display text-sm font-semibold text-forest-900">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      aria-label={`Remove ${item.name}`}
                      className="h-fit rounded-lg p-1.5 text-forest-400 hover:bg-earth-50 hover:text-earth-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-forest-900/10 px-5 py-4">
              <div className="flex items-center justify-between text-sm text-forest-600">
                <span>Subtotal</span>
                <span className="font-display text-lg font-semibold text-forest-900">₹{subtotal}</span>
              </div>
              <p className="mt-1 text-xs text-forest-400">Delivery details collected at checkout.</p>
              <button onClick={goCheckout} className="btn-primary mt-4 w-full">
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
