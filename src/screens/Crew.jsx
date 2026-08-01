import { MapPin } from 'lucide-react'
import { APP_TODAY, crew, money } from '../data.js'
import { Card, Badge, Avatar, Footnote } from '../ui.jsx'

export default function Crew() {
  return (
    <div className="rise-in flex flex-col gap-4">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber">Live Crew · {APP_TODAY.label}</div>
          <h1 className="font-cond text-3xl font-bold leading-tight">Where everyone is</h1>
        </div>
        <Badge tone="green" pulse>LIVE</Badge>
      </div>

      <div className="relative h-44 overflow-hidden rounded-2xl border border-navy-600/60 bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950">
        <svg className="absolute inset-0 h-full w-full text-navy-600/50" viewBox="0 0 400 176" preserveAspectRatio="none" fill="none">
          <path d="M-10 120 C 80 100, 150 130, 240 96 S 380 60, 410 70" stroke="currentColor" strokeWidth="3" />
          <path d="M60 190 C 90 130, 110 80, 150 -10" stroke="currentColor" strokeWidth="2" />
          <path d="M200 190 C 230 140, 260 100, 330 -10" stroke="currentColor" strokeWidth="2" />
          <path d="M-10 40 C 70 55, 160 30, 260 48 S 370 30, 410 42" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 5" />
        </svg>
        <span className="absolute left-[38%] top-[62%] text-[9px] font-bold uppercase tracking-widest text-faint">New Braunfels</span>
        <span className="absolute left-[68%] top-[24%] text-[9px] font-bold uppercase tracking-widest text-faint">Gruene</span>
        <span className="absolute left-[10%] top-[14%] text-[9px] font-bold uppercase tracking-widest text-faint">Canyon Lk</span>
        {crew.map((t) => (
          <div key={t.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${t.x}%`, top: `${t.y}%` }}>
            <div className="flex items-center gap-1.5">
              <span className="pulse-dot h-2.5 w-2.5 shrink-0 rounded-full bg-amber" />
              <span className="rounded-full border border-amber/30 bg-navy-950/80 px-1.5 py-0.5 text-[9px] font-bold text-amber">{t.initials}</span>
            </div>
          </div>
        ))}
      </div>

      {crew.map((t) => (
        <Card key={t.id}>
          <div className="flex items-center gap-3">
            <Avatar initials={t.initials} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-bold">{t.name}</span>
                <Badge tone="muted">{t.role.toUpperCase()}</Badge>
              </div>
              <div className="truncate text-xs text-muted">{t.job}</div>
            </div>
            <div className="flex shrink-0 items-center gap-1 text-[11px] text-faint">
              <MapPin className="h-3.5 w-3.5" />{t.area}
            </div>
          </div>
          <div className="mt-3 grid grid-cols-4 items-center gap-2 border-t border-navy-700/60 pt-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted">Miles</div>
              <div className="tnum font-cond text-lg font-bold leading-tight">{t.miles}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted">Jobs</div>
              <div className="tnum font-cond text-lg font-bold leading-tight">{t.jobs}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted">Revenue</div>
              <div className="tnum font-cond text-lg font-bold leading-tight">{money(t.revenue)}</div>
            </div>
            <div className="justify-self-end">
              <div className="mb-1 text-right text-[10px] font-bold uppercase tracking-widest text-muted">Vehicle</div>
              <Badge tone={t.vehicleTone}>{t.vehicle.toUpperCase()}</Badge>
            </div>
          </div>
        </Card>
      ))}

      <Footnote>GPS pings every 30 seconds · vehicle maintenance auto-tracked.</Footnote>
    </div>
  )
}
