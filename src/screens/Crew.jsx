// Live Crew — where every tech is right now, staged GPS positions from data.js.
import { MapPin, Truck } from 'lucide-react'
import { APP_TODAY, crew, money } from '../data.js'
import { Avatar, Badge, Card, Footnote, ScreenTitle } from '../ui.jsx'

const areaLabels = [
  { name: 'Canyon Lk', x: 10, y: 14 },
  { name: 'Gruene', x: 70, y: 22 },
  { name: 'New Braunfels', x: 38, y: 64 },
]

export default function Crew({ go }) {
  return (
    <div className="rise-in flex flex-col gap-4">
      <ScreenTitle
        kicker={`Live Crew · ${APP_TODAY.label}`}
        title="Where everyone is"
        right={<Badge tone="green" pulse>LIVE</Badge>}
      />

      {/* static map — navy field with faint road hints, no map libs */}
      <div className="relative h-44 overflow-hidden rounded-2xl border border-border-1 bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 shadow-card lg:h-56">
        <svg className="absolute inset-0 h-full w-full text-navy-600/50" viewBox="0 0 400 176" preserveAspectRatio="none" fill="none" aria-hidden="true">
          <path d="M-10 120 C 80 100, 150 130, 240 96 S 380 60, 410 70" stroke="currentColor" strokeWidth="3" />
          <path d="M60 190 C 90 130, 110 80, 150 -10" stroke="currentColor" strokeWidth="2" />
          <path d="M200 190 C 230 140, 260 100, 330 -10" stroke="currentColor" strokeWidth="2" />
          <path d="M-10 40 C 70 55, 160 30, 260 48 S 370 30, 410 42" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 5" />
        </svg>
        {areaLabels.map((a) => (
          <span key={a.name} className="absolute text-[9px] font-bold uppercase tracking-widest text-faint" style={{ left: `${a.x}%`, top: `${a.y}%` }}>
            {a.name}
          </span>
        ))}
        {crew.map((t) => (
          <div key={t.id} className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5" style={{ left: `${t.x}%`, top: `${t.y}%` }}>
            <span className="pulse-dot h-2.5 w-2.5 shrink-0 rounded-full bg-amber" />
            <span className="rounded-full border border-amber/30 bg-navy-950/80 px-1.5 py-0.5 text-[9px] font-bold text-amber">{t.initials}</span>
          </div>
        ))}
      </div>

      <div className="stagger flex flex-col gap-4 lg:grid lg:grid-cols-3">
        {crew.map((t) => (
          <Card key={t.id} className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Avatar initials={t.initials} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold">{t.name}</div>
                <div className="text-xs text-muted">{t.truck}</div>
              </div>
              <Badge tone={t.role === 'Owner' ? 'amber' : 'muted'}>{t.role.toUpperCase()}</Badge>
            </div>

            <div>
              <div className="truncate text-sm font-medium">{t.job}</div>
              <div className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                {t.area}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-border-1 pt-3">
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
            </div>

            <div className="mt-auto flex items-center justify-between border-t border-border-1 pt-3">
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted">
                <Truck className="h-3.5 w-3.5" />
                Vehicle
              </span>
              <Badge tone={t.vehicleTone}>{t.vehicle.toUpperCase()}</Badge>
            </div>
          </Card>
        ))}
      </div>

      <Footnote>Positions from truck GPS pings every 30 seconds · mileage and vehicle maintenance auto-tracked.</Footnote>
    </div>
  )
}
