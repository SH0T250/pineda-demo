// Pineda OS data layer.
// Local driver: localStorage, seeded from data.js — full CRUD, works offline, powers demo mode.
// Supabase driver: activates for real accounts once VITE_SUPABASE_URL/KEY are set (see SUPABASE-SETUP.md).
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { jobs as seedJobs, quote as seedQuote, invoices as seedInvoices, parts as seedParts, assets as seedAssets } from './data.js'
import { supabase } from './supabase.js'

const DB_KEY = 'pineda-db-v3'
const AUTH_KEY = 'pineda-auth-v2'

export const LABOR_SELL = 145
export const LABOR_COST = 60
export const OVERHEAD_RATE = 0.18 // of customer price

const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2))

export const partSell = (cost, markupPct) => Math.round(cost * (1 + markupPct / 100) * 100) / 100

// lines: [{kind:'part', name, pn, cost, sell, qty} | {kind:'labor', hours}]
export function quoteTotals(lines) {
  let price = 0
  let cost = 0
  for (const l of lines) {
    if (l.kind === 'labor') {
      price += l.hours * LABOR_SELL
      cost += l.hours * LABOR_COST
    } else {
      price += l.sell * (l.qty || 1)
      cost += l.cost * (l.qty || 1)
    }
  }
  const gross = price - cost
  const overhead = price * OVERHEAD_RATE
  const net = gross - overhead
  const pct = (n) => (price > 0 ? ((n / price) * 100).toFixed(1) + '%' : '—')
  const r = (n) => Math.round(n * 100) / 100
  return { price: r(price), jobCost: r(cost), gross: r(gross), grossPct: pct(gross), overhead: r(overhead), net: r(net), netPct: pct(net) }
}

// Itemized invoice documents — lines sum + tax equals the listed amount exactly.
const INVOICE_DETAILS = {
  'Whitewater Rec': {
    num: '#1187', issued: 'May 18, 2025', due: 'Jun 2, 2025', addr: 'Whitewater Amphitheater · New Braunfels, TX',
    service: 'Commercial RTU maintenance', tax: 45,
    lines: [
      { desc: 'Quarterly RTU maintenance — 5-Ton rooftop unit', detail: 'Inspection, belt & electrical check, condensate treatment', qty: 1, rate: 1450 },
      { desc: '40A 2-pole contactor', detail: 'Replaced pitted contactor', qty: 1, rate: 45 },
      { desc: 'R-410A refrigerant', detail: 'Weighed-in charge', qty: 6, rate: 85 },
      { desc: 'Condenser coil cleaning', detail: 'Chemical clean & rinse', qty: 1, rate: 260 },
    ],
  },
  'Saenz, M.': {
    num: '#1191', issued: 'Jun 25, 2025', due: 'Jul 10, 2025', addr: '1234 Gruene Rd · New Braunfels, TX',
    service: 'Blower motor replacement', tax: 42,
    lines: [
      { desc: 'Labor — blower motor replacement', detail: 'Diagnose, remove failed motor, install & balance', qty: 1, rate: 1490 },
      { desc: '1/2 HP ECM blower motor + install kit', detail: 'MOT18605 · mounting hardware, capacitor', qty: 1, rate: 508 },
    ],
  },
  'Gruene Rentals': {
    num: '#1188', issued: 'Jun 25, 2025', due: 'Jul 10, 2025', addr: '1601 Hunter Rd · New Braunfels, TX',
    service: 'Diagnostic & refrigerant recharge', tax: 28,
    lines: [
      { desc: 'System diagnostic', detail: 'Full pressure & electrical workup', qty: 1, rate: 189 },
      { desc: 'R-410A refrigerant recharge', detail: 'Weighed-in', qty: 3, rate: 95 },
      { desc: 'Leak search & seal — labor', detail: 'Electronic detection, sealed service valve core', qty: 1, rate: 620 },
      { desc: 'Liquid-line filter drier', detail: 'Replaced & brazed', qty: 1, rate: 338 },
    ],
  },
  'Vela, J.': {
    num: '#1190', issued: 'Jun 25, 2025', due: 'Jul 10, 2025', addr: '210 Elm Creek · New Braunfels, TX',
    service: 'Seasonal system tune-up', tax: 15,
    lines: [
      { desc: 'Seasonal tune-up', detail: '21-point inspection, coil rinse, condensate flush', qty: 1, rate: 429 },
      { desc: 'MERV-11 filters 16x25', detail: 'Supplied & installed', qty: 2, rate: 48 },
      { desc: 'Run capacitor test & replace', detail: '45/5 MFD dual cap', qty: 1, rate: 270 },
    ],
  },
  'Hammond, R.': {
    num: '#1189', issued: 'Jun 25, 2025', due: 'Jul 10, 2025', addr: '88 Fair Oaks · New Braunfels, TX',
    service: 'Condenser fan motor replacement', tax: 22,
    lines: [
      { desc: 'Labor — condenser fan motor replacement', detail: 'Remove seized motor, install, verify amp draw', qty: 1, rate: 725 },
      { desc: '1/4 HP condenser fan motor', detail: 'FM1009 · with new blade balance', qty: 1, rate: 268 },
      { desc: 'Run capacitor', detail: 'Replaced with motor', qty: 1, rate: 75 },
    ],
  },
}

