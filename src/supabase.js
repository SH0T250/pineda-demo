import { createClient } from '@supabase/supabase-js'

// Configured via .env (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).
// Until a Supabase project is connected, this exports null and the app
// runs entirely on the local (device) store — demo mode included.
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// A half-filled .env (URL set, key still the placeholder) must not produce a
// client — it would fail every sign-in instead of falling back to local mode.
const ready = !!url && !!key && !key.startsWith('PASTE_')

export const supabase = ready ? createClient(url, key) : null
