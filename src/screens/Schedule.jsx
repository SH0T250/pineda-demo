import { useState } from 'react'
import { Check } from 'lucide-react'
import { APP_TODAY, jobs, weekStrip } from '../data.js'
import { Card, Badge, Footnote } from '../ui.jsx'

const VIEWS = ['Day', 'Week', 'Month']

export default function Schedule() {
  const [view, setView] = useState('Day')

  return (
    <div className="rise-in flex flex-col gap-4">
      <div>
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber">Schedule · {APP_TODAY.label}</div>
        <h1 className="font-cond text-3xl font-bold leading-tight">Your week, mapped</h1>
      </div>

      <div className="flex rounded-xl border border-navy-600 bg-navy-800/80 p-1">
        {VIEWS.map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
              view === v ? 'bg-amber text-navy-950' : 'text-muted hover:text-ink'
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="flex justify-between">
        {weekStrip.map((d) => (
          <div
            key={d.d}
            className={`flex w-11 flex-col items-center gap-0.5 rounded-xl border py-2 ${
              d.active ? 'border-amber/50 bg-amber/15 text-amber' : 'border-navy-700/60 bg-navy-800/60 text-muted'
            }`}
          >
            <span className="text-[9px] font-bold tracking-widest">{d.d}</span>
            <span className={`tnum font-cond text-lg font-bold leading-none ${d.active ? '' : 'text-ink'}`}>{d.n}</span>
          </div>
        ))}
      </div>

      {view === 'Day' ? (
        <>
          <div className="text-xs font-semibold text-muted">{APP_TODAY.label} · 6 jobs · 3 techs out</div>

          <div className="flex flex-col gap-3">
            {jobs.map((j) => (
              <div key={j.time} className="flex gap-3">
                <div className="tnum w-12 shrink-0 pt-4 text-right text-xs font-bold text-muted">{j.time}</div>
                <Card className={`min-w-0 flex-1 ${j.aiBooked ? 'border-amber/40 bg-amber/5' : ''}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{j.client} — {j.task}</div>
                      <div className="truncate text-xs text-muted">{j.tech} · {j.addr}</div>
                    </div>
                    {j.done && (
                      <Badge tone="green"><Check className="h-3 w-3" /> DONE</Badge>
                    )}
                    {j.aiBooked && <Badge tone="amber" pulse>AI BOOKED</Badge>}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </>
      ) : (
        <Card>
          <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted">{view} view</div>
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: view === 'Week' ? 7 : 28 }, (_, i) => (
              <div
                key={i}
                className={`flex h-9 items-center justify-center rounded-lg border text-[10px] font-bold ${
                  i % 7 === 2 ? 'border-amber/50 bg-amber/15 text-amber' : 'border-navy-700/60 bg-navy-800/60 text-faint'
                }`}
              >
                {view === 'Week' ? `${[2, 4, 6, 3, 5, 1, 0][i]}j` : i + 1}
              </div>
            ))}
          </div>
          <div className="mt-2 text-center text-[11px] text-faint">Tap Day for today's full timeline</div>
        </Card>
      )}

      <Footnote>The 5:00p was booked by the AI front desk — zero missed calls today.</Footnote>
    </div>
  )
}
