import { RefreshCw } from 'lucide-react'
import { invoices, money } from '../data.js'
import { Card, Row, Badge, ScreenTitle, Footnote } from '../ui.jsx'

export default function Invoices() {
  return (
    <div className="rise-in flex flex-col gap-4">
      <ScreenTitle kicker="Get Paid" title="Invoices & taxes" />

      <Card>
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted">Outstanding</div>
        <div className="tnum font-cond text-3xl font-bold">
          {money(invoices.outstanding)} <span className="text-sm font-semibold text-red">· {invoices.open} open</span>
        </div>
        <div className="mt-2">
          {invoices.items.map((i) => (
            <Row key={i.client} left={i.client} right={money(i.amt)} badge={<Badge tone={i.tone}>{i.status}</Badge>} />
          ))}
        </div>
      </Card>

      <Card>
        <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted">YTD Deductions</div>
        {invoices.deductions.map((d) => (
          <Row key={d.name} left={d.name} sub={d.sub || undefined} right={money(d.amt)} />
        ))}
        <div className="mt-3 flex items-center justify-between rounded-xl border border-amber/30 bg-amber/10 px-3 py-2.5">
          <span className="text-sm font-bold text-amber">Est. Tax Savings</span>
          <span className="tnum font-cond text-xl font-bold text-amber">{money(invoices.taxSavings)}</span>
        </div>
      </Card>

      <Card className="flex items-center gap-3">
        <RefreshCw className="h-4 w-4 shrink-0 text-green" />
        <p className="text-xs leading-relaxed text-muted">
          Two-way sync with <span className="font-semibold text-amber underline underline-offset-2">QuickBooks</span> · customers &amp; contacts import automatically
        </p>
      </Card>

      <Footnote>Chase less. Deduct more.</Footnote>
    </div>
  )
}
