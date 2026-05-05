import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type ThemeName = "navy" | "dark" | "cream" | "white";

export interface Settings {
  theme: ThemeName;
  notifications: boolean;
  gradeAlerts: boolean;
  attendanceAlerts: boolean;
  disciplineAlerts: boolean;
  fontSize: "sm" | "md" | "lg";
  language: "en" | "es" | "fr";
  studentId: string;
}

const DEFAULTS: Settings = {
  theme: "navy",
  notifications: true,
  gradeAlerts: true,
  attendanceAlerts: true,
  disciplineAlerts: true,
  fontSize: "md",
  language: "en",
  studentId: "",
};

interface Ctx {
  settings: Settings;
  update: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  reset: () => void;
}

const SettingsContext = createContext<Ctx | undefined>(undefined);
const STORAGE_KEY = "district-app-settings";

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
    document.documentElement.setAttribute("data-theme", settings.theme);
    document.documentElement.style.fontSize =
      settings.fontSize === "sm" ? "14px" : settings.fontSize === "lg" ? "18px" : "16px";
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const update: Ctx["update"] = (key, value) =>
    setSettings((s) => ({ ...s, [key]: value }));
  const reset = () => setSettings(DEFAULTS);

  return (
    <SettingsContext.Provider value={{ settings, update, reset }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
};
