import { useState } from "react";
import { MobileLayout } from "@/components/MobileLayout";
import { SectionCard } from "@/components/SectionCard";
import { schedule } from "@/data/mockData";

const Schedule = () => {
  const [view, setView] = useState<"current" | "alternate">("current");
  const items = view === "current" ? schedule.current : schedule.alternate;

  return (
    <MobileLayout title="Schedule" showBack>
      <SectionCard title={schedule.semester}>
        <div className="mb-3 grid grid-cols-2 gap-2">
          {(["current", "alternate"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setView(k)}
              className={`rounded-lg py-2 text-sm font-medium transition-colors ${
                view === k ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
              }`}
            >
              {k === "current" ? "Regular" : "Alternate"}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {items.map((p) => (
            <div key={p.period} className="flex items-center gap-3 rounded-lg bg-secondary p-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                {p.period}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{p.course}</p>
                <p className="text-xs text-muted-foreground">{p.time} • Room {p.room}</p>
                <p className="text-xs text-muted-foreground">{p.teacher}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </MobileLayout>
  );
};

export default Schedule;
