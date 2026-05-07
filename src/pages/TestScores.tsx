import { MobileLayout } from "@/components/MobileLayout";
import { SectionCard } from "@/components/SectionCard";
import { useSettings } from "@/contexts/SettingsContext";
import { leapScores, type LeapLevel } from "@/data/mockData";
import {
  rangesFor, levelForScore, leapAvailable, isHighSchool,
  subjectsForGrade, type SubjectKey,
} from "@/data/leapCutScores";
import { Lock } from "lucide-react";
import { Link } from "react-router-dom";

const levelColor: Record<LeapLevel, string> = {
  Unsatisfactory: "bg-destructive/15 text-destructive",
  "Approaching Basic": "bg-warning/20 text-warning",
  Basic: "bg-primary/10 text-primary",
  Mastery: "bg-success/15 text-success",
  Advanced: "bg-success/25 text-success",
};

const LEVELS: LeapLevel[] = ["Advanced", "Mastery", "Basic", "Approaching Basic", "Unsatisfactory"];

const TestScores = () => {
  const { settings } = useSettings();
  const grade = settings.grade;

  if (!grade || !leapAvailable(grade)) {
    return (
      <MobileLayout title="LEAP Scores" showBack>
        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-muted-foreground">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="text-base font-semibold">Not available for your grade</h2>
          <p className="max-w-xs text-sm text-muted-foreground">
            LEAP / state testing is shown for grades 5 and up. {grade ? "" : "Set your grade in Settings to continue."}
          </p>
          <Link to="/settings" className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            Open Settings
          </Link>
        </div>
      </MobileLayout>
    );
  }

  const gradeSubjects = subjectsForGrade(grade);
  // Match mock score subjects up to the subjects valid for this grade.
  const visibleScores = leapScores.filter((s) => gradeSubjects.includes(s.subject as SubjectKey));
  // Pick a representative subject for the achievement-level reference table.
  const refSubject: SubjectKey = visibleScores[0]?.subject as SubjectKey ?? gradeSubjects[0];
  const refRanges = rangesFor(grade, refSubject);

  return (
    <MobileLayout title={isHighSchool(grade) ? "LEAP (High School)" : "LEAP Scores"} showBack>
      <p className="mb-3 text-xs text-muted-foreground">
        Louisiana Educational Assessment Program — {isHighSchool(grade) ? `grade ${grade} (high school courses)` : `grade ${grade}`}.
      </p>

      {visibleScores.map((s) => {
        const lvl = levelForScore(grade, s.subject as SubjectKey, s.score) ?? s.level;
        return (
          <SectionCard key={s.subject}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{s.subject}</p>
                <p className="text-xs text-muted-foreground">{s.year}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">{s.score}</p>
                <span className={`stat-pill ${levelColor[lvl]}`}>{lvl}</span>
              </div>
            </div>
          </SectionCard>
        );
      })}

      {refRanges && (
        <SectionCard
          title="Achievement Levels"
          subtitle={`Score ranges for ${refSubject} — grade ${grade}`}
        >
          {LEVELS.map((l) => (
            <div key={l} className="flex items-center justify-between border-b border-border/60 py-2 last:border-0">
              <span className="text-sm font-mono tabular-nums">
                {refRanges[l].min}–{refRanges[l].max}
              </span>
              <span className={`stat-pill ${levelColor[l]}`}>{l}</span>
            </div>
          ))}
          <p className="mt-2 text-[11px] text-muted-foreground">
            {isHighSchool(grade)
              ? "Source: LDOE LEAP 2025 High School Grade Conversion Tables."
              : "Source: LDOE LEAP 2025 Grades 3–8 Interpretive Guide, Table 5."}
          </p>
        </SectionCard>
      )}
    </MobileLayout>
  );
};

export default TestScores;
