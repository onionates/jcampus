import { MobileLayout } from "@/components/MobileLayout";
import { SectionCard, Row } from "@/components/SectionCard";
import { transcript } from "@/data/mockData";

const Transcript = () => {
  const pct = (transcript.totalCreditsEarned / transcript.totalCreditsRequired) * 100;
  return (
    <MobileLayout title="Transcript" showBack>
      <SectionCard title="Credit Progress">
        <Row label="GPA" value={transcript.gpa.toFixed(2)} />
        <Row label="Earned" value={`${transcript.totalCreditsEarned} / ${transcript.totalCreditsRequired}`} />
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
      </SectionCard>

      <SectionCard title="High School Courses">
        {transcript.courses.map((c, i) => (
          <div key={i} className="border-b border-border/60 py-2 last:border-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{c.course}</p>
              <span className="stat-pill bg-primary/10 text-primary">{c.grade}</span>
            </div>
            <p className="text-xs text-muted-foreground">{c.year} • {c.credit} credit</p>
          </div>
        ))}
      </SectionCard>
    </MobileLayout>
  );
};

export default Transcript;
