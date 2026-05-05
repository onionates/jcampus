import { MobileLayout } from "@/components/MobileLayout";
import { SectionCard } from "@/components/SectionCard";
import { communications } from "@/data/mockData";

const typeColor: Record<string, string> = {
  Principal: "bg-primary/15 text-primary",
  Attendance: "bg-warning/20 text-warning",
  Grade: "bg-success/15 text-success",
  Event: "bg-accent text-accent-foreground",
};

const Communications = () => (
  <MobileLayout title="Messages" showBack>
    {communications.map((m) => (
      <SectionCard key={m.id}>
        <div className="mb-1 flex items-center justify-between">
          <span className={`stat-pill ${typeColor[m.type] ?? "bg-secondary text-foreground"}`}>{m.type}</span>
          <span className="text-xs text-muted-foreground">{m.date}</span>
        </div>
        <p className="text-sm font-semibold">{m.title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{m.body}</p>
      </SectionCard>
    ))}
  </MobileLayout>
);

export default Communications;
