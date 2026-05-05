import { MobileLayout } from "@/components/MobileLayout";
import { SectionCard, Row } from "@/components/SectionCard";
import { student } from "@/data/mockData";

const Student = () => (
  <MobileLayout title="Student Info" showBack>
    <SectionCard title="Identity">
      <Row label="Full Name" value={`${student.firstName} ${student.lastName}`} />
      <Row label="Student ID" value={student.studentId} />
      <Row label="State ID" value={student.stateId} />
      <Row label="Grade Level" value={student.grade} />
      <Row label="Enrollment" value={student.enrollmentDate} />
    </SectionCard>

    <SectionCard title="School">
      <Row label="School" value={student.school} />
      <Row label="Homeroom" value={student.homeroom} />
      <Row label="Counselor" value={student.counselor} />
    </SectionCard>

    <SectionCard title="Transportation">
      <Row label="Bus Number" value={student.busNumber} />
      <Row label="Route" value={student.busRoute} />
    </SectionCard>

    <SectionCard title="Locker">
      <Row label="Locker #" value={student.lockerNumber} />
      <Row label="Combination" value={student.lockerCombo} />
    </SectionCard>
  </MobileLayout>
);

export default Student;
