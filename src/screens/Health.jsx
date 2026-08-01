import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { APP_TODAY, health, money } from '../data.js'
import { Card, Stat, Badge, ScreenTitle, Segmented, Footnote, toneText } from '../ui.jsx'
import { useStore } from '../store.jsx'

export default function Health() {
  const { db } = useStore()
  const [range, setRange] = useState('MTD')

  // A/R computed live from invoices
  const openInvoices = db.invoices.filter((i) => i.status !== 'PAID')
  const arTotal = openInvoices.reduce((s, i) => s + i.amt, 0)

  // Close rate computed live from quotes
  const won = db.quotes.filter((q) => q.status === 'won').length
  const lost = db.quotes.filter((q) => q.status === 'lost').length
  const decided = won + lost
  const closeRate =
    decided >= 2
      ? { value: Math.round((won / decided) * 100) + '%', sub: `${won} of ${decided} decided quotes won` }
      : { value: '63%', sub: '41 of 65 quotes won' }

  const [revKpi, marginKpi] = health.kpis

  return (
    <div className="rise-in flex flex-col gap-4">
      <ScreenTitle
        kicker={`Business Health · ${APP_TODAY.label}`}
        title="The Numbers"
        right={<Segmented options={['MTD', 'YTD']} value={range} onChange={setRange} />}
      />

      <div className="stagger grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label={revKpi.name} value={revKpi.value} sub={revKpi.delta} tone={revKpi.tone} />
        <Stat label={marginKpi.name} value={marginKpi.value} sub={marginKpi.delta} tone={marginKpi.tone} />
        <Stat label="A/R Outstanding" value={money(arTotal)} sub={`${openInvoices.length} open invoices`} tone="red" />
        <Stat label="Close Rate" value={closeRate.value} sub={closeRate.sub} tone="muted" />
      </div>

      <div className="stagger flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start">
        <Card>
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted">Revenue · last 6 months</div>
            <Badge tone="green">{health.yoy}</Badge>
          </div>
          <div className="h-40 lg:h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={health.revenue} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                <XAxis dataKey="m" tick={{ fill: '#93a1b7', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: 'rgba(231, 169, 60, 0.07)' }}
                  contentStyle={{ background: '#142234', border: '1px solid #2d4560', borderRadius: 12 }}
                  labelStyle={{ color: '#93a1b7', fontSize: 11 }}
                  itemStyle={{ color: '#f4f7fc', fontSize: 12, fontWeight: 700 }}
                  formatter={(v) => [`$${v}k`, 'Revenue']}
                />
                <Bar dataKey="v" fill="#e7a93c" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div>
          <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted">A/R Aging</div>
          <div className="grid grid-cols-4 gap-2 lg:grid-cols-2">
            {health.aging.map((a) => (
              <div key={a.bucket} className="rounded-xl border border-border-1 bg-surface-2 p-2.5 text-center shadow-card lg:p-4">
                <div className={`tnum font-cond text-lg font-bold leading-none lg:text-2xl ${toneText[a.tone]}`}>{a.amt}</div>
                <div className="mt-1 text-[9px] font-bold uppercase tracking-wider text-muted">{a.bucket}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footnote>Your accountant's dashboard, live, every day.</Footnote>
    </div>
  )
}
