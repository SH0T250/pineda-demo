import { createClient } from '@supabase/supabase-js'

// Configured via .env (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).
// Until a Supabase project is connected, this exports null and the app
// runs entirely on the local (device) store — demo mode included.
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = url && key ? createClient(url, key) : null
