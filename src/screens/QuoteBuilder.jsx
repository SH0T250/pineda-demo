// Quote Builder — the money engine. Build a quote, watch the margin live.
import { useState } from 'react'
import { Plus, X, Send, Check, FileText } from 'lucide-react'
import { money } from '../data.js'
import { Badge, Card, ScreenTitle, Row, Button, Field, Input, Select, Sheet, useToast, EmptyState, Footnote } from '../ui.jsx'
import { useStore, quoteTotals, partSell, LABOR_SELL } from '../store.jsx'

const STATUS = {
  draft: { tone: 'muted', label: 'DRAFT' },
  sent: { tone: 'amber', label: 'SENT' },
  won: { tone: 'green', label: 'WON' },
  lost: { tone: 'red', label: 'LOST' },
}

const signed = (n) => (n < 0 ? '−' + money(Math.abs(n)) : money(n))
const lineAmt = (l) => (l.kind === 'labor' ? l.hours * LABOR_SELL : l.sell * (l.qty || 1))

function MoneyPanel({ lines, className = '' }) {
  const t = quoteTotals(lines)
  const netTone = t.net >= 0 ? 'green' : 'red'
  return (
    <div className={`rounded-2xl border border-border-1 bg-surface-1 p-4 ${className}`}>
      <div className="flex items-center justify-between text-xs text-muted">
        <span>Job cost</span>
        <span className="tnum">{money(t.jobCost)}</span>
      </div>
      <div className="mt-2 flex items-baseline justify-between gap-3">
        <span className="text-sm font-semibold">Customer price</span>
        <span className="tnum font-cond text-3xl font-bold leading-none">{money(t.price)}</span>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-sm text-muted">Gross profit</span>
        <span className="flex items-center gap-2">
          <Badge tone="green">{t.grossPct}</Badge>
          <span className="tnum text-sm font-bold text-green">{money(t.gross)}</span>
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-muted">
        <span>Overhead (18%)</span>
        <span className="tnum">−{money(t.overhead)}</span>
      </div>
      <div className="my-3 border-t border-border-1" />
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-bold">Net profit</span>
        <span className="flex items-center gap-2">
          <Badge tone={netTone}>{t.netPct}</Badge>
          <span className={`tnum font-cond text-xl font-bold ${netTone === 'green' ? 'text-green' : 'text-red'}`}>{signed(t.net)}</span>
        </span>
      </div>
    </div>
  )
}

