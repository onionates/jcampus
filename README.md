# District Connect — School District Mobile App

A minimalist mobile-first app for your school district. Pages: Student, Grades, Attendance, Discipline, Schedule, Transcript, LEAP Test Scores, Communications, Fees, Settings (with Navy / Dark / Cream / White themes).

All data lives in **`src/data/mockData.ts`** — edit any object there to add/remove fields and they will render automatically. The pages are intentionally generic so you can add more rows or sections in seconds.

---

## 1. Run it locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:8080`.

---

## 2. Turn it into a real native mobile app (iOS + Android)

This project is a Vite + React PWA. The recommended path to an installable native app is **Capacitor** (wraps the web app inside a real native shell).

```bash
# 1. Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android

# 2. Init (use your district's reverse-domain id)
npx cap init "District Connect" com.yourdistrict.connect

# 3. Build the web bundle
npm run build

# 4. Add platforms
npx cap add ios
npx cap add android

# 5. Sync the build into the native projects
npx cap sync

# 6. Open the native IDE
npx cap open ios       # requires macOS + Xcode
npx cap open android   # requires Android Studio
```

After every code change: `npm run build && npx cap sync`.

To publish: archive in Xcode → App Store Connect, or generate a signed AAB in Android Studio → Google Play Console.

---

## 3. Connecting to St. Tammany Parish (JPAMS / JCampus)

Your district uses **JPAMS** at `https://jpams.stpsb.org` and the parent/student progress portal at `https://jpams.stpsb.org/progress`. Under the hood this is **JCampus by Edgear** — a SmartGWT (Java + GWT) app on Apache Tomcat. There is no public REST API; the browser talks to the server with **GWT-RPC** (a custom POST format, `Content-Type: text/x-gwt-rpc`) on endpoints like `/progress/com.edgear.Main/...`. Auth is a cookie-based session (`JSESSIONID`).

That has two consequences:

1. You **cannot** call JPAMS directly from the mobile app — GWT-RPC payloads aren't stable, CORS is not enabled, and the cookie can't be safely shared with a native app.
2. You **must** put a server in the middle that logs in on behalf of the user, fetches the data, and returns clean JSON to the app.

### Step A — Get permission first
Email STPSB IT / the JPAMS administrator and ask:
- Is there an official Edgear/JCampus API or data export available for parents/students?
- Can you get **written approval** to build a read-only proxy that signs in on a user's behalf?

Don't skip this — scraping a student information system without authorization can violate FERPA and the district acceptable-use policy.

### Step B — Reverse-engineer the calls
1. Open `https://jpams.stpsb.org/progress` in Chrome → **F12** → **Network** → check "Preserve log".
2. Log in as a test student/parent.
3. Click each tab (Grades, Attendance, Discipline, Schedule, Transcript, LEAP, Fees) and watch `/progress/com.edgear.Main/...` requests. For each one, save:
   - The exact URL
   - The headers (`X-GWT-Permutation`, `Content-Type: text/x-gwt-rpc`, `Cookie: JSESSIONID=…`)
   - The full POST body (looks like `7|0|6|https://...|...`)
   - The response body
4. Right-click → Copy → **Copy as cURL** for each one — your proxy replays them.

### Step C — Build a proxy with Lovable Cloud
Ask Lovable: **"Enable Lovable Cloud and create an edge function called `jpams-proxy`."** The function should:
1. `POST` the user's username/password to the JPAMS login form, capture the `JSESSIONID` cookie.
2. Replay the GWT-RPC calls captured in Step B, attaching that cookie.
3. Parse the response and return clean JSON shaped like `src/data/mockData.ts`.

Skeleton:

```ts
// supabase/functions/jpams-proxy/index.ts
import { corsHeaders } from "@supabase/supabase-js/cors";

const BASE = "https://jpams.stpsb.org";

async function login(username: string, password: string) {
  const res = await fetch(`${BASE}/progress/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username, password }).toString(),
    redirect: "manual",
  });
  const setCookie = res.headers.get("set-cookie") ?? "";
  const jsession = setCookie.match(/JSESSIONID=[^;]+/)?.[0];
  if (!jsession) throw new Error("JPAMS login failed");
  return jsession;
}

