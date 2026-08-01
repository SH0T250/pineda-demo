import { useState } from 'react'
import { ScanLine } from 'lucide-react'
import { assets, money } from '../data.js'
import { Card, Stat, Badge, Button, Footnote, ScreenTitle } from '../ui.jsx'

export default function Tools() {
  const [scanned, setScanned] = useState(false)
  return (
    <div className="rise-in flex flex-col gap-4">
      <ScreenTitle kicker="Tool & Equipment Registry" title="Nothing walks off" />

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Assets Tagged" value={assets.tagged} />
        <Stat label="Value on Trucks" value={money(assets.value)} />
        <Stat label="Unaccounted" value={<span className="text-red">{assets.unaccounted}</span>} />
      </div>

      <Card>
        <div className="mb-1 flex items-center justify-between">
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted">Registry · all assets</div>
          <Badge tone="green" pulse>TRACKED</Badge>
        </div>
        {assets.items.map((a) => (
          <div
            key={a.name}
            className={`flex items-center justify-between gap-3 py-2.5 ${
              a.tone === 'red'
                ? 'my-1 rounded-xl border border-red/40 bg-red/10 px-3'
                : 'border-b border-navy-700/60 last:border-0'
            }`}
          >
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">{a.name}</div>
              <div className="truncate text-xs text-muted">{a.tag}</div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <div className="tnum text-sm font-bold">{money(a.value)}</div>
              <Badge tone={a.tone}>{a.status}</Badge>
            </div>
          </div>
        ))}
      </Card>

      <Button primary className="flex items-center justify-center gap-2" onClick={() => setScanned(true)}>
        <ScanLine className="h-4 w-4" />
        {scanned ? 'Audit logged · 46 of 47 confirmed' : 'Run end-of-day scan audit'}
      </Button>

      <Footnote>Every asset is signed to a truck and a name — scanned at load-out and end of day.</Footnote>
    </div>
  )
}