export default function QuoteBuilder({ go }) {
  const { db, add, update } = useStore()
  const toast = useToast()

  // detail sheet
  const [detailId, setDetailId] = useState(null)
  const [confirmLost, setConfirmLost] = useState(false)
  const q = db.quotes.find((x) => x.id === detailId)
  const closeDetail = () => { setDetailId(null); setConfirmLost(false) }

  // builder sheet
  const [builderOpen, setBuilderOpen] = useState(false)
  const [client, setClient] = useState('')
  const [addr, setAddr] = useState('')
  const [lines, setLines] = useState([])
  const [adder, setAdder] = useState(null) // 'part' | 'labor' | null
  const [partId, setPartId] = useState('')
  const [partQty, setPartQty] = useState('1')
  const [hrs, setHrs] = useState('')

  const openBuilder = () => {
    setClient(''); setAddr(''); setLines([]); setAdder(null)
    setPartId(db.parts[0]?.id || ''); setPartQty('1'); setHrs('')
    setBuilderOpen(true)
  }

  const addPart = () => {
    const p = db.parts.find((x) => x.id === partId)
    if (!p) return
    const qty = Math.max(1, parseInt(partQty, 10) || 1)
    setLines((ls) => [...ls, { kind: 'part', name: p.item, pn: p.pn, cost: p.cost, sell: partSell(p.cost, p.markupPct), qty }])
    setPartQty('1'); setAdder(null)
  }

  const addLabor = () => {
    const h = parseFloat(hrs)
    if (!h || h <= 0) return
    setLines((ls) => [...ls, { kind: 'labor', hours: h }])
    setHrs(''); setAdder(null)
  }

  const canSave = client.trim().length > 0 && lines.length > 0
  const save = (status) => {
    add('quotes', { num: '#Q-' + (1042 + db.quotes.length), client: client.trim(), addr: addr.trim(), status, lines })
    toast(status === 'sent' ? `Quote sent to ${client.trim()}` : 'Draft saved')
    setBuilderOpen(false)
  }

  return (
    <div className="rise-in flex flex-col gap-4">
      <ScreenTitle
        kicker="Quotes"
        title="Margin in view."
        right={<Button variant="primary" onClick={openBuilder}><Plus className="h-4 w-4" />New Quote</Button>}
      />

      {db.quotes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No quotes yet"
          sub="Build your first quote and see the profit before the customer does."
          action={<Button variant="primary" onClick={openBuilder}><Plus className="h-4 w-4" />New Quote</Button>}
        />
      ) : (
        <div className="stagger grid gap-3 lg:grid-cols-2">
          {db.quotes.map((quote) => {
            const s = STATUS[quote.status] || STATUS.draft
            return (
              <Card key={quote.id} onClick={() => { setConfirmLost(false); setDetailId(quote.id) }} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <Badge tone="amber">{quote.num}</Badge>
                  <div className="mt-1.5 truncate text-sm font-bold">{quote.client}</div>
                  <div className="truncate text-xs text-muted">{quote.addr}</div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="tnum font-cond text-xl font-bold">{money(quoteTotals(quote.lines).price)}</div>
                  <div className="mt-1.5 flex justify-end"><Badge tone={s.tone}>{s.label}</Badge></div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <Footnote>Labor sells at ${LABOR_SELL}/hr · overhead runs 18% of customer price.</Footnote>

      {/* ————— Quote detail ————— */}
      <Sheet open={!!q} onClose={closeDetail} title={q ? `${q.num} · ${q.client}` : ''}>
        {q && (
          <div className="flex flex-col gap-4">
            <div className="text-xs text-muted">{q.addr}</div>
            <div>
              {q.lines.map((l, i) =>
                l.kind === 'labor' ? (
                  <Row key={i} left="Labor" sub={`${l.hours} hrs @ $${LABOR_SELL}`} right={money(lineAmt(l))} />
                ) : (
                  <Row key={i} left={l.name} sub={l.pn + (l.qty > 1 ? ` · ×${l.qty}` : '')} right={money(lineAmt(l))} />
                )
              )}
            </div>
            <MoneyPanel lines={q.lines} />

            {q.status === 'draft' && (
              <Button variant="primary" className="w-full" onClick={() => { update('quotes', q.id, { status: 'sent' }); toast(`Quote sent to ${q.client}`) }}>
                <Send className="h-4 w-4" />Send quote
              </Button>
            )}
            {q.status === 'sent' && (
              <div className="flex gap-3">
                <Button
                  variant="danger"
                  className="flex-1"
                  onClick={() => {
                    if (!confirmLost) return setConfirmLost(true)
                    update('quotes', q.id, { status: 'lost' }); setConfirmLost(false); toast('Marked lost')
                  }}
                >
                  {confirmLost ? 'Sure?' : 'Mark lost'}
                </Button>
                <Button variant="primary" className="flex-1" onClick={() => { update('quotes', q.id, { status: 'won' }); toast(`${q.num} won — ${money(quoteTotals(q.lines).net)} net`) }}>
                  <Check className="h-4 w-4" />Mark won
                </Button>
              </div>
            )}
            {(q.status === 'won' || q.status === 'lost') && (
              <div className="flex justify-center py-1">
                <Badge tone={STATUS[q.status].tone}>{STATUS[q.status].label}</Badge>
              </div>
            )}
          </div>
        )}
      </Sheet>

      {/* ————— Builder ————— */}
      <Sheet open={builderOpen} onClose={() => setBuilderOpen(false)} title="New Quote">
        <div className="flex flex-col gap-4">
          <Field label="Client"><Input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Saenz, M." /></Field>
          <Field label="Address"><Input value={addr} onChange={(e) => setAddr(e.target.value)} placeholder="1234 Gruene Rd, New Braunfels" /></Field>

          <div>
            <div className="mb-2 text-[11px] font-bold uppercase tracking-widest text-muted">Line items</div>
            {lines.length === 0 ? (
              <EmptyState icon={FileText} title="No line items yet" sub="Add parts and labor — the margin math updates live below." />
            ) : (
              <div className="flex flex-col gap-2">
                {lines.map((l, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 rounded-xl border border-border-1 bg-surface-1 px-3 py-2">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{l.kind === 'labor' ? 'Labor' : l.name}</div>
                      <div className="truncate text-xs text-muted">
                        {l.kind === 'labor' ? `${l.hours} hrs @ $${LABOR_SELL}` : l.pn + (l.qty > 1 ? ` · ×${l.qty}` : '')}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <span className="tnum text-sm font-bold">{money(lineAmt(l))}</span>
                      <button
                        onClick={() => setLines((ls) => ls.filter((_, j) => j !== i))}
                        aria-label="Remove line item"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-surface-3 hover:text-red"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => setAdder(adder === 'part' ? null : 'part')}>
              <Plus className="h-4 w-4" />Add part
            </Button>
            <Button variant="secondary" className="flex-1" onClick={() => setAdder(adder === 'labor' ? null : 'labor')}>
              <Plus className="h-4 w-4" />Labor
            </Button>
          </div>

          {adder === 'part' && (
            <div className="fade-in flex flex-col gap-3 rounded-2xl border border-border-2 bg-surface-1 p-3">
              <Field label="Part">
                <Select
                  value={partId}
                  onChange={(e) => setPartId(e.target.value)}
                  options={db.parts.map((p) => ({ value: p.id, label: `${p.item} · ${money(partSell(p.cost, p.markupPct))}` }))}
                />
              </Field>
              <div className="flex items-end gap-3">
                <div className="w-24"><Field label="Qty"><Input type="number" min="1" inputMode="numeric" value={partQty} onChange={(e) => setPartQty(e.target.value)} /></Field></div>
                <Button variant="secondary" className="flex-1" onClick={addPart}>Add to quote</Button>
              </div>
            </div>
          )}

          {adder === 'labor' && (
            <div className="fade-in flex items-end gap-3 rounded-2xl border border-border-2 bg-surface-1 p-3">
              <div className="w-28"><Field label="Hours"><Input type="number" min="0.5" step="0.5" inputMode="decimal" value={hrs} onChange={(e) => setHrs(e.target.value)} placeholder="2.5" /></Field></div>
              <Button variant="secondary" className="flex-1" onClick={addLabor}>Add labor</Button>
            </div>
          )}

          <MoneyPanel lines={lines} className="sticky bottom-0 shadow-raised" />

          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" disabled={!canSave} onClick={() => save('draft')}>Save draft</Button>
            <Button variant="primary" className="flex-1" disabled={!canSave} onClick={() => save('sent')}>
              <Send className="h-4 w-4" />Save & send
            </Button>
          </div>
        </div>
      </Sheet>
    </div>
  )
}
