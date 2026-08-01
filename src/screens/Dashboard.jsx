import { ChevronRight } from 'lucide-react'
import { APP_TODAY, todayStats, jobs, techs, money } from '../data.js'
import { Card, Stat, Row, Badge, Footnote } from '../ui.jsx'

export default function Dashboard({ go }) {
  const done = jobs.filter((j) => j.done)
  const maxMiles = Math.max(...techs.map((t) => t.miles))
  return (
    <div className="rise-in flex flex-col gap-4">
      <div>
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber">Daily Dashboard · {APP_TODAY.label}</div>
        <h1 className="font-cond text-3xl font-bold leading-tight">Good morning, Chaun</h1>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Stat label="Revenue Today" value={money(todayStats.revenue)} sub="5 tickets closed" tone="green" />
        <Stat label="Gross Profit" value={money(todayStats.profit)} sub={todayStats.marginPct + ' margin'} tone="green" />
        <Stat label="Jobs Completed" value={todayStats.jobsDone} sub="1 more at 5:00p" />
        <Stat label="Miles Driven" value={todayStats.miles} sub="3 trucks out" />
      </div>

      <Card>
        <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted">Revenue per client · per job</div>
        {todayStats.topClients.map((c) => (
          <Row key={c.name} left={c.name} right={money(c.amt)} />
        ))}
      </Card>

      <Card onClick={() => go('invoices')} className="flex items-center justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted">Outstanding invoices</div>
          <div className="tnum font-cond text-2xl font-bold">$6,620 <span className="text-sm font-semibold text-red">· 4 open</span></div>
        </div>
        <ChevronRight className="h-5 w-5 text-faint" />
      </Card>

      <Card>
        <div className="mb-1 flex items-center justify-between">
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted">Daily log · today's jobs</div>
          <Badge tone="green">LIVE</Badge>
        </div>
        {done.map((j) => (
          <Row key={j.time} left={`${j.client} — ${j.task}`} sub={j.parts} right={money(j.rev)} rightSub={`+${money(j.profit)}`} />
        ))}
        <div className="mt-2 flex items-center justify-between border-t border-navy-600 pt-2 text-sm font-bold">
          <span>Total</span>
          <span className="tnum">{money(todayStats.revenue)} <span className="text-green">+{money(todayStats.profit)}</span></span>
        </div>
      </Card>

      <Card>
        <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted">Miles per truck</div>
        <div className="flex flex-col gap-2">
          {techs.map((t) => (
            <div key={t.id} className="flex items-center gap-3">
              <span className="w-14 text-xs font-semibold text-muted">{t.truck}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-navy-700">
                <div className="h-full rounded-full bg-amber" style={{ width: `${(t.miles / maxMiles) * 100}%` }} />
              </div>
              <span className="tnum w-12 text-right text-xs font-bold">{t.miles} mi</span>
            </div>
          ))}
        </div>
      </Card>

      <Footnote>From the truck to the dashboard. Total control.</Footnote>
    </div>
  )
}
