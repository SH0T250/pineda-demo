# Supabase — connected

**Status: done.** The database is live, the app is wired to it, and both are deployed.

| | |
|---|---|
| Project | `pineda-os` |
| URL | `https://ohqwliftdbmzmsvwdunp.supabase.co` |
| Key | publishable (`sb_publishable_…`) in `.env` — gitignored |
| Tables | jobs · quotes · invoices · parts · assets |
| Migrations | `schema.sql` + `migration-01.sql` — both run and verified |

Verified by request, not assumption: all five tables respond, every document column resolves, anonymous reads return nothing and anonymous writes are rejected with `401 — new row violates row-level security policy`.

## The one manual step left

Creating a login with a password is yours to do — I don't create accounts or set passwords on your behalf.

**Supabase → Authentication → Users → Add user**

- Email: `pinedahvac@yahoo.com`
- Password: pick one, send it to Chaun however you normally would
- **Tick "Auto Confirm User"** — without it he'd have to click a confirmation email before he can sign in

No metadata JSON needed. The app resolves his role from the email itself (`OWNER_EMAILS` in `src/store.jsx`), so that account lands in the Owner Command Center. `austinjjones210@gmail.com` is on that list too, so you can create yourself an account the same way for support access. Anyone else who signs up gets the client portal.

## What happens on his first sign-in

The tables are empty. On the first real sign-in the app pushes the starter catalog up — parts, assets, the sample jobs and quote documents — so he doesn't open a blank app. From then on everything he enters syncs across his phone and laptop, and the header reads "Synced · all devices."

Demo mode is unaffected either way. The one-tap Chaun/Maria buttons stay entirely on-device, so a bad connection at his shop can't break your pitch.

## If something breaks

Sync failures surface as a red banner in the app rather than failing silently, and writes still land on the device. Check **Supabase → Table Editor** to see rows arriving, and **Authentication → Users** to confirm the account is confirmed.
