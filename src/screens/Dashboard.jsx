// Daily Dashboard — owner's morning view, computed live from the store.
import { Plus, FileText, ChevronRight } from 'lucide-react'
import { ScreenTitle, Stat, Card, Button, Row } from '../ui.jsx'
import { useStore } from '../store.jsx'
import { money, APP_TODAY, techs, todayStats } from '../data.js'

const Label = ({ children }) => (
  <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted">{children}</div>
)

export default function Dashboard({ go }) {
  const { db } = useStore()

  const done = db.jobs.filter((j) => j.done)
  const todayRev = done.reduce((s, j) => s + j.rev, 0)
  const todayProfit = done.reduce((s, j) => s + j.profit, 0)
  const margin = todayRev ? ((todayProfit / todayRev) * 100).toFixed(1) + '%' : '—'
  const topClients = [...done].sort((a, b) => b.rev - a.rev).slice(0, 3)
  const openInv = db.invoices.filter((i) => i.status !== 'PAID')
  const outstanding = openInv.reduce((s, i) => s + i.amt, 0)
  const maxMiles = Math.max(...techs.map((t) => t.miles), 1)

  return (
    <div className="rise-in flex flex-col gap-4">
      <ScreenTitle kicker={`Daily Dashboard · ${APP_TODAY.label}`} title="Good morning, Chaun" />

      <div className="stagger grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Revenue Today" value={money(todayRev)} />
        <Stat label="Gross Profit" value={money(todayProfit)} sub={`${margin} margin`} tone="green" />
        <Stat label="Jobs Completed" value={done.length} sub={`${db.jobs.length} scheduled`} />
        <Stat label="Miles Driven" value={todayStats.miles} sub={`${techs.length} trucks`} />
      </div>

      <div className="flex gap-3">
        <Button variant="primary" className="flex-1" onClick={() => go?.('schedule')}>
          <Plus className="h-4 w-4" /> New Job
        </Button>
        <Button variant="secondary" className="flex-1" onClick={() => go?.('quote')}>
          <FileText className="h-4 w-4" /> New Quote
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-start">
        {/* Daily log — left column on desktop */}
        <Card>
          <Label>Daily Log</Label>
          {done.map((j) => (
            <Row
              key={j.id}
              left={`${j.client} — ${j.task}`}
              sub={j.parts}
              right={money(j.rev)}
              rightSub={<span className="tnum text-green">+{money(j.profit)}</span>}
            />
          ))}
          <div className="mt-0.5 flex items-center justify-between border-t border-border-2 pt-2.5">
            <div className="text-sm font-bold">Total</div>
            <div className="text-right">
              <div className="tnum text-sm font-bold">{money(todayRev)}</div>
              <div className="tnum text-[11px] text-green">+{money(todayProfit)}</div>
            </div>
          </div>
        </Card>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          <Card>
            <Label>Revenue per Client</Label>
            {topClients.map((j) => (
              <Row key={j.id} left={j.client} sub={j.task} right={money(j.rev)} />
            ))}
          </Card>

          <Card onClick={() => go?.('invoices')}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <Label>Outstanding Invoices</Label>
                <div className="tnum font-cond text-[26px] font-bold leading-none">{money(outstanding)}</div>
                <div className="mt-1 text-xs text-muted">{openInv.length} open invoices</div>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-faint" />
            </div>
          </Card>

          <Card>
            <Label>Miles per Truck</Label>
            <div className="flex flex-col gap-2.5 pt-1">
              {techs.map((t) => (
                <div key={t.id} className="flex items-center gap-3">
                  <div className="w-16 shrink-0 truncate text-xs font-semibold text-muted">{t.truck}</div>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-1">
                    <div className="h-full rounded-full bg-amber" style={{ width: `${(t.miles / maxMiles) * 100}%` }} />
                  </div>
                  <div className="tnum w-12 shrink-0 text-right text-xs font-bold">{t.miles} mi</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
