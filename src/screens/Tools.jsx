// Tool & Equipment Registry — live asset tracking backed by the store.
import { useState } from 'react'
import { Plus, ScanLine, ArrowLeftRight, AlertTriangle, Trash2 } from 'lucide-react'
import { money } from '../data.js'
import { ScreenTitle, Card, Stat, Badge, Button, Field, Input, Select, Sheet, Footnote, useToast } from '../ui.jsx'
import { useStore } from '../store.jsx'

const TRUCKS = ['Truck 1', 'Truck 2', 'Truck 3']
const BLANK = { name: '', tag: '', truck: 'Truck 1', value: '' }

export default function Tools() {
  const { db, add, update, remove } = useStore()
  const toast = useToast()
  const [sheet, setSheet] = useState(null) // 'add' | asset id | null
  const [confirm, setConfirm] = useState(null) // 'missing' | 'remove' | null
  const [form, setForm] = useState(BLANK)

  const assets = db.assets
  const missing = assets.filter((a) => a.status === 'MISSING').length
  const totalValue = 36484 + assets.reduce((s, a) => s + (a.value || 0), 0)
  const asset = assets.find((a) => a.id === sheet)
  const onTruck = asset?.status === 'ON TRUCK'

  const close = () => { setSheet(null); setConfirm(null) }
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const toggle = () => {
    update('assets', asset.id, onTruck ? { status: 'SIGNED OUT', tone: 'amber' } : { status: 'ON TRUCK', tone: 'green' })
    toast(onTruck ? `${asset.name} signed out` : `${asset.name} back on truck`)
    close()
  }

  const markMissing = () => {
    if (confirm !== 'missing') return setConfirm('missing')
    update('assets', asset.id, { status: 'MISSING', tone: 'red' })
    toast('Marked missing — flagged for audit')
    close()
  }

  const removeAsset = () => {
    if (confirm !== 'remove') return setConfirm('remove')
    remove('assets', asset.id)
    toast('Asset removed from registry')
    close()
  }

  const submitAdd = (e) => {
    e.preventDefault()
    add('assets', {
      name: form.name.trim(),
      tag: `${form.tag.trim()} · ${form.truck}`,
      value: Math.round(+form.value) || 0,
      status: 'ON TRUCK',
      tone: 'green',
    })
    toast('Asset added to registry')
    setForm(BLANK)
    close()
  }

  const runAudit = () =>
    toast(`Scan audit complete — ${missing === 1 ? '1 asset' : `${missing} assets`} unaccounted`)

  return (
    <div className="rise-in flex flex-col gap-4">
      <ScreenTitle kicker="Tool & Equipment Registry" title="Nothing walks off" />

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Assets Tagged" value={assets.length + 42} sub="incl. 42 small tools" />
        <Stat label="Value on Trucks" value={money(totalValue)} sub="replacement cost" />
        <Stat
          label="Missing"
          value={missing}
          sub={missing ? 'action needed' : 'all accounted'}
          tone={missing ? 'red' : 'green'}
        />
      </div>

      <div className="stagger flex flex-col gap-2 lg:grid lg:grid-cols-2 lg:gap-3">
        {assets.map((a) => (
          <Card
            key={a.id}
            onClick={() => { setSheet(a.id); setConfirm(null) }}
            className={a.status === 'MISSING' ? 'ring-1 ring-red/40' : ''}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{a.name}</div>
                <div className="truncate text-xs text-muted">{a.tag}</div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <div className="tnum text-sm font-bold">{money(a.value)}</div>
                <Badge tone={a.tone} pulse={a.status === 'MISSING'}>{a.status}</Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-2 lg:flex-row lg:gap-3">
        <Button variant="primary" className="lg:flex-1" onClick={() => setSheet('add')}>
          <Plus className="h-4 w-4" /> Add asset
        </Button>
        <Button variant="secondary" className="lg:flex-1" onClick={runAudit}>
          <ScanLine className="h-4 w-4" /> Run end-of-day scan audit
        </Button>
      </div>

      <Footnote>Every asset is signed to a truck and a name — scanned at load-out and end of day.</Footnote>

      <Sheet open={!!asset} onClose={close} title="Asset actions">
        {asset && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{asset.name}</div>
                <div className="truncate text-xs text-muted">{asset.tag}</div>
              </div>
              <Badge tone={asset.tone}>{asset.status}</Badge>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="secondary" onClick={toggle}>
                <ArrowLeftRight className="h-4 w-4" />
                {onTruck ? 'Sign out' : 'Mark on truck'}
              </Button>
              {asset.status !== 'MISSING' && (
                <Button variant="danger" onClick={markMissing}>
                  <AlertTriangle className="h-4 w-4" />
                  {confirm === 'missing' ? 'Sure? Tap to confirm' : 'Mark missing'}
                </Button>
              )}
              <Button variant="danger" onClick={removeAsset}>
                <Trash2 className="h-4 w-4" />
                {confirm === 'remove' ? 'Sure? Tap to remove' : 'Remove from registry'}
              </Button>
            </div>
          </div>
        )}
      </Sheet>

      <Sheet open={sheet === 'add'} onClose={close} title="Add asset">
        <form onSubmit={submitAdd} className="flex flex-col gap-4">
          <Field label="Asset name">
            <Input value={form.name} onChange={set('name')} placeholder="Fieldpiece SMAN480V Manifold" required />
          </Field>
          <Field label="Tag ID" hint="Printed on the Bluetooth tag">
            <Input value={form.tag} onChange={set('tag')} placeholder="AST-048" required />
          </Field>
          <Field label="Assigned truck">
            <Select options={TRUCKS} value={form.truck} onChange={set('truck')} />
          </Field>
          <Field label="Replacement value">
            <Input type="number" min="0" step="1" inputMode="numeric" value={form.value} onChange={set('value')} placeholder="549" required />
          </Field>
          <Button variant="primary" type="submit">
            <Plus className="h-4 w-4" /> Add to registry
          </Button>
        </form>
      </Sheet>
    </div>
  )
}
