import { useState } from 'react'
import {
  LayoutDashboard, CalendarDays, Inbox as InboxIcon, Wallet, Grid3x3,
  MapPin, Wrench, Package, FileText, HandCoins, ClipboardCheck, ShieldCheck,
  HeartPulse, Star, Home, Camera, MessageCircle, LogOut, ScanFace, Lock,
} from 'lucide-react'
import { company } from './data.js'
import { Card } from './ui.jsx'

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

const moreItems = [
  { key: 'crew', name: 'Live Crew', icon: MapPin },
  { key: 'tools', name: 'Tool Registry', icon: Wrench },
  { key: 'vendors', name: 'Vendors & Parts', icon: Package },
  { key: 'quote', name: 'Quote Builder', icon: FileText },
  { key: 'financing', name: 'Financing', icon: HandCoins },
  { key: 'jobcomplete', name: 'Proof of Work', icon: ClipboardCheck },
  { key: 'warranties', name: 'Warranties', icon: ShieldCheck },
  { key: 'health', name: 'Business Health', icon: HeartPulse },
  { key: 'reputation', name: 'Reputation', icon: Star },
]

function More({ go }) {
  return (
    <div className="rise-in">
      <h1 className="mb-4 font-cond text-3xl font-bold">Command Center</h1>
      <div className="grid grid-cols-3 gap-3">
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

function Login({ onEnter }) {
  const [role, setRole] = useState('owner')
  return (
    <div className="rise-in flex h-full flex-col justify-between py-6">
      <div className="flex flex-col items-center pt-10">
        <img src={import.meta.env.BASE_URL + 'logo.png'} alt="Pineda Heating & Air" className="h-24 w-24 rounded-2xl object-contain" />
        <h1 className="mt-5 font-cond text-3xl font-bold">Welcome back</h1>
        <p className="text-sm text-muted">Sign in to your command center</p>

        <div className="mt-6 flex w-full rounded-xl border border-navy-600 bg-navy-800 p-1">
          {['owner', 'client'].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 rounded-lg py-2 text-sm font-bold capitalize transition ${role === r ? 'bg-amber text-navy-950' : 'text-muted'}`}
            >
              {r}
            </button>
          ))}
        </div>

        <p className="mt-4 px-2 text-center text-xs leading-relaxed text-muted">
          {role === 'owner'
            ? 'Owners get the full business command center — schedule, crew, money, and the AI front desk.'
            : 'Customers get equipment manuals, invoice tracking, instant credit approval, service booking & lifetime warranty records.'}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => onEnter(role)}
          className="w-full rounded-xl bg-amber py-3.5 text-sm font-bold text-navy-950 transition active:scale-[0.98]"
        >
          {role === 'owner' ? 'Enter as Chaun · Owner' : 'Enter as Maria · Client'}
        </button>
        <button onClick={() => onEnter(role)} className="flex w-full items-center justify-center gap-2 rounded-xl border border-navy-600 py-3 text-sm font-semibold text-muted">
          <ScanFace className="h-4 w-4" /> Unlock with Face ID
        </button>
        <p className="flex items-center justify-center gap-1.5 text-[11px] text-faint">
          <Lock className="h-3 w-3" /> 256-bit secured · {company.city}
        </p>
      </div>
    </div>
  )
}

const ownerTabs = [
  { key: 'dashboard', name: 'Home', icon: LayoutDashboard },
  { key: 'schedule', name: 'Schedule', icon: CalendarDays },
  { key: 'inbox', name: 'Inbox', icon: InboxIcon },
  { key: 'invoices', name: 'Money', icon: Wallet },
  { key: 'more', name: 'More', icon: Grid3x3 },
]
const clientTabs = [
  { key: 'portal', name: 'Home', icon: Home },
  { key: 'snap', name: 'Snap & Know', icon: Camera },
  { key: 'assistant', name: 'Assistant', icon: MessageCircle },
]

export default function App() {
  const [role, setRole] = useState(null)
  const [screen, setScreen] = useState('dashboard')

  const enter = (r) => {
    setRole(r)
    setScreen(r === 'owner' ? 'dashboard' : 'portal')
  }
  const logout = () => setRole(null)

  const tabs = role === 'owner' ? ownerTabs : clientTabs
  let Body = null
  if (role === 'owner') Body = screen === 'more' ? () => <More go={setScreen} /> : ownerScreens[screen] || Dashboard
  if (role === 'client') Body = clientScreens[screen] || Portal

  return (
    <div className="flex min-h-full items-center justify-center md:py-8">
      {/* phone frame on desktop; fullscreen on mobile */}
      <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-navy-900 md:h-[860px] md:max-h-[92vh] md:w-[420px] md:rounded-[2.4rem] md:border md:border-navy-600 md:shadow-[0_30px_90px_rgba(0,0,0,0.6)]">
        {role && (
          <header className="flex items-center justify-between border-b border-navy-700/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <img src={import.meta.env.BASE_URL + 'logo.png'} alt="" className="h-7 w-7 rounded-md object-contain" />
              <div className="leading-tight">
                <div className="font-cond text-sm font-bold tracking-wide">PINEDA OS</div>
                <div className="text-[10px] text-faint">{role === 'owner' ? 'Owner Command Center' : 'Client Portal'}</div>
              </div>
            </div>
            <button onClick={logout} className="flex items-center gap-1 text-[11px] font-semibold text-muted">
              <LogOut className="h-3.5 w-3.5" /> Switch
            </button>
          </header>
        )}

        <main className="app-scroll flex-1 overflow-y-auto px-4 py-4 pb-6">
          {role ? <Body key={screen} go={setScreen} /> : <Login onEnter={enter} />}
        </main>

        {role && (
          <nav className="grid border-t border-navy-700/60 bg-navy-950/60 px-1 pb-[max(env(safe-area-inset-bottom),8px)] pt-1.5 backdrop-blur" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
            {tabs.map((t) => {
              // "More" stays lit while any of its sub-screens is open
              const active = screen === t.key || (t.key === 'more' && role === 'owner' && !ownerTabs.some((x) => x.key === screen))
              return (
                <button key={t.key} onClick={() => setScreen(t.key)} className="flex flex-col items-center gap-0.5 py-1.5">
                  <t.icon className={`h-5 w-5 ${active ? 'text-amber' : 'text-faint'}`} strokeWidth={active ? 2.2 : 1.8} />
                  <span className={`text-[10px] font-semibold ${active ? 'text-amber' : 'text-faint'}`}>{t.name}</span>
                </button>
              )
            })}
          </nav>
        )}
      </div>
    </div>
  )
}
