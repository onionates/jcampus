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

## 3. Connecting to the District's real grade API

You said the district's site runs on **Apache Tomcat 7**. That tells you it's a Java web app — almost always one of: PowerSchool, JCampus (Edgear, common in Louisiana), Skyward, or Infinite Campus. The web pages you see are the front end; the actual data is fetched from REST or SOAP endpoints.

### Step A — Find the real API

1. Open the existing district website in Chrome → **F12** → **Network** tab.
2. Log in normally. Filter by `XHR` / `Fetch`.
3. Look for requests like `/StudentClasses.action`, `/api/grades`, `/rest/...` returning JSON or XML. Those are your endpoints.
4. Note the request URL, method, headers (especially `Cookie` / `Authorization`), and the request body.

### Step B — Add a thin proxy (CRITICAL — never call Tomcat directly from the app)

You should **never** ship the district's credentials inside the mobile app, and Tomcat almost certainly won't have CORS enabled. Put a small backend in front of it.

The easiest path inside this project is **Lovable Cloud** (one click, includes serverless edge functions and secret storage). Ask Lovable to "enable Lovable Cloud" and then "create an edge function called `grades-proxy`" that:

- Accepts the student's auth token from the app.
- Forwards the request to `https://grades.yourdistrict.org/...` (your Tomcat host).
- Returns the JSON to the app.
- Stores the district admin/service credentials as secrets, **not** in source.

Skeleton for the edge function:

```ts
// supabase/functions/grades-proxy/index.ts
import { corsHeaders } from "@supabase/supabase-js/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const { studentId, sessionCookie } = await req.json();
  const res = await fetch(`https://grades.yourdistrict.org/api/student/${studentId}/grades`, {
    headers: { Cookie: sessionCookie ?? "" },
  });
  const data = await res.json();
  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
```

### Step C — Wire the app to the proxy

Replace the imports in each page from `@/data/mockData` with a fetch hook. Example for grades:

```ts
// src/hooks/useGrades.ts
import { useQuery } from "@tanstack/react-query";

export const useGrades = (studentId: string) =>
  useQuery({
    queryKey: ["grades", studentId],
    queryFn: async () => {
      const res = await fetch("/api/grades-proxy", {
        method: "POST",
        body: JSON.stringify({ studentId }),
      });
      if (!res.ok) throw new Error("Failed to load grades");
      return res.json();
    },
  });
```

Then in `Grades.tsx`:

```ts
const { data: grades, isLoading } = useGrades(settings.studentId);
if (isLoading) return <p>Loading…</p>;
```

Keep the **shape** of `mockData.ts` the same as the API response (or transform inside the proxy) and the UI keeps working.

### Step D — Auth

Tomcat apps usually authenticate with username/password → session cookie (`JSESSIONID`). Two options:

1. **Best:** ask the district IT for a real REST API or OAuth2 endpoint. Most modern SIS vendors expose one.
2. **Bridge:** in the proxy, log into the Tomcat app on behalf of the user (`POST /j_security_check` with username/password), capture `JSESSIONID`, then reuse it for subsequent calls. Store the password in the device's secure keychain (Capacitor Preferences with encryption, or `@capacitor-community/secure-storage`), **never** in plain `localStorage`.

> ⚠️ Do this only with written permission from your district's IT department. Scraping or proxying without authorization can violate FERPA and the district's acceptable-use policy.

---

## 4. Adding a new field or page

- **New row on an existing page:** open `src/data/mockData.ts`, add a key, then add `<Row label="..." value={data.newKey} />` in the page.
- **New page:**
  1. Add a file in `src/pages/` (copy `Fees.tsx` as a template).
  2. Add a `<Route>` in `src/App.tsx`.
  3. Add an entry to `NAV_ITEMS` in `src/components/MobileLayout.tsx`.

That's it.
