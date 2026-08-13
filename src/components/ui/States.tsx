import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Inbox, RefreshCcw } from "lucide-react";

export function EmptyState({
  icon: Icon = Inbox,
  title,
  message,
}: {
  icon?: LucideIcon;
  title: string;
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-forest-300/60 bg-forest-50/60 px-6 py-14 text-center">
      <Icon className="h-10 w-10 text-forest-400" aria-hidden="true" />
      <p className="font-display text-lg text-forest-800">{title}</p>
      {message && <p className="max-w-sm text-sm text-forest-600">{message}</p>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-earth-300 bg-earth-50 px-6 py-14 text-center">
      <AlertTriangle className="h-10 w-10 text-earth-500" aria-hidden="true" />
      <p className="font-display text-lg text-forest-800">Something went wrong</p>
      <p className="max-w-sm text-sm text-forest-600">
        {message ?? "We couldn't load this content right now. Please try again."}
      </p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary mt-2">
          <RefreshCcw className="h-4 w-4" aria-hidden="true" />
          Retry
        </button>
      )}
    </div>
  );
}

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card overflow-hidden">
          <div className="skeleton aspect-[4/3] w-full rounded-none" />
          <div className="space-y-3 p-5">
            <div className="skeleton h-4 w-2/3" />
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
