# Connect Supabase (real accounts + synced data)

> **Status:** the live driver is built and deployed. It switches on by itself as soon as `.env` has real values — nothing else to code. Demo mode stays on-device either way.
>
> **Already ran the first schema?** Run `supabase/migration-01.sql` too — it adds the invoice-document columns (itemized lines, invoice numbers, dates, tax).
>
> **Which key:** the **publishable** key (`sb_publishable_…`), copied with its copy button so you get the whole string. Never the `sb_secret_…` one.

The app runs fully on device-local storage until this is done — demo mode works either way. Do this when you want real logins and data that syncs across Chaun's phone + laptop.

1. Create a free project at https://supabase.com (name: `pineda-os`, any region near Texas).
2. In the project: **SQL Editor → New query** → paste all of `supabase/schema.sql` → Run.
3. **Project Settings → API**: copy the `Project URL` and the `anon public` key.
4. In `C:\Users\Austin\pineda-demo`, create a file named `.env`:
   ```
   VITE_SUPABASE_URL=https://YOURPROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
   ```
   (The anon key is designed to be public — it ships in the app bundle. Data is protected by Row Level Security requiring sign-in.)
5. Rebuild + redeploy (`npm run build`, push `dist` to gh-pages).
6. Tell Claude "Supabase is connected" — the data layer's live driver gets wired and tested then (sign-up, role assignment for Chaun, data sync).

Authentication: Supabase Auth email/password. New sign-ups default to the client role; Chaun's account gets `role: owner` set in user metadata.
