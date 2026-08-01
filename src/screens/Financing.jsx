import { useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { financing, money } from '../data.js'
import { Card, Badge, Button, Footnote, ScreenTitle } from '../ui.jsx'

export default function Financing() {
  const [sent, setSent] = useState(false)
  return (
    <div className="rise-in flex flex-col gap-4">
      <ScreenTitle kicker="Customer Financing" title="Approved on the spot." />

      <Card>
        <div className="text-sm font-semibold">{financing.client}</div>
        <div className="text-xs text-muted">{financing.project}</div>
        <div className="tnum mt-3 font-cond text-4xl font-bold leading-none">{money(financing.amount)}</div>
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-green/30 bg-green/10 px-3 py-2">
          <ShieldCheck className="h-4 w-4 shrink-0 text-green" />
          <span className="text-xs font-bold text-green">Pre-qualified up to {money(financing.preQual)}</span>
        </div>
        <p className="mt-2 text-xs text-muted">60-second soft check — no impact to their credit score.</p>
      </Card>

      <div className="flex flex-col gap-3">
        {financing.options.map((o) => (
          <Card key={o.apr} className={`flex items-center justify-between ${o.popular ? 'border-amber/60' : ''}`}>
            <div>
              {o.popular && <div className="mb-1.5"><Badge tone="amber">MOST CHOSEN</Badge></div>}
              <div className="font-cond text-2xl font-bold leading-none">{o.apr}</div>
              <div className="mt-1 text-xs text-muted">{o.term}</div>
            </div>
            <div className="text-right">
              <div className="tnum font-cond text-2xl font-bold leading-none">${o.mo}<span className="text-sm text-muted">/mo</span></div>
            </div>
          </Card>
        ))}
      </div>

      <Button primary onClick={() => setSent(true)}>
        {sent ? 'Application sent ✓' : 'Text application to Delgado'}
      </Button>

      <Footnote>Powered by Wisetack · funds deposited next business day</Footnote>
    </div>
  )
}