function seedDb() {
  return {
    jobs: seedJobs.map((j) => ({ id: uid(), ...j })),
    quotes: [
      {
        id: uid(), num: '#Q-1042', client: seedQuote.client, addr: seedQuote.addr, status: 'sent',
        lines: [
          { kind: 'part', name: '1/2 HP ECM Motor', pn: 'MOT18605', cost: 284, sell: 497, qty: 1 },
          { kind: 'part', name: '45/5 MFD Dual Cap', pn: 'TRCFD455', cost: 18.4, sell: 40.48, qty: 1 },
          { kind: 'labor', hours: 2.5 },
        ],
      },
    ],
    invoices: seedInvoices.items.map((i) => ({ id: uid(), ...i, ...INVOICE_DETAILS[i.client] })),
    parts: seedParts.map((p) => ({ id: uid(), ...p, markupPct: parseInt(p.markup) })),
    assets: seedAssets.items.map((a) => ({ id: uid(), ...a })),
  }
}

function loadDb() {
  try {
    const raw = localStorage.getItem(DB_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* corrupted or unavailable — reseed */ }
  return seedDb()
}

// ---- Supabase driver -------------------------------------------------------
// Columns the database actually has, per collection. Anything else on a record
// (derived values like a part's sell price) stays client-side only.
const COLS = {
  jobs: ['time', 'client', 'task', 'tech', 'addr', 'parts', 'rev', 'profit', 'done', 'aiBooked'],
  quotes: ['num', 'client', 'addr', 'status', 'lines'],
  invoices: ['client', 'amt', 'status', 'tone', 'num', 'addr', 'service', 'issued', 'due', 'reminded', 'tax', 'lines'],
  parts: ['item', 'vendor', 'pn', 'cost', 'markupPct'],
  assets: ['name', 'tag', 'value', 'status', 'tone'],
}
const snake = (s) => s.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase())
const camel = (s) => s.replace(/_([a-z])/g, (_, c) => c.toUpperCase())

const toRow = (col, obj) => {
  const row = {}
  for (const k of COLS[col]) if (obj[k] !== undefined) row[snake(k)] = obj[k]
  return row
}
const fromRow = (row) => {
  const obj = {}
  for (const [k, v] of Object.entries(row)) if (k !== 'created_at') obj[camel(k)] = v
  return obj
}

async function fetchAll() {
  const cols = Object.keys(COLS)
  const results = await Promise.all(cols.map((c) => supabase.from(c).select('*').order('created_at')))
  const out = {}
  results.forEach((r, i) => {
    if (r.error) throw new Error(`${cols[i]}: ${r.error.message}`)
    out[cols[i]] = r.data.map(fromRow)
  })
  return out
}

// First real sign-in on an empty database: push the starter catalog up so the
// app isn't blank. Only seeds tables that are actually empty.
async function seedRemoteIfEmpty(remote) {
  const local = seedDb()
  const empty = Object.keys(COLS).filter((c) => remote[c].length === 0)
  if (!empty.length) return remote
  for (const col of empty) {
    const rows = local[col].map((r) => toRow(col, r))
    const { data, error } = await supabase.from(col).insert(rows).select()
    if (error) throw new Error(`seed ${col}: ${error.message}`)
    remote[col] = data.map(fromRow)
  }
  return remote
}

