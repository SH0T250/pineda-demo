import { useState } from 'react'
import {
  LayoutDashboard, CalendarDays, Inbox as InboxIcon, Wallet, Grid3x3,
  MapPin, Wrench, Package, FileText, HandCoins, ClipboardCheck, ShieldCheck,
  HeartPulse, Star, Home, Camera, MessageCircle, LogOut, Lock, ChevronRight,
} from 'lucide-react'
import { company } from './data.js'
import { useStore } from './store.jsx'
import { Card, Button, Input, Field } from './ui.jsx'

import Dashboard from './screens/Dashboard.jsx'
import Schedule from './screens/Schedule.jsx'
import Crew from './screens/Crew.jsx'
import Tools from './screens/Tools.jsx'
import Inbox from './screens/Inbox.jsx'
import Vendors from './screens/Vendors.jsx'
import QuoteBuilder from './screens/QuoteBuilder.jsx'
import Financing from './screens/Financing.jsx'
import JobComplete from './screens/JobComplete.jsx'
import Warranties from './screens/Warranties.jsx'
import Invoices from './screens/Invoices.jsx'
import Health from './screens/Health.jsx'
import Reputation from './screens/Reputation.jsx'
import Portal from './screens/Portal.jsx'
import SnapKnow from './screens/SnapKnow.jsx'
import Assistant from './screens/Assistant.jsx'

const ownerScreens = {
  dashboard: Dashboard, schedule: Schedule, crew: Crew, tools: Tools, inbox: Inbox,
  vendors: Vendors, quote: QuoteBuilder, financing: Financing, jobcomplete: JobComplete,
  warranties: Warranties, invoices: Invoices, health: Health, reputation: Reputation,
}
const clientScreens = { portal: Portal, snap: SnapKnow, assistant: Assistant }

