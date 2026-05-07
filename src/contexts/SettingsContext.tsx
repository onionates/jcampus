import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { buildTonalTheme, hexToHsl, Mode } from "@/lib/tonalTheme";
import type { GradeKey } from "@/data/leapCutScores";

export type ThemeName = "navy" | "dark" | "cream" | "white" | "custom";

export interface Settings {
  theme: ThemeName;
  customColor: string;     // hex, e.g. "#4f46e5"
  customMode: Mode;
  notifications: boolean;
  gradeAlerts: boolean;
  attendanceAlerts: boolean;
  disciplineAlerts: boolean;
  fontSize: "sm" | "md" | "lg";
  language: "en" | "es" | "fr";
  studentId: string;
  grade: GradeKey | "";
  biometricEnabled: boolean;
  // Onboarding gates
  loggedIn: boolean;
  onboardingComplete: boolean;
}

const DEFAULTS: Settings = {
  theme: "navy",
  customColor: "#4f46e5",
  customMode: "dark",
  notifications: true,
  gradeAlerts: true,
  attendanceAlerts: true,
  disciplineAlerts: true,
  fontSize: "md",
  language: "en",
  studentId: "",
  grade: "",
  biometricEnabled: false,
  loggedIn: false,
  onboardingComplete: false,
};

interface Ctx {
  settings: Settings;
  update: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  reset: () => void;
  logout: () => void;
}

const SettingsContext = createContext<Ctx | undefined>(undefined);
const STORAGE_KEY = "district-app-settings";

const STATIC_THEMES: ThemeName[] = ["navy", "dark", "cream", "white"];

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
    } catch {
      return DEFAULTS;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (STATIC_THEMES.includes(settings.theme)) {
      root.setAttribute("data-theme", settings.theme);
      // Clear any inline custom vars from previous custom session
      root.removeAttribute("style");
      root.style.fontSize =
        settings.fontSize === "sm" ? "14px" : settings.fontSize === "lg" ? "18px" : "16px";
    } else {
      // custom tonal theme
      root.setAttribute("data-theme", "custom");
      const vars = buildTonalTheme(hexToHsl(settings.customColor), settings.customMode);
      Object.entries(vars).forEach(([k, val]) => root.style.setProperty(k, val));
      root.style.fontSize =
        settings.fontSize === "sm" ? "14px" : settings.fontSize === "lg" ? "18px" : "16px";
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const update: Ctx["update"] = (key, value) =>
    setSettings((s) => ({ ...s, [key]: value }));
  const reset = () => setSettings(DEFAULTS);
  const logout = () =>
    setSettings((s) => ({ ...s, loggedIn: false }));

  return (
    <SettingsContext.Provider value={{ settings, update, reset, logout }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
};
