import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Loader2, Fingerprint } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const { settings, update } = useSettings();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [biometric, setBiometric] = useState(settings.biometricEnabled);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Enter your username and password");
      return;
    }
    setLoading(true);
    try {
      // TODO: replace with real call to your jpams-proxy edge function (see README §3).
      // const { data, error } = await supabase.functions.invoke("jpams-proxy", {
      //   body: { action: "login", username, password },
      // });
      // if (error || !data?.ok) throw new Error(data?.error ?? "Login failed");
      await new Promise((r) => setTimeout(r, 700));
      update("biometricEnabled", biometric);
      update("loggedIn", true);
      navigate(settings.onboardingComplete ? "/" : "/welcome", { replace: true });
    } catch (err) {
      toast.error((err as Error).message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center bg-background px-6 py-10 animate-fade-in">
      {/* Logo placeholder — drop in your square logo here */}
      <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border border-dashed border-border bg-secondary text-xs text-muted-foreground">
        Logo
      </div>
      <h1 className="text-center text-2xl font-semibold tracking-tight">Sign in</h1>
      <p className="mb-8 mt-1 text-center text-sm text-muted-foreground">
        Use your district JPAMS credentials.
      </p>

      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Username</label>
          <Input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Password</label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
          <div className="flex items-center gap-2">
            <Fingerprint className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Enable Face / Touch ID</p>
              <p className="text-[11px] text-muted-foreground">Use biometrics next time</p>
            </div>
          </div>
          <Switch checked={biometric} onCheckedChange={setBiometric} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-[11px] text-muted-foreground">
        Forgot your password? Contact your school office.
      </p>
    </div>
  );
};

export default Login;
