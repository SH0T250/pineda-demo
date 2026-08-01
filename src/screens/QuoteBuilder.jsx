import { useState } from 'react'
import { quote, money } from '../data.js'
import { Card, Row, Badge, Button, Footnote, ScreenTitle } from '../ui.jsx'

function MoneyRow({ label, value, badge, muted, big }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className={`text-sm ${muted ? 'text-muted' : 'font-semibold'}`}>{label}</span>
      <span className="flex items-center gap-2">
        {badge}
        <span className={`tnum font-bold ${big ? 'font-cond text-2xl' : muted ? 'text-sm text-muted' : 'text-sm'}`}>{value}</span>
      </span>
    </div>
  )
}

export default function QuoteBuilder() {
  const [sent, setSent] = useState(false)
  return (
    <div className="rise-in flex flex-col gap-4">
      <ScreenTitle kicker="Quote Builder" title="Margin in view." />

      <Card className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">{quote.client}</div>
          <div className="text-xs text-muted">{quote.addr}</div>
        </div>
        <Badge tone="amber">{quote.id}</Badge>
      </Card>

      <Card>
        <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted">Line items</div>
        {quote.lines.map((l) => (
          <Row key={l.name} left={l.name} sub={l.sub} right={money(l.sell)} />
        ))}
      </Card>

      <Card>
        <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted">The money panel</div>
        <MoneyRow label="Job cost (parts + labor)" value={money(quote.jobCost)} muted />
        <MoneyRow label="Customer price" value={money(quote.price)} big />
        <MoneyRow label="Gross profit" value={money(quote.gross)} badge={<Badge tone="green">{quote.grossPct}</Badge>} />
        <MoneyRow label="Overhead (18%)" value={'−' + money(quote.overhead)} muted />
        <div className="my-2 border-t border-navy-600" />
        <div className="flex items-center justify-between gap-3 py-1.5">
          <span className="text-base font-bold">Net profit</span>
          <span className="flex items-center gap-2">
            <Badge tone="green">{quote.netPct}</Badge>
            <span className="tnum font-cond text-xl font-bold text-green">{money(quote.net)}</span>
          </span>
        </div>
      </Card>

      <Button primary className="w-full" onClick={() => setSent(true)}>
        {sent ? 'Quote sent to customer ✓' : 'Send quote'}
      </Button>

      <Footnote>Every quote shows your real margin before you hit send.</Footnote>
    </div>
  )
}
