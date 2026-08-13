import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
  danger = true,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}) {
  if (!open) return null;
  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      className="fixed inset-0 z-[150] flex items-center justify-center bg-forest-950/60 p-4 animate-fadeIn"
      onClick={onCancel}
    >
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lift" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3">
          <span className={`flex h-11 w-11 items-center justify-center rounded-full ${danger ? "bg-earth-100 text-earth-600" : "bg-forest-100 text-forest-700"}`}>
            <AlertTriangle className="h-5 w-5" />
          </span>
          <h2 id="confirm-title" className="font-display text-lg font-semibold text-forest-900">
            {title}
          </h2>
        </div>
        <p className="mt-3 text-sm text-forest-600">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`btn ${danger ? "bg-earth-600 text-cream-50 hover:bg-earth-700" : "btn-primary"}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
