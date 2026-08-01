import { useState } from 'react'
import { BarChart, Bar, XAxis, ResponsiveContainer } from 'recharts'
import { APP_TODAY, health } from '../data.js'
import { Card, Stat, Badge, Footnote } from '../ui.jsx'

export default function Health() {
  const [range, setRange] = useState('MTD')
  return (
    <div className="rise-in flex flex-col gap-4">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber">Business Health · {APP_TODAY.label}</div>
          <h1 className="font-cond text-3xl font-bold leading-tight">The Numbers</h1>
        </div>
        <div className="flex rounded-xl border border-navy-600 bg-navy-800/80 p-0.5">
          {['MTD', 'YTD'].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                range === r ? 'bg-amber text-navy-950' : 'text-muted'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {health.kpis.map((k) => (
          <Stat key={k.name} label={k.name} value={k.value} sub={k.delta} tone={k.tone} />
        ))}
      </div>

      <Card>
        <div className="mb-2 flex items-center justify-between">
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted">Revenue · last 6 months</div>
          <Badge tone="green">{health.yoy}</Badge>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={health.revenue} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
            <XAxis dataKey="m" tick={{ fill: '#8c99ae', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Bar dataKey="v" fill="#e7a93c" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div>
        <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted">A/R Aging</div>
        <div className="grid grid-cols-4 gap-2">
          {health.aging.map((a) => (
            <div key={a.bucket} className="rounded-xl border border-navy-600/60 bg-navy-800/80 p-2.5 text-center">
              <div className={`tnum font-cond text-lg font-bold leading-none ${
                a.tone === 'green' ? 'text-green' : a.tone === 'red' ? 'text-red' : 'text-amber'
              }`}>{a.amt}</div>
              <div className="mt-1 text-[9px] font-bold uppercase tracking-wider text-muted">{a.bucket}</div>
            </div>
          ))}
        </div>
      </div>

      <Footnote>Your accountant's dashboard, live, every day.</Footnote>
    </div>
  )
}
