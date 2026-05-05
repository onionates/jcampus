import { MobileLayout } from "@/components/MobileLayout";
import { SectionCard, Row } from "@/components/SectionCard";
import { grades } from "@/data/mockData";

const letter = (n: number) =>
  n >= 93 ? "A" : n >= 85 ? "B" : n >= 75 ? "C" : n >= 67 ? "D" : "F";

const Grades = () => (
  <MobileLayout title="Grades" showBack>
    {grades.courses.map((c) => {
      const avg = Math.round(c.nineWeeks.reduce((a, b) => a + b, 0) / c.nineWeeks.length);
      return (
        <SectionCard
          key={c.name}
          title={c.name}
          subtitle={c.teacher}
          action={
            <span className="stat-pill bg-primary/10 text-primary">
              {avg} • {letter(avg)}
            </span>
          }
        >
          <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Nine Weeks</p>
          <div className="mb-3 grid grid-cols-4 gap-2 text-center">
            {c.nineWeeks.map((g, i) => (
              <div key={i} className="rounded-lg bg-secondary py-2">
                <p className="text-xs text-muted-foreground">Q{i + 1}</p>
                <p className="text-sm font-semibold">{g}</p>
              </div>
            ))}
          </div>
          <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">Tests</p>
          {c.tests.map((t, i) => (
            <Row key={i} label={t.name} value={`${t.score} (${letter(t.score)})`} />
          ))}
        </SectionCard>
      );
    })}
  </MobileLayout>
);

export default Grades;
