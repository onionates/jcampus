// LEAP 2025 Achievement Level scale-score ranges.
// Sources:
//   Grades 3–8: https://doe.louisiana.gov/docs/default-source/assessment/leap-2025-grades-3-8-interpretive-guide.pdf  (Table 5)
//   High school (Algebra I, English I, Geometry, English II, US History, Biology):
//     https://doe.louisiana.gov/docs/default-source/assessment/high-school-leap-2025-grade-conversion-table.pdf
// All ranges are inclusive scale-score bounds (650–850).

import type { LeapLevel } from "./mockData";

export type GradeKey =
  | "3" | "4" | "5" | "6" | "7" | "8"
  | "9" | "10" | "11" | "12";

export type SubjectKey =
  | "ELA" | "Mathematics" | "Science" | "Social Studies"
  | "Algebra I" | "English I" | "Geometry" | "English II" | "US History" | "Biology";

export interface Range { min: number; max: number }
export type LevelRanges = Record<LeapLevel, Range>;

const r = (min: number, max: number): Range => ({ min, max });

// Grades 3–8 – Basic / Approaching Basic / Unsatisfactory are constant in ELA/Math/Science;
// Social Studies has unique cuts per grade.
const ms_constant: Pick<LevelRanges, "Basic" | "Approaching Basic" | "Unsatisfactory"> = {
  Basic: r(725, 749),
  "Approaching Basic": r(700, 724),
  Unsatisfactory: r(650, 699),
};

const G38: Record<GradeKey, Partial<Record<SubjectKey, LevelRanges>>> = {
  "3": {
    ELA:           { Advanced: r(810, 850), Mastery: r(750, 809), ...ms_constant },
    Mathematics:   { Advanced: r(790, 850), Mastery: r(750, 789), ...ms_constant },
    Science:       { Advanced: r(773, 850), Mastery: r(750, 772),
                     Basic: r(725, 749), "Approaching Basic": r(698, 724), Unsatisfactory: r(650, 697) },
    "Social Studies": { Advanced: r(774, 850), Mastery: r(750, 773),
                     Basic: r(729, 749), "Approaching Basic": r(707, 728), Unsatisfactory: r(650, 706) },
  },
  "4": {
    ELA:           { Advanced: r(790, 850), Mastery: r(750, 789), ...ms_constant },
    Mathematics:   { Advanced: r(796, 850), Mastery: r(750, 795), ...ms_constant },
    Science:       { Advanced: r(778, 850), Mastery: r(750, 777),
                     Basic: r(725, 749), "Approaching Basic": r(704, 724), Unsatisfactory: r(650, 703) },
    "Social Studies": { Advanced: r(779, 850), Mastery: r(750, 778),
                     Basic: r(728, 749), "Approaching Basic": r(710, 727), Unsatisfactory: r(650, 709) },
  },
  "5": {
    ELA:           { Advanced: r(799, 850), Mastery: r(750, 798), ...ms_constant },
    Mathematics:   { Advanced: r(790, 850), Mastery: r(750, 789), ...ms_constant },
    Science:       { Advanced: r(781, 850), Mastery: r(750, 780),
                     Basic: r(725, 749), "Approaching Basic": r(698, 724), Unsatisfactory: r(650, 697) },
    "Social Studies": { Advanced: r(779, 850), Mastery: r(750, 778),
                     Basic: r(731, 749), "Approaching Basic": r(706, 730), Unsatisfactory: r(650, 705) },
  },
  "6": {
    ELA:           { Advanced: r(790, 850), Mastery: r(750, 789), ...ms_constant },
    Mathematics:   { Advanced: r(788, 850), Mastery: r(750, 787), ...ms_constant },
    Science:       { Advanced: r(782, 850), Mastery: r(750, 781),
                     Basic: r(725, 749), "Approaching Basic": r(701, 724), Unsatisfactory: r(650, 700) },
    "Social Studies": { Advanced: r(773, 850), Mastery: r(750, 772),
                     Basic: r(728, 749), "Approaching Basic": r(702, 727), Unsatisfactory: r(650, 701) },
  },
  "7": {
    ELA:           { Advanced: r(785, 850), Mastery: r(750, 784), ...ms_constant },
    Mathematics:   { Advanced: r(786, 850), Mastery: r(750, 785), ...ms_constant },
    Science:       { Advanced: r(790, 850), Mastery: r(750, 789),
                     Basic: r(725, 749), "Approaching Basic": r(702, 724), Unsatisfactory: r(650, 701) },
    "Social Studies": { Advanced: r(783, 850), Mastery: r(750, 782),
                     Basic: r(730, 749), "Approaching Basic": r(705, 729), Unsatisfactory: r(650, 704) },
  },
  "8": {
    ELA:           { Advanced: r(794, 850), Mastery: r(750, 793), ...ms_constant },
    Mathematics:   { Advanced: r(801, 850), Mastery: r(750, 800), ...ms_constant },
    Science:       { Advanced: r(782, 850), Mastery: r(750, 781),
                     Basic: r(725, 749), "Approaching Basic": r(694, 724), Unsatisfactory: r(650, 693) },
    "Social Studies": { Advanced: r(780, 850), Mastery: r(750, 779),
                     Basic: r(730, 749), "Approaching Basic": r(709, 729), Unsatisfactory: r(650, 708) },
  },
  "9": {}, "10": {}, "11": {}, "12": {},
};

// High School LEAP – same Basic/AB/Unsat across all six courses; Mastery & Advanced vary.
const hsConstant = {
  Basic: r(725, 749),
  "Approaching Basic": r(700, 724),
  Unsatisfactory: r(650, 699),
};
const HS: Partial<Record<SubjectKey, LevelRanges>> = {
  "Algebra I":  { Advanced: r(805, 850), Mastery: r(750, 804), ...hsConstant },
  "English I":  { Advanced: r(791, 850), Mastery: r(750, 790), ...hsConstant },
  Geometry:     { Advanced: r(783, 850), Mastery: r(750, 782), ...hsConstant },
  "English II": { Advanced: r(794, 850), Mastery: r(750, 793), ...hsConstant },
  "US History": { Advanced: r(774, 850), Mastery: r(750, 773), ...hsConstant },
  Biology:      { Advanced: r(778, 850), Mastery: r(750, 777), ...hsConstant },
};

export const isHighSchool = (g: GradeKey) => Number(g) >= 9;
export const leapAvailable = (g: GradeKey) => Number(g) >= 5;

export const subjectsForGrade = (g: GradeKey): SubjectKey[] =>
  isHighSchool(g)
    ? ["Algebra I", "English I", "Geometry", "English II", "US History", "Biology"]
    : ["ELA", "Mathematics", "Science", "Social Studies"];

export const rangesFor = (g: GradeKey, subject: SubjectKey): LevelRanges | null => {
  if (isHighSchool(g)) return HS[subject] ?? null;
  return G38[g]?.[subject] ?? null;
};

export const levelForScore = (g: GradeKey, subject: SubjectKey, score: number): LeapLevel | null => {
  const ranges = rangesFor(g, subject);
  if (!ranges) return null;
  for (const lvl of ["Advanced", "Mastery", "Basic", "Approaching Basic", "Unsatisfactory"] as LeapLevel[]) {
    const range = ranges[lvl];
    if (score >= range.min && score <= range.max) return lvl;
  }
  return null;
};
