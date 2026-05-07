/**
 * Real loading-state hook factory for JPAMS / JCampus data.
 *
 * Today these point at mock data and resolve after a short delay so the
 * Suspense / loading UIs are exercised. To switch to real data:
 *
 *   1. Enable Lovable Cloud (chat: "Enable Lovable Cloud").
 *   2. Create the `jpams-proxy` edge function (see README §3).
 *   3. Replace the body of each `queryFn` below with:
 *
 *        const { data, error } = await supabase.functions.invoke("jpams-proxy", {
 *          body: { action: "grades", studentId },
 *        });
 *        if (error) throw error;
 *        return data;
 *
 *   4. Every page using these hooks (`Grades`, `Attendance`, …) will then
 *      show the real loading spinner while data is in flight, with no
 *      further UI changes needed.
 */

import { useQuery } from "@tanstack/react-query";
import * as mock from "@/data/mockData";

const wait = <T,>(value: T, ms = 400): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export const useStudent = () =>
  useQuery({ queryKey: ["student"], queryFn: () => wait(mock.student) });

export const useGrades = () =>
  useQuery({ queryKey: ["grades"], queryFn: () => wait(mock.grades) });

export const useAttendance = () =>
  useQuery({ queryKey: ["attendance"], queryFn: () => wait(mock.attendance) });

export const useDiscipline = () =>
  useQuery({ queryKey: ["discipline"], queryFn: () => wait(mock.discipline) });

export const useSchedule = () =>
  useQuery({ queryKey: ["schedule"], queryFn: () => wait(mock.schedule) });

export const useTranscript = () =>
  useQuery({ queryKey: ["transcript"], queryFn: () => wait(mock.transcript) });

export const useLeapScores = () =>
  useQuery({ queryKey: ["leap"], queryFn: () => wait(mock.leapScores) });

export const useCommunications = () =>
  useQuery({ queryKey: ["communications"], queryFn: () => wait(mock.communications) });

export const useFees = () =>
  useQuery({ queryKey: ["fees"], queryFn: () => wait(mock.fees) });
