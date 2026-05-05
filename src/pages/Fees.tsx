import { MobileLayout } from "@/components/MobileLayout";
import { SectionCard } from "@/components/SectionCard";
import { fees } from "@/data/mockData";

const Fees = () => (
  <MobileLayout title="Fees" showBack>
    <SectionCard>
      <div className="text-center">
        <p className="text-xs uppercase text-muted-foreground">Balance Due</p>
        <p className="text-3xl font-bold text-foreground">${fees.balanceDue.toFixed(2)}</p>
      </div>
    </SectionCard>

    <SectionCard title="Itemized">
      {fees.items.map((f, i) => (
        <div key={i} className="flex items-center justify-between border-b border-border/60 py-2 last:border-0">
          <div>
            <p className="text-sm font-medium">{f.description}</p>
            <p className="text-xs text-muted-foreground">${f.amount.toFixed(2)}</p>
          </div>
          <span
            className={`stat-pill ${
              f.status === "Paid" ? "bg-success/15 text-success" : "bg-warning/20 text-warning"
            }`}
          >
            {f.status}
          </span>
        </div>
      ))}
    </SectionCard>
  </MobileLayout>
);

export default Fees;
