import { useState } from 'react'
import { FileText } from 'lucide-react'
import { warranties } from '../data.js'
import { Card, Badge, Footnote, ScreenTitle } from '../ui.jsx'

export default function Warranties() {
  const [tab, setTab] = useState('mfr')
  return (
    <div className="rise-in flex flex-col gap-4">
      <ScreenTitle kicker="Warranties" title="Every serial, saved" />

      <div className="grid grid-cols-2 gap-1 rounded-xl border border-navy-600/60 bg-navy-800/80 p-1">
        {[['mfr', 'Manufacturer'], ['labor', 'Labor']].map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`rounded-lg py-2 text-sm font-bold transition ${
              tab === k ? 'bg-amber text-navy-950' : 'text-muted hover:text-ink'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'mfr' ? (
        <>
          {warranties.units.map((u) => (
            <Card key={u.serial}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-bold">{u.name}</div>
                  <div className="text-xs text-muted">Manufacturer · {u.mfr}</div>
                </div>
                <Badge tone="amber">{u.term}</Badge>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 rounded-xl bg-navy-900/60 p-3">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted">Model</div>
                  <div className="tnum text-xs font-semibold">{u.model}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted">Serial</div>
                  <div className="tnum text-xs font-semibold">{u.serial}</div>
                </div>
              </div>
            </Card>
          ))}
          <div className="flex flex-wrap gap-2">
            {warranties.docs.map((d) => (
              <button
                key={d}
                className="flex items-center gap-1.5 rounded-full border border-navy-600 bg-navy-700/60 px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-navy-700 active:scale-[0.98]"
              >
                <FileText className="h-3.5 w-3.5 text-amber" />
                {d}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            <Badge tone="green">2-YR LABOR · PINEDA-BACKED</Badge>
            <Badge tone="muted">10-YR PARTS · MFR-REGISTERED</Badge>
          </div>
          {warranties.labor.map((l) => (
            <Card key={l.client}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-bold">{l.client} · {l.unit}</div>
                  <div className="mt-0.5 text-xs text-muted">{l.dates}</div>
                  <div className={`mt-1 text-xs font-semibold ${l.tone === 'amber' ? 'text-amber' : 'text-green'}`}>{l.days}</div>
                </div>
                <Badge tone={l.tone}>{l.status}</Badge>
              </div>
            </Card>
          ))}
        </>
      )}

      <Footnote>Auto-tracked per job — we ping you &amp; the customer before anything lapses.</Footnote>
    </div>
  )
}
