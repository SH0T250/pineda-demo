// Financing — staged offer for the Delgado system replacement. No CRUD; one send action.
import { useState } from 'react'
import { ShieldCheck, Send, Check } from 'lucide-react'
import { financing, money } from '../data.js'
import { Badge, Card, ScreenTitle, Button, Footnote, useToast } from '../ui.jsx'

export default function Financing() {
  const toast = useToast()
  const [sent, setSent] = useState(false)

  const send = () => {
    if (sent) return
    setSent(true)
    toast('Application texted to Delgado, R.')
  }

  return (
    <div className="rise-in flex flex-col gap-4">
      <ScreenTitle kicker="Customer Financing" title="Approved on the spot." />

      <div className="stagger flex flex-col gap-4">
        <Card className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-semibold">{financing.client}</div>
              <div className="truncate text-xs text-muted">{financing.project}</div>
            </div>
            <Badge tone="muted">PROJECT TOTAL</Badge>
          </div>
          <div className="tnum font-cond text-5xl font-bold leading-none">{money(financing.amount)}</div>
          <div className="flex items-center gap-2.5 rounded-xl border border-green/30 bg-green/10 px-3.5 py-2.5">
            <ShieldCheck className="h-5 w-5 shrink-0 text-green" />
            <div className="text-sm font-bold text-green">Pre-qualified up to {money(financing.preQual)}</div>
          </div>
          <div className="text-[11px] text-faint">60-second soft check — no impact to their credit score.</div>
        </Card>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {financing.options.map((o) => (
            <Card key={o.apr} glow={o.popular} className="flex flex-col gap-3">
              {o.popular && (
                <div>
                  <Badge tone="amber">MOST CHOSEN</Badge>
                </div>
              )}
              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-cond text-2xl font-bold leading-tight">{o.apr}</div>
                  <div className="text-xs text-muted">{o.term}</div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="tnum font-cond text-[26px] font-bold leading-none">{money(o.mo)}</div>
                  <div className="text-[11px] text-muted">per month</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Button variant="primary" className="w-full" onClick={send}>
          {sent ? (
            <>
              <Check className="h-4 w-4" /> Application sent
            </>
          ) : (
            <>
              <Send className="h-4 w-4" /> Text application to Delgado
            </>
          )}
        </Button>

        <Footnote>Powered by Wisetack · soft check, then funds next business day on approval</Footnote>
      </div>
    </div>
  )
}
