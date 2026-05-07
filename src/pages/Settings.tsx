import { MobileLayout } from "@/components/MobileLayout";
import { SectionCard, Row } from "@/components/SectionCard";
import { useSettings, ThemeName } from "@/contexts/SettingsContext";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Sun, Moon, Palette, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { GradeKey } from "@/data/leapCutScores";

const themes: { id: ThemeName; label: string; swatch: string }[] = [
  { id: "navy", label: "Navy Blue", swatch: "hsl(217 70% 22%)" },
  { id: "dark", label: "Dark", swatch: "hsl(222 25% 8%)" },
  { id: "cream", label: "Cream", swatch: "hsl(40 45% 90%)" },
  { id: "white", label: "White", swatch: "hsl(0 0% 100%)" },
];

const GRADES: GradeKey[] = ["3","4","5","6","7","8","9","10","11","12"];

const Settings = () => {
  const { settings, update, reset, logout } = useSettings();
  const navigate = useNavigate();

  return (
    <MobileLayout title="Settings" showBack>
      <SectionCard title="Appearance" subtitle="Choose a preset or your own color">
        <div className="grid grid-cols-2 gap-2">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => update("theme", t.id)}
              className={`flex items-center gap-3 rounded-lg border p-3 text-left transition ${
                settings.theme === t.id ? "border-primary ring-2 ring-primary/30" : "border-border"
              }`}
            >
              <span className="h-8 w-8 rounded-full border border-border" style={{ background: t.swatch }} />
              <span className="text-sm font-medium">{t.label}</span>
            </button>
          ))}
        </div>

        <div className={`mt-3 rounded-lg border p-3 ${settings.theme === "custom" ? "border-primary ring-2 ring-primary/30" : "border-border"}`}>
          <button onClick={() => update("theme", "custom")} className="flex w-full items-center gap-3">
            <input
              type="color"
              value={settings.customColor}
              onChange={(e) => { update("customColor", e.target.value); update("theme", "custom"); }}
              className="h-9 w-9 cursor-pointer rounded-full border border-border bg-transparent"
              aria-label="Pick custom color"
            />
            <div className="flex-1 text-left">
              <p className="text-sm font-medium flex items-center gap-1">
                <Palette className="h-3.5 w-3.5" /> Custom color
              </p>
              <p className="text-xs text-muted-foreground">{settings.customColor.toUpperCase()}</p>
            </div>
          </button>
          {settings.theme === "custom" && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => update("customMode", "light")}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition ${
                  settings.customMode === "light" ? "bg-primary text-primary-foreground" : "bg-secondary"
                }`}
              ><Sun className="h-4 w-4" /> Light</button>
              <button
                onClick={() => update("customMode", "dark")}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition ${
                  settings.customMode === "dark" ? "bg-primary text-primary-foreground" : "bg-secondary"
                }`}
              ><Moon className="h-4 w-4" /> Dark</button>
            </div>
          )}
        </div>
      </SectionCard>

      <SectionCard title="Text Size">
        <div className="grid grid-cols-3 gap-2">
          {(["sm", "md", "lg"] as const).map((s) => (
            <button
              key={s}
              onClick={() => update("fontSize", s)}
              className={`rounded-lg py-2 text-sm font-medium transition ${
                settings.fontSize === s ? "bg-primary text-primary-foreground" : "bg-secondary"
              }`}
            >
              {s === "sm" ? "Small" : s === "md" ? "Medium" : "Large"}
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Grade level" subtitle="Affects LEAP scoring and feature availability">
        <div className="grid grid-cols-5 gap-1.5">
          {GRADES.map((g) => (
            <button
              key={g}
              onClick={() => update("grade", g)}
              className={`rounded-lg py-2 text-sm font-semibold transition ${
                settings.grade === g ? "bg-primary text-primary-foreground" : "bg-secondary"
              }`}
            >{g}</button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Security">
        <ToggleRow label="Face / Touch ID" checked={settings.biometricEnabled}
          onChange={(v) => update("biometricEnabled", v)} />
      </SectionCard>

      <SectionCard title="Notifications">
        <ToggleRow label="Push notifications" checked={settings.notifications}
          onChange={(v) => update("notifications", v)} />
        <ToggleRow label="Grade alerts" checked={settings.gradeAlerts}
          onChange={(v) => update("gradeAlerts", v)} />
        <ToggleRow label="Attendance alerts" checked={settings.attendanceAlerts}
          onChange={(v) => update("attendanceAlerts", v)} />
        <ToggleRow label="Discipline alerts" checked={settings.disciplineAlerts}
          onChange={(v) => update("disciplineAlerts", v)} />
      </SectionCard>

      <SectionCard title="Language">
        <div className="grid grid-cols-3 gap-2">
          {(["en", "es", "fr"] as const).map((l) => (
            <button
              key={l}
              onClick={() => update("language", l)}
              className={`rounded-lg py-2 text-sm font-medium transition ${
                settings.language === l ? "bg-primary text-primary-foreground" : "bg-secondary"
              }`}
            >
              {l === "en" ? "English" : l === "es" ? "Español" : "Français"}
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Account">
        <Row label="Student ID" value={settings.studentId || "Not set"} />
        <button
          onClick={() => {
            const id = prompt("Enter your Student ID:");
            if (id) update("studentId", id);
          }}
          className="mt-2 w-full rounded-lg bg-secondary py-2 text-sm font-medium"
        >
          Update Student ID
        </button>
      </SectionCard>

      <SectionCard title="About">
        <Row label="App Version" value="1.0.0" />
        <Row label="District" value="St. Tammany Parish" />
      </SectionCard>

      <button
        onClick={() => { logout(); navigate("/login", { replace: true }); }}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-secondary py-3 text-sm font-medium"
      >
        <LogOut className="h-4 w-4" /> Sign out
      </button>

      <button
        onClick={() => { reset(); toast.success("Settings reset to defaults"); }}
        className="mt-2 w-full rounded-lg border border-destructive/40 bg-destructive/10 py-3 text-sm font-medium text-destructive"
      >
        Reset all settings
      </button>
    </MobileLayout>
  );
};

const ToggleRow = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <div className="flex items-center justify-between border-b border-border/60 py-2 last:border-0">
    <span className="text-sm">{label}</span>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
);

export default Settings;