const ownerNav = [
  { section: 'Operations', items: [
    { key: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { key: 'schedule', name: 'Schedule', icon: CalendarDays },
    { key: 'inbox', name: 'AI Inbox', icon: InboxIcon },
    { key: 'crew', name: 'Live Crew', icon: MapPin },
    { key: 'tools', name: 'Tool Registry', icon: Wrench },
  ]},
  { section: 'Money', items: [
    { key: 'quote', name: 'Quotes', icon: FileText },
    { key: 'invoices', name: 'Invoices & Taxes', icon: Wallet },
    { key: 'financing', name: 'Financing', icon: HandCoins },
    { key: 'vendors', name: 'Vendors & Parts', icon: Package },
    { key: 'health', name: 'Business Health', icon: HeartPulse },
  ]},
  { section: 'Reputation & Proof', items: [
    { key: 'jobcomplete', name: 'Proof of Work', icon: ClipboardCheck },
    { key: 'warranties', name: 'Warranties', icon: ShieldCheck },
    { key: 'reputation', name: 'Reputation', icon: Star },
  ]},
]
const clientNav = [
  { section: 'Your Home', items: [
    { key: 'portal', name: 'Home', icon: Home },
    { key: 'snap', name: 'Snap & Know', icon: Camera },
    { key: 'assistant', name: 'Assistant', icon: MessageCircle },
  ]},
]

const ownerTabs = [
  { key: 'dashboard', name: 'Home', icon: LayoutDashboard },
  { key: 'schedule', name: 'Schedule', icon: CalendarDays },
  { key: 'inbox', name: 'Inbox', icon: InboxIcon },
  { key: 'invoices', name: 'Money', icon: Wallet },
  { key: 'more', name: 'More', icon: Grid3x3 },
]
const clientTabs = clientNav[0].items

const moreItems = ownerNav.flatMap((s) => s.items).filter((i) => !ownerTabs.some((t) => t.key === i.key))

const logo = import.meta.env.BASE_URL + 'logo.png'

function More({ go }) {
  return (
    <div className="rise-in">
      <h1 className="mb-4 font-cond text-3xl font-bold">Command Center</h1>
      <div className="stagger grid grid-cols-3 gap-3">
        {moreItems.map((m) => (
          <Card key={m.key} onClick={() => go(m.key)} className="flex flex-col items-center gap-2 !p-3 text-center">
            <m.icon className="h-6 w-6 text-amber" strokeWidth={1.75} />
            <div className="text-[11px] font-semibold leading-tight">{m.name}</div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function Login() {
  const { demoLogin, signIn, live } = useStore()
  const [mode, setMode] = useState('demo') // demo | signin
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setErr(null); setBusy(true)
    try { await signIn(email, pw) } catch (ex) { setErr(ex.message) } finally { setBusy(false) }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center p-6">
      <div className="rise-in w-full max-w-sm">
        <div className="flex flex-col items-center">
          <img src={logo} alt="Pineda Heating & Air" className="h-24 w-24 rounded-2xl object-contain" />
          <h1 className="mt-5 font-cond text-3xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted">Sign in to your command center</p>
        </div>

        {mode === 'demo' ? (
          <div className="mt-8 flex flex-col gap-3">
            <Button variant="primary" className="w-full" onClick={() => demoLogin('owner')}>
              Enter as Chaun · Owner
            </Button>
            <Button className="w-full" onClick={() => demoLogin('client')}>
              Enter as Maria · Client
            </Button>
            <button onClick={() => setMode('signin')} className="mt-1 text-center text-xs font-semibold text-muted transition hover:text-ink">
              Have an account? Sign in →
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 flex flex-col gap-3.5">
            <Field label="Email">
              <Input type="email" required autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            <Field label="Password">
              <Input type="password" required autoComplete="current-password" placeholder="••••••••" value={pw} onChange={(e) => setPw(e.target.value)} />
            </Field>
            {err && <p role="alert" className="rounded-lg border border-red/30 bg-red/10 px-3 py-2 text-xs font-semibold text-red">{err}</p>}
            <Button type="submit" variant="primary" loading={busy} className="w-full">Sign in</Button>
            <button type="button" onClick={() => setMode('demo')} className="text-center text-xs font-semibold text-muted transition hover:text-ink">
              ← Back to demo access
            </button>
            {!live && <p className="text-center text-[11px] text-faint">Live accounts activate once the backend is connected.</p>}
          </form>
        )}

        <p className="mt-8 flex items-center justify-center gap-1.5 text-[11px] text-faint">
          <Lock className="h-3 w-3" /> 256-bit secured · {company.city}
        </p>
      </div>
    </div>
  )
}

export default function App() {
  const { user, signOut } = useStore()
  const [screen, setScreen] = useState(null)

  if (!user) return <Login />

  const role = user.role
  const current = screen || (role === 'owner' ? 'dashboard' : 'portal')
  const tabs = role === 'owner' ? ownerTabs : clientTabs
  const nav = role === 'owner' ? ownerNav : clientNav

  let Body
  if (role === 'owner') Body = current === 'more' ? More : ownerScreens[current] || Dashboard
  else Body = clientScreens[current] || Portal

  return (
    <div className="flex min-h-dvh">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border-1 bg-surface-1/70 p-4 lg:flex">
        <div className="mb-6 flex items-center gap-2.5 px-2">
          <img src={logo} alt="" className="h-9 w-9 rounded-lg object-contain" />
          <div className="leading-tight">
            <div className="font-cond text-base font-bold tracking-wide">PINEDA OS</div>
            <div className="text-[10px] text-faint">{role === 'owner' ? 'Owner Command Center' : 'Client Portal'}</div>
          </div>
        </div>
        <div className="app-scroll flex-1 overflow-y-auto">
          {nav.map((s) => (
            <div key={s.section} className="mb-5">
              <div className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-widest text-faint">{s.section}</div>
              {s.items.map((i) => {
                const active = current === i.key
                return (
                  <button
                    key={i.key}
                    onClick={() => setScreen(i.key)}
                    className={`mb-0.5 flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-semibold transition ${
                      active ? 'bg-amber/12 text-amber' : 'text-muted hover:bg-surface-2 hover:text-ink'
                    }`}
                  >
                    <i.icon className="h-4.5 w-4.5" strokeWidth={active ? 2.2 : 1.8} />
                    {i.name}
                    {active && <ChevronRight className="ml-auto h-3.5 w-3.5" />}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
        <button onClick={() => { signOut(); setScreen(null) }} className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-[13px] font-semibold text-muted transition hover:bg-surface-2 hover:text-ink">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </aside>

      {/* Main column */}
      <div className="relative flex min-w-0 flex-1 flex-col">
        {/* Mobile header */}
        <header className="flex items-center justify-between border-b border-border-1 bg-surface-1/60 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center gap-2">
            <img src={logo} alt="" className="h-7 w-7 rounded-md object-contain" />
            <div className="leading-tight">
              <div className="font-cond text-sm font-bold tracking-wide">PINEDA OS</div>
              <div className="text-[10px] text-faint">{role === 'owner' ? 'Owner Command Center' : 'Client Portal'}</div>
            </div>
          </div>
          <button onClick={() => { signOut(); setScreen(null) }} className="flex min-h-11 items-center gap-1 px-2 text-[11px] font-semibold text-muted">
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </header>

        <main className="app-scroll flex-1 overflow-y-auto px-4 py-4 pb-24 lg:px-8 lg:py-6 lg:pb-8">
          <div className="mx-auto w-full max-w-xl lg:max-w-3xl">
            <Body key={current} go={setScreen} />
          </div>
        </main>

        {/* Mobile bottom nav */}
        <nav className="fixed inset-x-0 bottom-0 z-40 grid border-t border-border-1 bg-bg/85 px-1 pb-[max(env(safe-area-inset-bottom),8px)] pt-1.5 backdrop-blur-md lg:hidden" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
          {tabs.map((t) => {
            const active = current === t.key || (t.key === 'more' && role === 'owner' && !ownerTabs.some((x) => x.key === current))
            return (
              <button key={t.key} onClick={() => setScreen(t.key)} className="flex min-h-12 flex-col items-center justify-center gap-0.5">
                <t.icon className={`h-5 w-5 ${active ? 'text-amber' : 'text-faint'}`} strokeWidth={active ? 2.2 : 1.8} />
                <span className={`text-[10px] font-semibold ${active ? 'text-amber' : 'text-faint'}`}>{t.name}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
