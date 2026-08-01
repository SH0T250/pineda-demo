// Get Paid — invoices, reminders, and the YTD tax picture.
import { useState } from 'react'
import { Plus, RefreshCw, Printer } from 'lucide-react'
import { invoices as taxData, money } from '../data.js'
import { Badge, Button, Card, Field, Input, Row, ScreenTitle, Sheet, useToast } from '../ui.jsx'
import { useStore } from '../store.jsx'
import InvoiceDoc from './InvoiceDoc.jsx'

export default function Invoices() {
  const { db, add, update, remove } = useStore()
  const toast = useToast()
  const [openId, setOpenId] = useState(null)
  const [confirmDel, setConfirmDel] = useState(false)
  const [newOpen, setNewOpen] = useState(false)
  const [docId, setDocId] = useState(null)
  const [client, setClient] = useState('')
  const [amount, setAmount] = useState('')

  const openInvoices = db.invoices.filter((i) => i.status !== 'PAID')
  const outstanding = openInvoices.reduce((s, i) => s + i.amt, 0)
  const sel = db.invoices.find((i) => i.id === openId)
  const docInv = db.invoices.find((i) => i.id === docId)

  const openSheet = (id) => { setOpenId(id); setConfirmDel(false) }

  const markPaid = () => {
    update('invoices', sel.id, { status: 'PAID', tone: 'green' })
    toast('Payment recorded')
    setOpenId(null)
  }
  const sendReminder = () => {
    update('invoices', sel.id, { reminded: 'Reminded today' })
    toast(`Reminder sent to ${sel.client}`)
  }
  const removeInvoice = () => {
    remove('invoices', sel.id)
    toast('Invoice removed')
    setOpenId(null)
  }
  const createInvoice = () => {
    add('invoices', { client: client.trim(), amt: Number(amount), status: 'SENT', tone: 'amber' })
    toast('Invoice sent')
    setNewOpen(false)
    setClient('')
    setAmount('')
  }

  return (
    <div className="rise-in flex flex-col gap-4">
      <ScreenTitle
        kicker="Get Paid"
        title="Invoices & taxes"
        right={
          <Button variant="primary" onClick={() => setNewOpen(true)}>
            <Plus className="h-4 w-4" /> New invoice
          </Button>
        }
      />

      <div className="stagger flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start">
        {/* Left — outstanding + invoice list */}
        <div className="flex flex-col gap-4">
          <Card raised>
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted">Outstanding</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="tnum font-cond text-4xl font-bold leading-none">{money(outstanding)}</span>
              <span className="text-sm font-bold text-red">· {openInvoices.length} open</span>
            </div>
          </Card>

          <Card>
            {db.invoices.map((inv) => (
              <Row
                key={inv.id}
                left={inv.client}
                sub={[inv.num, inv.reminded].filter(Boolean).join(' · ') || undefined}
                right={money(inv.amt)}
                badge={<Badge tone={inv.tone}>{inv.status}</Badge>}
                onClick={() => openSheet(inv.id)}
              />
            ))}
          </Card>
        </div>

        {/* Right — YTD deductions + QuickBooks */}
        <div className="flex flex-col gap-4">
          <Card>
            <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted">YTD Deductions</div>
            {taxData.deductions.map((d) => (
              <Row key={d.name} left={d.name} sub={d.sub || undefined} right={money(d.amt)} />
            ))}
            <div className="mt-3 flex items-center justify-between rounded-xl border border-amber/30 bg-amber/10 px-3 py-2.5">
              <span className="text-sm font-bold text-amber">Est. Tax Savings</span>
              <span className="tnum font-cond text-xl font-bold text-amber">{money(taxData.taxSavings)}</span>
            </div>
          </Card>

          <Card className="flex items-center gap-3">
            <RefreshCw className="h-4 w-4 shrink-0 text-muted" />
            <p className="min-w-0 flex-1 text-xs leading-relaxed text-muted">
              Two-way sync with QuickBooks · customers &amp; contacts import automatically
            </p>
            <Badge tone="muted">CONNECTED</Badge>
          </Card>
        </div>
      </div>

      {/* Invoice detail */}
      <Sheet open={!!sel} onClose={() => setOpenId(null)} title={sel?.client}>
        {sel && (
          <div className="flex flex-col gap-4">
            <div className="flex items-baseline justify-between">
              <span className="tnum font-cond text-4xl font-bold leading-none">{money(sel.amt)}</span>
              <Badge tone={sel.tone}>{sel.status}</Badge>
            </div>
            {sel.reminded && <div className="text-xs text-muted">{sel.reminded}</div>}
            <div className="flex flex-col gap-2">
              <Button variant="secondary" onClick={() => { setDocId(sel.id); setOpenId(null) }}>
                <Printer className="h-4 w-4" /> View invoice · Print
              </Button>
              {sel.status !== 'PAID' && <Button variant="primary" onClick={markPaid}>Mark paid</Button>}
              {sel.status !== 'PAID' && <Button variant="secondary" onClick={sendReminder}>Send reminder</Button>}
              <Button variant="danger" onClick={confirmDel ? removeInvoice : () => setConfirmDel(true)}>
                {confirmDel ? 'Sure? Tap again to remove' : 'Remove'}
              </Button>
            </div>
          </div>
        )}
      </Sheet>

      {/* New invoice */}
      <Sheet open={newOpen} onClose={() => setNewOpen(false)} title="New invoice">
        <div className="flex flex-col gap-4">
          <Field label="Client">
            <Input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client name" />
          </Field>
          <Field label="Amount">
            <Input type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
          </Field>
          <Button variant="primary" disabled={!client.trim() || !(Number(amount) > 0)} onClick={createInvoice}>
            Send invoice
          </Button>
        </div>
      </Sheet>

      {docInv && <InvoiceDoc invoice={docInv} onClose={() => setDocId(null)} />}
    </div>
  )
}
