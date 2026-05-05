import { MobileLayout } from "@/components/MobileLayout";
import { SectionCard } from "@/components/SectionCard";
import { discipline } from "@/data/mockData";

const Discipline = () => (
  <MobileLayout title="Discipline" showBack>
    <SectionCard title="Major Offenses" subtitle="Saturday detention, suspension, etc.">
      {discipline.majorOffenses.length === 0 ? (
        <p className="text-sm text-muted-foreground">No major offenses on record.</p>
      ) : (
        discipline.majorOffenses.map((o, i) => (
          <div key={i} className="mb-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 last:mb-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">{o.offense}</p>
              <span className="stat-pill bg-destructive/15 text-destructive">{o.status}</span>
            </div>
            <p className="text-xs text-muted-foreground">{o.date}</p>
            <p className="mt-1 text-sm">{o.consequence}</p>
          </div>
        ))
      )}
    </SectionCard>

    <SectionCard title="Minor Offenses">
      {discipline.minorOffenses.map((o, i) => (
        <div key={i} className="mb-2 rounded-lg bg-secondary p-3 last:mb-0">
          <p className="text-sm font-medium">{o.offense}</p>
          <p className="text-xs text-muted-foreground">{o.date} • {o.consequence}</p>
        </div>
      ))}
    </SectionCard>

    <SectionCard>
      <p className="text-xs text-muted-foreground">{discipline.notes}</p>
    </SectionCard>
  </MobileLayout>
);

export default Discipline;
