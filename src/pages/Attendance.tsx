import { MobileLayout } from "@/components/MobileLayout";
import { SectionCard, Row } from "@/components/SectionCard";
import { attendance } from "@/data/mockData";

const Attendance = () => (
  <MobileLayout title="Attendance" showBack>
    <SectionCard title="Summary">
      <Row label="Total School Days" value={attendance.totalDays} />
      <Row label="Days Present" value={attendance.present} />
      <Row label="Unexcused Absences" value={attendance.unexcused.length} />
      <Row label="Excused Absences" value={attendance.excused.length} />
      <Row label="Check-Outs" value={attendance.checkOuts.length} />
      <Row label="Tardies" value={attendance.tardies.length} />
    </SectionCard>

    <SectionCard title="Unexcused Absences">
      {attendance.unexcused.length === 0 ? (
        <p className="text-sm text-muted-foreground">None on record.</p>
      ) : (
        attendance.unexcused.map((a, i) => <Row key={i} label={a.date} value={a.reason} />)
      )}
    </SectionCard>

    <SectionCard title="Excused Absences">
      {attendance.excused.map((a, i) => <Row key={i} label={a.date} value={a.reason} />)}
    </SectionCard>

    <SectionCard title="Check-Outs">
      {attendance.checkOuts.map((c, i) => (
        <Row key={i} label={`${c.date} • ${c.time}`} value={c.reason} />
      ))}
    </SectionCard>

    <SectionCard title="Tardies">
      {attendance.tardies.map((t, i) => <Row key={i} label={t.date} value={t.time} />)}
    </SectionCard>
  </MobileLayout>
);

export default Attendance;
