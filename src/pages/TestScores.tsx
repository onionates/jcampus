import { MobileLayout } from "@/components/MobileLayout";
import { SectionCard } from "@/components/SectionCard";
import { leapScores, LeapLevel } from "@/data/mockData";

const levelColor: Record<LeapLevel, string> = {
  Unsatisfactory: "bg-destructive/15 text-destructive",
  "Approaching Basic": "bg-warning/20 text-warning",
  Basic: "bg-primary/10 text-primary",
  Mastery: "bg-success/15 text-success",
  Advanced: "bg-success/25 text-success",
};

const TestScores = () => (
  <MobileLayout title="LEAP Scores" showBack>
    <p className="mb-3 text-xs text-muted-foreground">
      Louisiana Educational Assessment Program — annual state assessment results.
    </p>
    {leapScores.map((s) => (
      <SectionCard key={s.subject}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">{s.subject}</p>
            <p className="text-xs text-muted-foreground">{s.year}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">{s.score}</p>
            <span className={`stat-pill ${levelColor[s.level]}`}>{s.level}</span>
          </div>
        </div>
      </SectionCard>
    ))}

    <SectionCard title="Achievement Levels">
      {(["Advanced", "Mastery", "Basic", "Approaching Basic", "Unsatisfactory"] as LeapLevel[]).map((l) => (
        <div key={l} className="flex items-center justify-between border-b border-border/60 py-2 last:border-0">
          <span className="text-sm">{l}</span>
          <span className={`stat-pill ${levelColor[l]}`}>{l}</span>
        </div>
      ))}
    </SectionCard>
  </MobileLayout>
);

export default TestScores;
