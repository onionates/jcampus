import { Loader2 } from "lucide-react";

export const FullscreenLoader = ({ label = "Loading…" }: { label?: string }) => (
  <div
    role="status"
    aria-live="polite"
    className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background animate-fade-in"
  >
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

export const InlineLoader = ({ label }: { label?: string }) => (
  <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground animate-fade-in">
    <Loader2 className="h-4 w-4 animate-spin text-primary" />
    {label && <span>{label}</span>}
  </div>
);
