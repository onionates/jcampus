import { Link } from "react-router-dom";
import { MobileLayout, NAV_ITEMS } from "@/components/MobileLayout";
import { SectionCard } from "@/components/SectionCard";
import { student, attendance, fees, communications } from "@/data/mockData";

const Index = () => {
  const tiles = NAV_ITEMS.filter((n) => !["/", "/settings"].includes(n.to));
  const unread = communications.length;

  return (
    <MobileLayout title="Lincoln Parish Schools">
      <SectionCard>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
            {student.firstName[0]}{student.lastName[0]}
          </div>
          <div>
            <p className="text-base font-semibold">{student.firstName} {student.lastName}</p>
            <p className="text-xs text-muted-foreground">{student.grade} • {student.school}</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Quick stats">
        <div className="grid grid-cols-3 gap-2 text-center">
          <Stat label="Attendance" value={`${Math.round((attendance.present / attendance.totalDays) * 100)}%`} />
          <Stat label="Messages" value={unread} />
          <Stat label="Balance" value={`$${fees.balanceDue.toFixed(2)}`} />
        </div>
      </SectionCard>

      <div className="grid grid-cols-2 gap-3">
        {tiles.map((t) => {
          const Icon = t.icon;
          return (
            <Link
              key={t.to}
              to={t.to}
              className="flex flex-col items-start gap-2 rounded-xl border border-border bg-card p-4 shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-accent"
            >
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium">{t.label}</span>
            </Link>
          );
        })}
      </div>
    </MobileLayout>
  );
};

const Stat = ({ label, value }: { label: string; value: string | number }) => (
  <div className="rounded-lg bg-secondary p-2">
    <p className="text-base font-bold text-foreground">{value}</p>
    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
  </div>
);

export default Index;
