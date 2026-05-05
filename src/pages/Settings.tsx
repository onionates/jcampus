import { MobileLayout } from "@/components/MobileLayout";
import { SectionCard, Row } from "@/components/SectionCard";
import { useSettings, ThemeName } from "@/contexts/SettingsContext";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const themes: { id: ThemeName; label: string; swatch: string }[] = [
  { id: "navy", label: "Navy Blue", swatch: "hsl(217 70% 22%)" },
  { id: "dark", label: "Dark", swatch: "hsl(222 25% 8%)" },
  { id: "cream", label: "Cream", swatch: "hsl(40 45% 90%)" },
  { id: "white", label: "White", swatch: "hsl(0 0% 100%)" },
];

const Settings = () => {
  const { settings, update, reset } = useSettings();

  return (
    <MobileLayout title="Settings" showBack>
      <SectionCard title="Appearance" subtitle="Choose your theme">
        <div className="grid grid-cols-2 gap-2">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => update("theme", t.id)}
              className={`flex items-center gap-3 rounded-lg border p-3 text-left transition ${
                settings.theme === t.id ? "border-primary ring-2 ring-primary/30" : "border-border"
              }`}
            >
              <span
                className="h-8 w-8 rounded-full border border-border"
                style={{ background: t.swatch }}
              />
              <span className="text-sm font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Text Size">
        <div className="grid grid-cols-3 gap-2">
          {(["sm", "md", "lg"] as const).map((s) => (
            <button
              key={s}
              onClick={() => update("fontSize", s)}
              className={`rounded-lg py-2 text-sm font-medium ${
                settings.fontSize === s ? "bg-primary text-primary-foreground" : "bg-secondary"
              }`}
            >
              {s === "sm" ? "Small" : s === "md" ? "Medium" : "Large"}
            </button>
          ))}
        </div>
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
              className={`rounded-lg py-2 text-sm font-medium ${
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
        <Row label="District" value="Lincoln Parish" />
      </SectionCard>

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