async function callGwt(jsession: string, body: string) {
  const res = await fetch(`${BASE}/progress/com.edgear.Main/...`, {
    method: "POST",
    headers: {
      "Content-Type": "text/x-gwt-rpc; charset=utf-8",
      "X-GWT-Permutation": "PASTE_FROM_DEVTOOLS",
      Cookie: jsession,
    },
    body,
  });
  return await res.text(); // then parse the GWT-RPC response into JSON
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const { username, password, action } = await req.json();
  const jsession = await login(username, password);
  // route `action` (grades, attendance, schedule, …) to the right GWT call,
  // parse the response, normalize, and return JSON
  return new Response(JSON.stringify({ ok: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
```

### Step D — Wire the app to the proxy
Replace the imports in each page from `@/data/mockData` with a fetch hook:

```ts
// src/hooks/useGrades.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client"; // exists once Cloud is enabled

export const useGrades = () =>
  useQuery({
    queryKey: ["grades"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("jpams-proxy", {
        body: { action: "grades" },
      });
      if (error) throw error;
      return data;
    },
  });
```

Then in `Grades.tsx`:

```ts
const { data: grades, isLoading } = useGrades();
if (isLoading) return <p className="p-4 text-sm text-muted-foreground">Loading…</p>;
```

Keep the response shape identical to `mockData.ts` and every page keeps working.

### Step E — Storing the JPAMS password securely
- On the device: use `@capacitor-community/secure-storage` (iOS Keychain / Android EncryptedSharedPreferences). **Never** `localStorage`.
- On the server: don't persist it if you can avoid it — log in fresh each session. If you must cache it, encrypt with a per-user key derived from the user's app login.

### Realistic alternative
Reverse-engineering GWT-RPC is fragile (payloads can change with each JCampus release). The most robust path is to ask STPSB IT to:
- Enable the **Edgear/JCampus REST API** (Edgear ships one for districts that request it), or
- Provide a nightly CSV / SFTP export you can import into Lovable Cloud.

> ⚠️ Build only with written permission from the district. FERPA applies.


---

## 4. Adding a new field or page

- **New row on an existing page:** open `src/data/mockData.ts`, add a key, then add `<Row label="..." value={data.newKey} />` in the page.
- **New page:**
  1. Add a file in `src/pages/` (copy `Fees.tsx` as a template).
  2. Add a `<Route>` in `src/App.tsx` (wrap with `<RequireSetup>` if it requires login).
  3. Add an entry to `NAV_ITEMS` in `src/components/MobileLayout.tsx`.

---

## 5. App flow: Login → Onboarding → App

The app now boots through three gates managed by `SettingsContext`:

1. **`/login`** — `src/pages/Login.tsx`
   - Username + password (currently mocked, see comment for the real `supabase.functions.invoke("jpams-proxy", { body: { action: "login", … } })` call).
   - Toggle to enable **Face / Touch ID** (stored in `settings.biometricEnabled`).
   - Square logo placeholder at the top — replace the placeholder `<div>` with `<img src="/logo.png" />`.

2. **`/welcome`** — `src/pages/Welcome.tsx`
   - 5-step onboarding with a thin progress bar pinned to the bottom.
   - Steps: Tour → Theme → Grade → Notifications → Done.
   - The "Get started" button on the last step writes `onboardingComplete = true` and redirects to `/`.

3. **`/`** and every other page is wrapped with `<RequireSetup>` (`src/components/RequireSetup.tsx`):
   - Not logged in → `/login`
   - Logged in but onboarding not complete → `/welcome`
   - Otherwise renders the page.

To add a new gated page, wrap it the same way in `App.tsx`.

---

## 6. Theming: 4 presets + unlimited custom tonal themes

Themes live in two places:

- **Presets** (`navy`, `dark`, `cream`, `white`) — defined in `src/index.css` as `[data-theme="…"]` blocks of HSL CSS variables.
- **Custom tonal theme** — when `settings.theme === "custom"`, `SettingsContext` calls `buildTonalTheme()` from `src/lib/tonalTheme.ts`, which derives a full palette (background, surface, primary, border, etc.) from one base hex color plus a `light`/`dark` mode, and writes the values inline to `<html style="…">`.

To add another preset:

1. Add a new `[data-theme="my-theme"] { … }` block in `src/index.css` (copy any existing block and tweak HSL values).
2. Add it to the `themes` array in `src/pages/Settings.tsx` and `PRESETS` in `src/pages/Welcome.tsx`.
3. Add `"my-theme"` to the `ThemeName` union in `src/contexts/SettingsContext.tsx` and to `STATIC_THEMES` so it skips the tonal generator.

To tweak how the custom palette is generated, edit `buildTonalTheme()` — the function returns the complete CSS variable map, so any visual decision is one place.

---

## 7. Real loading states (per-page + per-route)

There are two loading layers:

- **Route-level:** every page is `lazy()`-imported in `App.tsx` and rendered inside `<Suspense fallback={<FullscreenLoader/>}>`. Switching tabs or pages shows the real spinner while the chunk + lazy data loads.
- **Page-level:** use the hooks in `src/hooks/useDistrictData.ts` (`useGrades`, `useAttendance`, `useStudent`, …). Today they return mock data after a short delay; swap each `queryFn` body for the `supabase.functions.invoke("jpams-proxy", …)` call shown in §3 and you get real loading states with `react-query` automatically (`isLoading`, `isFetching`, retries, caching).

Example for `Grades.tsx`:

```tsx
import { useGrades } from "@/hooks/useDistrictData";
import { InlineLoader } from "@/components/Loader";

const { data: grades, isLoading } = useGrades();
if (isLoading) return <InlineLoader label="Loading grades…" />;
```

This is the pattern other developers should reuse for any new page or data source — never write fake `setTimeout` UIs.

---

## 8. Grade-aware features

`settings.grade` (set during onboarding, editable in Settings) drives feature gating:

- **LEAP / state testing page** (`/test-scores`) is hidden for grades K–4 (shows a friendly "not available" screen with a link to Settings).
- For **grades 5–8**, the achievement-level reference table shows the cut-score range from LDOE's 2025 Interpretive Guide (`src/data/leapCutScores.ts`).
- For **grades 9–12**, the page swaps to high-school courses (Algebra I, English I, Geometry, English II, US History, Biology) and uses the high-school cut-score conversion table.

To gate any other page on grade:

```tsx
import { useSettings } from "@/contexts/SettingsContext";
const { settings } = useSettings();
if (Number(settings.grade) < 9) return <NotForGrade />;
```

Update the cut-score data once a year by editing `src/data/leapCutScores.ts` against the latest [LDOE Assessment publications](https://doe.louisiana.gov/families-and-students/assessment).

---

## 9. Full JPAMS edge-function example (deeper than §3)

Below is a more complete `jpams-proxy` skeleton you can drop into Lovable Cloud once you've captured the GWT-RPC payloads in DevTools (§3 Step B). It logs in once, caches the `JSESSIONID` per user request, and exposes one entry point per page.

```ts
// supabase/functions/jpams-proxy/index.ts
import { corsHeaders } from "@supabase/supabase-js/cors";

const BASE = "https://jpams.stpsb.org";

interface Action {
  path: string;          // e.g. "/progress/com.edgear.Main/grades"
  permutation: string;   // X-GWT-Permutation header value
  body: string;          // GWT-RPC body, including |placeholders| you replace
}

// Fill these in using `Copy as cURL` from Chrome DevTools.
const ACTIONS: Record<string, Action> = {
  grades:        { path: "/progress/com.edgear.Main/...", permutation: "XXXX", body: "7|0|6|..." },
  attendance:    { path: "/progress/com.edgear.Main/...", permutation: "XXXX", body: "7|0|6|..." },
  schedule:      { path: "/progress/com.edgear.Main/...", permutation: "XXXX", body: "7|0|6|..." },
  discipline:    { path: "/progress/com.edgear.Main/...", permutation: "XXXX", body: "7|0|6|..." },
  transcript:    { path: "/progress/com.edgear.Main/...", permutation: "XXXX", body: "7|0|6|..." },
  testscores:    { path: "/progress/com.edgear.Main/...", permutation: "XXXX", body: "7|0|6|..." },
  fees:          { path: "/progress/com.edgear.Main/...", permutation: "XXXX", body: "7|0|6|..." },
  communications:{ path: "/progress/com.edgear.Main/...", permutation: "XXXX", body: "7|0|6|..." },
  student:       { path: "/progress/com.edgear.Main/...", permutation: "XXXX", body: "7|0|6|..." },
};

async function login(username: string, password: string): Promise<string> {
  // 1. GET the login page first — JCampus often issues a JSESSIONID cookie + CSRF token.
  const initial = await fetch(`${BASE}/progress/`, { redirect: "manual" });
  const initialCookie = (initial.headers.get("set-cookie") ?? "").match(/JSESSIONID=[^;]+/)?.[0] ?? "";

  // 2. POST credentials to the form action observed in DevTools.
  const res = await fetch(`${BASE}/progress/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": initialCookie,
    },
    body: new URLSearchParams({ username, password }).toString(),
    redirect: "manual",
  });
  const finalCookie = (res.headers.get("set-cookie") ?? "").match(/JSESSIONID=[^;]+/)?.[0];
  if (!finalCookie) throw new Error("JPAMS login failed — check credentials and form fields");
  return finalCookie;
}

async function callGwt(jsession: string, a: Action): Promise<string> {
  const res = await fetch(`${BASE}${a.path}`, {
    method: "POST",
    headers: {
      "Content-Type": "text/x-gwt-rpc; charset=utf-8",
      "X-GWT-Permutation": a.permutation,
      "Cookie": jsession,
    },
    body: a.body,
  });
  const text = await res.text();
  if (!res.ok || text.startsWith("//EX")) {  // GWT-RPC error responses start with //EX
    throw new Error(`JPAMS ${a.path} failed: ${res.status} ${text.slice(0, 200)}`);
  }
  return text;
}

// Convert the raw GWT-RPC text response into the shape used by `src/data/mockData.ts`.
// You'll write one parser per action, based on the captured response.
const PARSERS: Record<string, (raw: string) => unknown> = {
  grades: (raw) => {
    // Example: GWT-RPC responses look like //OK[1,["English II", ...],0,7]
    // Strip the //OK header, JSON.parse, then walk the array.
    return { courses: [] };
  },
  // …implement parsers for the other actions.
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { username, password, action } = await req.json();
    if (!ACTIONS[action]) throw new Error(`Unknown action: ${action}`);

    const jsession = await login(username, password);
    const raw = await callGwt(jsession, ACTIONS[action]);
    const data = PARSERS[action]?.(raw) ?? raw;

    return new Response(JSON.stringify({ ok: true, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: (err as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
```

### Production hardening

- **Rate-limit per user** (KV / `upstash-redis`) — JPAMS has no public API and will block aggressive polling.
- **Cache responses for 30–120 s** server-side. Most pages don't need real-time data.
- **Re-use sessions** — store `JSESSIONID` in an encrypted cookie or per-user KV with a 5-minute TTL so you don't log in on every request.
- **Audit log** every fetch with `{ user, action, status, durationMs }`. Districts will ask for this.
- **Multi-district support** — make `BASE` configurable per workspace so the same edge function can serve other Louisiana districts running JCampus (Jefferson Parish, East Baton Rouge, Lafayette, etc. — they all use `*.jcampus.com` or a `/progress` subpath under their own domain).

### What to ask STPSB / Edgear for

The cleanest path is still to ask STPSB IT (and CC Edgear support) for:

1. **Edgear JCampus REST API access** — Edgear has shipped a REST surface for districts that request it; using it removes all the GWT-RPC fragility above.
2. **Read-only OAuth2 / SAML SSO** so end-users authenticate against the district's identity provider instead of your edge function holding their JPAMS password.
3. **A nightly CSV / SFTP export** of the data you actually need — you ingest it into Lovable Cloud (one Postgres row per student per night) and the app reads from there. This eliminates real-time scraping entirely.

> ⚠️ Build only with written permission from the district. JPAMS data is FERPA-protected.
