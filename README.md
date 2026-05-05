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
  2. Add a `<Route>` in `src/App.tsx`.
  3. Add an entry to `NAV_ITEMS` in `src/components/MobileLayout.tsx`.

That's it.