const StoreCtx = createContext(null)
export const useStore = () => useContext(StoreCtx)

export function StoreProvider({ children }) {
  const [db, setDb] = useState(loadDb)
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(AUTH_KEY)) } catch { return null }
  })
  const [syncError, setSyncError] = useState(null)

  // Live only for real (non-demo) accounts; demo mode always stays on-device.
  const cloud = !!supabase && !!user && !user.demo

  useEffect(() => { try { localStorage.setItem(DB_KEY, JSON.stringify(db)) } catch { /* storage full/blocked */ } }, [db])
  useEffect(() => {
    try {
      if (user) localStorage.setItem(AUTH_KEY, JSON.stringify(user))
      else localStorage.removeItem(AUTH_KEY)
    } catch { /* ignore */ }
  }, [user])

  // Pull the account's data down on sign-in.
  useEffect(() => {
    if (!cloud) return
    let cancelled = false
    ;(async () => {
      try {
        const remote = await seedRemoteIfEmpty(await fetchAll())
        if (!cancelled) { setDb(remote); setSyncError(null) }
      } catch (e) {
        if (!cancelled) setSyncError(e.message)
      }
    })()
    return () => { cancelled = true }
  }, [cloud])

  const api = useMemo(() => ({
    // Writes are optimistic: local state updates immediately so the UI never
    // waits on the network, then the row is mirrored to Supabase.
    add: (col, item) => {
      const withId = { id: uid(), ...item }
      setDb((d) => ({ ...d, [col]: [...d[col], withId] }))
      if (cloud) {
        supabase.from(col).insert(toRow(col, item)).select().single()
          .then(({ data, error }) => {
            if (error) return setSyncError(error.message)
            // adopt the database's id so later edits target the right row
            setDb((d) => ({ ...d, [col]: d[col].map((x) => (x.id === withId.id ? { ...x, id: data.id } : x)) }))
          })
      }
      return withId
    },
    update: (col, id, patch) => {
      setDb((d) => ({ ...d, [col]: d[col].map((x) => (x.id === id ? { ...x, ...(typeof patch === 'function' ? patch(x) : patch) } : x)) }))
      if (cloud) {
        const next = typeof patch === 'function'
          ? patch(db[col].find((x) => x.id === id) || {})
          : patch
        supabase.from(col).update(toRow(col, next)).eq('id', id)
          .then(({ error }) => error && setSyncError(error.message))
      }
    },
    remove: (col, id) => {
      setDb((d) => ({ ...d, [col]: d[col].filter((x) => x.id !== id) }))
      if (cloud) supabase.from(col).delete().eq('id', id).then(({ error }) => error && setSyncError(error.message))
    },
    resetDemo: () => setDb(seedDb()),

    demoLogin: (role) => setUser({ role, demo: true, name: role === 'owner' ? 'Chaun P.' : 'Maria G.', email: role === 'owner' ? 'chaun@pinedahvac.com' : 'maria@example.com' }),
    signIn: async (email, password) => {
      if (!supabase) throw new Error('Live accounts aren’t connected yet — use demo mode, or connect Supabase (see setup guide).')
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      const role = data.user?.user_metadata?.role || 'client'
      setUser({ role, demo: false, name: data.user?.user_metadata?.name || email, email })
    },
    signUp: async (email, password, name) => {
      if (!supabase) throw new Error('Live accounts aren’t connected yet — use demo mode, or connect Supabase (see setup guide).')
      const { error } = await supabase.auth.signUp({ email, password, options: { data: { name, role: 'client' } } })
      if (error) throw error
    },
    signOut: () => {
      setUser(null)
      setSyncError(null)
      setDb(seedDb()) // don't leave a real account's data on the device
      if (supabase) supabase.auth.signOut()
    },
  }), [cloud, db])

  const value = useMemo(
    () => ({ db, user, live: !!supabase, cloud, syncError, ...api }),
    [db, user, cloud, syncError, api],
  )
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}
