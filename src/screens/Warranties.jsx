import { useState } from 'react'
import { FileText } from 'lucide-react'
import { warranties } from '../data.js'
import { Card, Badge, Footnote, ScreenTitle, Segmented, useToast, toneText } from '../ui.jsx'

export default function Warranties() {
  const [tab, setTab] = useState('Manufacturer')
  const toast = useToast()

  return (
    <div className="rise-in flex flex-col gap-4">
      <ScreenTitle kicker="Warranties" title="Every serial, saved" />

      <Segmented options={['Manufacturer', 'Labor']} value={tab} onChange={setTab} />

      {tab === 'Manufacturer' ? (
        <>
          <div className="stagger grid grid-cols-1 gap-3 lg:grid-cols-2">
            {warranties.units.map((u) => (
              <Card key={u.serial}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold">{u.name}</div>
                    <div className="text-xs text-muted">Manufacturer · {u.mfr}</div>
                  </div>
                  <Badge tone="amber">{u.term}</Badge>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 rounded-xl bg-surface-1 p-3">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted">Model</div>
                    <div className="tnum mt-0.5 text-xs font-semibold">{u.model}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted">Serial</div>
                    <div className="tnum mt-0.5 text-xs font-semibold">{u.serial}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {warranties.docs.map((d) => (
              <button
                key={d}
                onClick={() => toast(`Opening ${d}…`)}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border-2 bg-surface-3/70 px-3.5 text-xs font-semibold text-ink transition hover:bg-surface-3 active:scale-[0.98]"
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
            <Badge tone="amber">2-YR LABOR · PINEDA-BACKED</Badge>
            <Badge tone="muted">10-YR PARTS · MFR-REGISTERED</Badge>
          </div>
          <div className="stagger grid grid-cols-1 gap-3 lg:grid-cols-2">
            {warranties.labor.map((l) => (
              <Card key={l.client} glow={l.status === 'EXPIRING'}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold">{l.client} · {l.unit}</div>
                    <div className="mt-0.5 text-xs text-muted">{l.dates}</div>
                    <div className={`mt-1 text-xs font-semibold ${toneText[l.tone]}`}>{l.days}</div>
                  </div>
                  <Badge tone={l.tone}>{l.status}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      <Footnote>Auto-tracked per job — we ping you and the customer before anything lapses.</Footnote>
    </div>
  )
}
