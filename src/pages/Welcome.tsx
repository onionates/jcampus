import { useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap, AlertTriangle, Calendar, MessageSquare,
  DollarSign, ChevronRight, ChevronLeft, Check, Palette, Sun, Moon, Bell,
} from "lucide-react";
import { useSettings, ThemeName } from "@/contexts/SettingsContext";
import type { GradeKey } from "@/data/leapCutScores";
import { Switch } from "@/components/ui/switch";

const STEPS = ["Tour", "Theme", "Grade", "Notifications", "Done"] as const;

const Welcome = () => {
  const navigate = useNavigate();
  const { settings, update } = useSettings();
  const [step, setStep] = useState(0);

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));
  const finish = () => {
    update("onboardingComplete", true);
    navigate("/", { replace: true });
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
      <div className="flex-1 overflow-y-auto px-6 pb-28 pt-10">
        <div key={step} className="animate-fade-in">
          {step === 0 && <TourStep />}
          {step === 1 && <ThemeStep />}
          {step === 2 && <GradeStep value={settings.grade} onChange={(g) => update("grade", g)} />}
          {step === 3 && <NotificationsStep />}
          {step === 4 && <DoneStep />}
        </div>
      </div>

      <div className="sticky bottom-0 border-t border-border bg-card/95 px-6 py-4 backdrop-blur">
        <div className="mb-3 h-1 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={back}
            disabled={step === 0}
            className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
          <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Step {step + 1} of {STEPS.length}
          </span>
          {step < STEPS.length - 1 ? (
            <button
              onClick={next}
              disabled={step === 2 && !settings.grade}
              className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={finish}
              className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Get started <Check className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------------- Steps ---------------- */

const TourStep = () => (
  <>
    <h1 className="text-2xl font-semibold tracking-tight">Welcome 👋</h1>
    <p className="mt-1 text-sm text-muted-foreground">
      Here's where you'll spend most of your time.
    </p>
    <div className="mt-6 space-y-3">
      <Tile icon={<GraduationCap className="h-5 w-5" />} title="Grades" desc="Class averages, tests, and progress" />
      <Tile icon={<Calendar className="h-5 w-5" />} title="Schedule" desc="Classes, rooms, and teachers" />
      <Tile icon={<AlertTriangle className="h-5 w-5" />} title="Discipline" desc="Offenses and consequences" />
      <Tile icon={<MessageSquare className="h-5 w-5" />} title="Messages" desc="From the principal and admin" />
      <Tile icon={<DollarSign className="h-5 w-5" />} title="Fees" desc="Anything you may owe" />
    </div>
  </>
);

const Tile = ({ icon, title, desc }: { icon: ReactNode; title: string; desc: string }) => (
  <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
    <div className="rounded-lg bg-primary/10 p-2 text-primary">{icon}</div>
    <div>
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </div>
  </div>
);

const PRESETS: { id: ThemeName; label: string; swatch: string }[] = [
  { id: "navy",  label: "Navy",  swatch: "hsl(217 70% 22%)" },
  { id: "dark",  label: "Dark",  swatch: "hsl(222 25% 8%)" },
  { id: "cream", label: "Cream", swatch: "hsl(40 45% 90%)" },
  { id: "white", label: "White", swatch: "hsl(0 0% 100%)" },
];

const ThemeStep = () => {
  const { settings, update } = useSettings();
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Pick a theme</h1>
      <p className="mt-1 text-sm text-muted-foreground">Choose a preset or your own color.</p>

      <p className="mb-2 mt-6 text-xs font-semibold uppercase text-muted-foreground">Presets</p>
      <div className="grid grid-cols-2 gap-2">
        {PRESETS.map((t) => (
          <button
            key={t.id}
            onClick={() => update("theme", t.id)}
            className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
              settings.theme === t.id ? "border-primary ring-2 ring-primary/30" : "border-border"
            }`}
          >
            <span className="h-8 w-8 rounded-full border border-border" style={{ background: t.swatch }} />
            <span className="text-sm font-medium">{t.label}</span>
          </button>
        ))}
      </div>

      <p className="mb-2 mt-6 text-xs font-semibold uppercase text-muted-foreground">Custom color</p>
      <div className={`rounded-xl border p-3 ${settings.theme === "custom" ? "border-primary ring-2 ring-primary/30" : "border-border"}`}>
        <button
          onClick={() => update("theme", "custom")}
          className="flex w-full items-center gap-3"
        >
          <div className="relative">
            <input
              type="color"
              value={settings.customColor}
              onChange={(e) => { update("customColor", e.target.value); update("theme", "custom"); }}
              className="h-10 w-10 cursor-pointer rounded-full border border-border bg-transparent"
              aria-label="Pick custom color"
            />
            <Palette className="pointer-events-none absolute -right-1 -bottom-1 h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium">Custom tonal theme</p>
            <p className="text-xs text-muted-foreground">{settings.customColor.toUpperCase()}</p>
          </div>
        </button>

        {settings.theme === "custom" && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <ModeBtn icon={<Sun className="h-4 w-4" />} label="Light" active={settings.customMode === "light"}
              onClick={() => update("customMode", "light")} />
            <ModeBtn icon={<Moon className="h-4 w-4" />} label="Dark" active={settings.customMode === "dark"}
              onClick={() => update("customMode", "dark")} />
          </div>
        )}
      </div>
    </>
  );
};

const ModeBtn = ({ icon, label, active, onClick }: { icon: ReactNode; label: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition ${
      active ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
    }`}
  >
    {icon} {label}
  </button>
);

const GRADES: GradeKey[] = ["3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

const GradeStep = ({ value, onChange }: { value: GradeKey | ""; onChange: (g: GradeKey) => void }) => (
  <>
    <h1 className="text-2xl font-semibold tracking-tight">What grade are you in?</h1>
    <p className="mt-1 text-sm text-muted-foreground">
      We'll tailor what you see — like LEAP scoring and high school features.
    </p>
    <div className="mt-6 grid grid-cols-3 gap-2">
      {GRADES.map((g) => (
        <button
          key={g}
          onClick={() => onChange(g)}
          className={`rounded-xl border py-4 text-base font-semibold transition ${
            value === g ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"
          }`}
        >
          {g}
        </button>
      ))}
    </div>
    <p className="mt-3 text-[11px] text-muted-foreground">
      LEAP / state testing is shown for grades 5 and up.
    </p>
  </>
);

const NotificationsStep = () => {
  const { settings, update } = useSettings();
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
      <p className="mt-1 text-sm text-muted-foreground">Choose what you want to be alerted about.</p>
      <div className="mt-6 space-y-2 rounded-xl border border-border bg-card p-3">
        <ToggleRow icon={<Bell className="h-4 w-4" />} label="Push notifications"
          checked={settings.notifications} onChange={(v) => update("notifications", v)} />
        <ToggleRow label="Grade alerts" checked={settings.gradeAlerts} onChange={(v) => update("gradeAlerts", v)} />
        <ToggleRow label="Attendance alerts" checked={settings.attendanceAlerts} onChange={(v) => update("attendanceAlerts", v)} />
        <ToggleRow label="Discipline alerts" checked={settings.disciplineAlerts} onChange={(v) => update("disciplineAlerts", v)} />
      </div>
    </>
  );
};

const ToggleRow = ({ icon, label, checked, onChange }: { icon?: ReactNode; label: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <div className="flex items-center justify-between border-b border-border/60 py-2 last:border-0">
    <div className="flex items-center gap-2 text-sm">
      {icon}{label}
    </div>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
);

const DoneStep = () => (
  <div className="mt-10 text-center">
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary">
      <Check className="h-8 w-8" />
    </div>
    <h1 className="mt-4 text-2xl font-semibold tracking-tight">You're all set</h1>
    <p className="mt-1 text-sm text-muted-foreground">
      You can change any of this later in Settings.
    </p>
  </div>
);

export default Welcome;
