import { ReactNode } from "react";

export const SectionCard = ({
  title,
  subtitle,
  children,
  action,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
}) => (
  <section className="mb-4 rounded-xl border border-border bg-card p-4 shadow-sm">
    {(title || action) && (
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          {title && <h2 className="text-sm font-semibold text-foreground">{title}</h2>}
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {action}
      </div>
    )}
    {children}
  </section>
);

export const Row = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="flex items-center justify-between border-b border-border/60 py-2 text-sm last:border-0">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium text-foreground">{value}</span>
  </div>
);
