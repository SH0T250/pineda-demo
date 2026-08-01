// Vendor Database — every part priced once, margin baked in.
import { useState } from 'react'
import { Plus, PackageSearch } from 'lucide-react'
import { money } from '../data.js'
import { ScreenTitle, Card, Button, Sheet, Field, Input, Footnote, EmptyState, useToast } from '../ui.jsx'
import { useStore, partSell } from '../store.jsx'

const EMPTY = { item: '', vendor: '', pn: '', cost: '', markupPct: '' }

export default function Vendors() {
  const { db, add, update, remove } = useStore()
  const toast = useToast()
  const [form, setForm] = useState(null) // null = closed; {id?} = editing/adding
  const [confirmDel, setConfirmDel] = useState(false)

  const open = (part) => {
    setConfirmDel(false)
    setForm(part ? { id: part.id, item: part.item, vendor: part.vendor, pn: part.pn, cost: String(part.cost), markupPct: String(part.markupPct) } : { ...EMPTY })
  }
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const cost = parseFloat(form?.cost) || 0
  const markupPct = parseFloat(form?.markupPct) || 0
  const sell = partSell(cost, markupPct)

  const save = () => {
    const patch = { item: form.item.trim(), vendor: form.vendor.trim(), pn: form.pn.trim(), cost, markupPct }
    if (!patch.item) return
    if (form.id) {
      update('parts', form.id, patch)
      toast('Part updated')
    } else {
      add('parts', patch)
      toast('Part added')
    }
    setForm(null)
  }

  const del = () => {
    remove('parts', form.id)
    setForm(null)
    toast('Part deleted')
  }

  return (
    <div className="rise-in flex flex-col gap-4">
      <ScreenTitle
        kicker="Vendor Database"
        title="Parts & pricing"
        right={
          <Button variant="primary" onClick={() => open(null)}>
            <Plus className="h-4 w-4" /> Add part
          </Button>
        }
      />

      {db.parts.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title="No parts yet"
          sub="Add a part once and its markup follows it into every quote."
          action={<Button variant="primary" onClick={() => open(null)}><Plus className="h-4 w-4" /> Add part</Button>}
        />
      ) : (
        <div className="stagger grid grid-cols-1 gap-3 lg:grid-cols-2">
          {db.parts.map((p) => {
            const s = partSell(p.cost, p.markupPct)
            return (
              <Card key={p.id} onClick={() => open(p)}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold">{p.item}</div>
                    <div className="truncate text-xs text-muted">{p.vendor} · {p.pn}</div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="tnum text-sm font-bold">{money(s)}</div>
                    <div className="tnum text-[11px] font-semibold text-green">+{money(Math.round((s - p.cost) * 100) / 100)}</div>
                  </div>
                </div>
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-surface-1">
                  <div className="h-full rounded-full bg-amber" style={{ width: `${Math.min(p.markupPct, 150) / 1.5}%` }} />
                </div>
                <div className="tnum mt-1.5 text-[11px] text-muted">Cost {money(p.cost)} · Markup {p.markupPct}%</div>
              </Card>
            )
          })}
        </div>
      )}

      <Footnote>Every part priced once — margin baked into every quote.</Footnote>

      <Sheet open={!!form} onClose={() => setForm(null)} title={form?.id ? 'Edit part' : 'Add part'}>
        {form && (
          <div className="flex flex-col gap-4">
            <Field label="Item">
              <Input value={form.item} onChange={set('item')} placeholder="45/5 MFD Dual Cap" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Vendor">
                <Input value={form.vendor} onChange={set('vendor')} placeholder="Gemaire" />
              </Field>
              <Field label="Part #">
                <Input value={form.pn} onChange={set('pn')} placeholder="TRCFD455" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Cost">
                <Input type="number" inputMode="decimal" min="0" step="0.01" value={form.cost} onChange={set('cost')} placeholder="18.40" />
              </Field>
              <Field label="Markup %">
                <Input type="number" inputMode="decimal" min="0" step="1" value={form.markupPct} onChange={set('markupPct')} placeholder="120" />
              </Field>
            </div>
            <div className="tnum rounded-xl border border-border-1 bg-surface-1 px-3.5 py-2.5 text-sm">
              Sells for <span className="font-bold">{money(sell)}</span>
              <span className="text-muted"> · margin </span>
              <span className="font-bold text-green">{money(Math.round((sell - cost) * 100) / 100)}</span>
            </div>
            <div className="flex gap-2">
              {form.id && (
                <Button variant="danger" onClick={() => (confirmDel ? del() : setConfirmDel(true))}>
                  {confirmDel ? 'Sure?' : 'Delete'}
                </Button>
              )}
              <Button variant="primary" className="flex-1" onClick={save} disabled={!form.item.trim()}>
                {form.id ? 'Save changes' : 'Add part'}
              </Button>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  )
}
