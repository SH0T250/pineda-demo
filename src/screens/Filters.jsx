import { useEffect, useState } from 'react'
import { Camera, Loader2, AlertTriangle, Copy, Plus } from 'lucide-react'
import { filterScanResult, filterRetailers, filterHowTo } from '../data.js'
import { Badge, Button, Card, EmptyState, Field, Footnote, Input, Row, ScreenTitle, Select, Sheet, useToast } from '../ui.jsx'
import { useStore, filterDue } from '../store.jsx'

const barBg = { green: 'bg-green', amber: 'bg-amber', red: 'bg-red', muted: 'bg-surface-3' }
const mervSub = { 11: 'catches pollen + pet dander', 13: 'hospital-grade filtration', 8: 'basic dust protection' }
const SCAN_LINES = ['Reading the printed edge…', 'Found a size…']
const TODAY_LABEL = 'Jun 25, 2025'
const SYSTEMS = ['System 1 · Goodman 3-Ton', 'System 2 · Goodman GSX140421']

export default function Filters({ go }) {
  const { db, add, update, remove } = useStore()
  const toast = useToast()
  // sheet: null | {type:'detail'|'howto'|'buy'|'add', id?}
  const [sheet, setSheet] = useState(null)

  const list = [...db.filters].sort((a, b) => (filterDue(a).dueIn ?? 1e9) - (filterDue(b).dueIn ?? 1e9))
  const soonest = list.length ? filterDue(list[0]) : null
  const active = sheet?.id ? db.filters.find((f) => f.id === sheet.id) : null

  const logChange = (f) => {
    update('filters', f.id, {
      sinceChanged: 0,
      lastChangedLabel: TODAY_LABEL,
      log: [{ date: TODAY_LABEL, by: 'customer', note: 'Logged from the app' }, ...f.log],
    })
    toast(`Logged — next due in ${f.intervalDays} days`)
  }

  return (
    <div className="rise-in flex flex-col gap-4">
      <ScreenTitle
        kicker="Air Filters"
        title="Never guess a size again"
        right={soonest && <Badge tone={soonest.tone} pulse>{soonest.status.toUpperCase()}</Badge>}
      />

      <div className="stagger flex flex-col gap-4 lg:grid lg:grid-cols-2">
        {list.length === 0 && (
          <EmptyState
            title="No filters on file yet"
            sub="Snap the edge of any filter and we'll remember the size for you."
          />
        )}
        {list.map((f) => {
          const due = filterDue(f)
          return (
            <Card key={f.id} className="flex flex-col gap-3">
              <button type="button" onClick={() => setSheet({ type: 'detail', id: f.id })} className="w-full text-left">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold">{f.nickname}</div>
                    <div className="truncate text-xs text-muted">{f.system}</div>
                  </div>
                  <Badge tone={due.tone}>{due.status.toUpperCase()}</Badge>
                </div>
                <div className="tnum mt-2 text-sm font-semibold">{f.nominal} · MERV {f.merv}</div>
                <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-surface-1">
                  <div
                    className={`h-full rounded-full ${barBg[due.tone]}`}
                    style={{ width: `${Math.min(100, (f.sinceChanged / f.intervalDays) * 100)}%` }}
                  />
                </div>
              </button>
              <div className="flex gap-2">
                <Button variant="primary" className="flex-1" onClick={() => logChange(f)}>I changed it</Button>
                <Button variant="secondary" className="flex-1" onClick={() => setSheet({ type: 'buy', id: f.id })}>Reorder</Button>
              </div>
            </Card>
          )
        })}
      </div>

      <Button variant="secondary" onClick={() => setSheet({ type: 'add' })}>
        <Plus className="h-4 w-4" /> Add a filter
      </Button>

      <Footnote>Your filter history is documented maintenance — it wins warranty arguments.</Footnote>

      {sheet?.type === 'detail' && active && (
        <DetailSheet
          f={active}
          onClose={() => setSheet(null)}
          onHowTo={() => setSheet({ type: 'howto', id: active.id })}
          onBuy={() => setSheet({ type: 'buy', id: active.id })}
          onRemove={() => {
            remove('filters', active.id)
            setSheet(null)
            toast('Filter removed')
          }}
        />
      )}

      {sheet?.type === 'howto' && active && (
        <HowToSheet f={active} onClose={() => setSheet(null)} go={go} />
      )}

      {sheet?.type === 'buy' && active && (
        <BuySheet
          f={active}
          onClose={() => setSheet(null)}
          onNotSure={() => setSheet({ type: 'detail', id: active.id })}
        />
      )}

      {sheet?.type === 'add' && (
        <AddSheet onClose={() => setSheet(null)} add={add} />
      )}
    </div>
  )
}

// ---- Detail (spec §4.3) ----------------------------------------------------
function DetailSheet({ f, onClose, onHowTo, onBuy, onRemove }) {
  const [armRemove, setArmRemove] = useState(false)
  return (
    <Sheet open title={f.nickname} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-border-1 bg-surface-1 p-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted">Nominal · what's printed on the box</div>
          <div className="tnum font-cond text-4xl font-bold leading-tight">{f.nominal}</div>
          <div className="mt-3 text-[10px] font-bold uppercase tracking-widest text-muted">Actual · what it really measures</div>
          <div className="tnum text-sm font-semibold">{f.actual}</div>
          <p className="mt-2 text-xs leading-relaxed text-muted">That gap is the #1 reason people buy the wrong filter.</p>
        </div>

        <div className="flex flex-col">
          <Row left={`MERV ${f.merv}`} sub={mervSub[f.merv]} />
          <Row left="Type" right={f.ftype} />
          <Row left="Brand · part #" right={f.brand} rightSub={f.pn} />
          <Row left="Airflow" sub={f.arrow} />
          <Row
            left="Source"
            badge={
              <Badge tone={f.confidence === 'High' ? 'green' : 'muted'}>
                {`${f.source}${f.confidence && f.confidence !== '—' ? ' · ' + f.confidence : ''}`.toUpperCase()}
              </Badge>
            }
          />
          <Row left="Keep on hand" sub={f.keepOnHand} />
        </div>

        <div>
          <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted">Change history</div>
          {f.log.map((e, i) => (
            <Row
              key={i}
              left={e.date}
              sub={e.by === 'tech' ? `${e.tech}${e.note ? ' · ' + e.note : ''}` : e.note}
              badge={<Badge tone={e.by === 'tech' ? 'green' : 'muted'}>{e.by === 'tech' ? 'TECH VERIFIED' : 'CUSTOMER'}</Badge>}
            />
          ))}
          <p className="mt-2 text-[11px] text-faint">Tech-verified entries carry weight in a warranty claim.</p>
        </div>

        <div className="flex flex-col gap-2">
          <Button variant="secondary" onClick={onHowTo}>How to change it</Button>
          <Button variant="primary" onClick={onBuy}>Reorder this filter</Button>
          <Button variant="danger" onClick={() => (armRemove ? onRemove() : setArmRemove(true))}>
            {armRemove ? 'Tap again to remove' : 'Remove'}
          </Button>
        </div>
      </div>
    </Sheet>
  )
}

// ---- How-to (spec §4.5) ----------------------------------------------------
function HowToSheet({ f, onClose, go }) {
  return (
    <Sheet open title="How to change it" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          {filterHowTo.steps.map((s, i) => (
            <div key={i} className="flex items-start gap-3 border-b border-border-1 py-2.5 last:border-0">
              <span className="tnum mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-amber/40 bg-amber/15 text-xs font-bold text-amber">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed">{s}</p>
            </div>
          ))}
        </div>

        <Card className="flex items-start gap-3 border-red/30 bg-red/10">
          <AlertTriangle className="h-5 w-5 shrink-0 text-red" />
          <p className="text-sm leading-relaxed text-red">{filterHowTo.warning}</p>
        </Card>

        <Button variant="secondary" onClick={() => go('assistant')}>
          This is harder than I thought — book a tech
        </Button>
      </div>
    </Sheet>
  )
}

// ---- Buy (spec §6) + calendar block (spec §7) ------------------------------
function BuySheet({ f, onClose, onNotSure }) {
  const toast = useToast()
  const [shopped, setShopped] = useState(false)

  const copySize = () => {
    navigator.clipboard.writeText(`${f.nominal} MERV ${f.merv}`).then(() => toast('Size copied')).catch(() => {})
  }

  const shop = (r) => {
    window.open(r.url + encodeURIComponent(`${f.nominal} merv ${f.merv} air filter`), '_blank')
    setShopped(true)
    toast(`${r.name} opened with your size in the search`)
  }

  const addReminder = () => {
    const text = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Pineda OS//EN',
      'BEGIN:VEVENT',
      `UID:${f.id}@pineda-os`,
      'DTSTART;VALUE=DATE:20250705',
      `RRULE:FREQ=DAILY;INTERVAL=${f.intervalDays}`,
      `SUMMARY:Change air filter — ${f.nickname} (${f.nominal})`,
      `DESCRIPTION:${f.nominal} MERV ${f.merv} · ${f.arrow} · How-to in your Pineda OS portal`,
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'ACTION:DISPLAY',
      'DESCRIPTION:Filter due tomorrow',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n')
    const url = URL.createObjectURL(new Blob([text], { type: 'text/calendar' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'pineda-filter-reminder.ics'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    toast('Reminder added — works with Google, Apple & Outlook')
  }

  return (
    <Sheet open title={`Reorder ${f.nominal}`} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-border-1 bg-surface-1 p-4 text-center">
          <div className="tnum font-cond text-3xl font-bold leading-tight">{f.nominal} · MERV {f.merv}</div>
          <div className="tnum mt-1 text-sm font-semibold text-muted">Part # {f.pn}</div>
          <Button variant="secondary" className="mt-3 w-full" onClick={copySize}>
            <Copy className="h-4 w-4" /> Copy size
          </Button>
          <div className="mt-2 text-xs text-muted">{f.keepOnHand}</div>
        </div>

        {filterRetailers.map((r) => (
          <Card key={r.name} className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate text-sm font-bold">{r.name}</div>
              <div className="truncate text-xs text-muted">{r.note}</div>
              <div className="text-[11px] text-green">{r.eta}</div>
            </div>
            <Button variant="secondary" onClick={() => shop(r)}>Shop</Button>
          </Card>
        ))}

        {shopped && (
          <Card glow className="flex flex-col gap-2">
            <div className="text-sm font-bold">Set the reminder for AFTER the box arrives</div>
            <p className="text-xs leading-relaxed text-muted">
              A reminder that fires before the filter shows up gets ignored. This one starts Jul 5 — past delivery — then repeats every {f.intervalDays} days.
            </p>
            <Button variant="primary" onClick={addReminder}>Add reminder to my calendar</Button>
            <Footnote>Works with Google, Apple, and Outlook calendars.</Footnote>
          </Card>
        )}

        <Button variant="ghost" onClick={onNotSure}>Not sure this is right?</Button>
      </div>
    </Sheet>
  )
}

// ---- Snap flow (spec §3) — staged photo-ID with mandatory confirm ----------
function AddSheet({ onClose, add }) {
  const toast = useToast()
  const [phase, setPhase] = useState('intro') // intro | scanning | confirm | manual
  const [line, setLine] = useState(0)
  const [form, setForm] = useState({ nominal: '', merv: '11', nickname: '', system: SYSTEMS[0] })

  useEffect(() => {
    if (phase !== 'scanning') return
    setLine(0)
    const t1 = setTimeout(() => setLine(1), 900)
    const t2 = setTimeout(() => setPhase('confirm'), 1600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [phase])

  const s = filterScanResult
  const baseRecord = {
    qty: 1,
    baseDays: 60,
    intervalDays: 45,
    sinceChanged: 0,
    lastChangedLabel: TODAY_LABEL,
    modifiers: ['Pets in home · −25%'],
    arrow: 'Check the arrow printed on the frame',
  }

  const confirmScan = () => {
    add('filters', {
      ...baseRecord,
      nickname: 'New filter',
      system: 'System 1',
      nominal: s.nominal,
      actual: s.actual,
      thickness: s.thickness,
      ftype: s.ftype,
      merv: s.merv,
      brand: s.brand,
      pn: s.pn,
      source: 'Photo identified',
      confidence: 'High',
      keepOnHand: 'A 6-pack is about a year for you',
      log: [{ date: TODAY_LABEL, by: 'customer', note: 'Photo identified' }],
    })
    toast('Filter added — next due in 45 days')
    onClose()
  }

  const saveManual = () => {
    add('filters', {
      ...baseRecord,
      nickname: form.nickname.trim() || 'New filter',
      system: form.system,
      nominal: form.nominal.trim(),
      actual: '—',
      thickness: '',
      ftype: '—',
      merv: Number(form.merv),
      brand: '—',
      pn: '—',
      source: 'Manually entered',
      confidence: '—',
      keepOnHand: '—',
      log: [{ date: TODAY_LABEL, by: 'customer', note: 'Manually entered' }],
    })
    toast('Filter added — next due in 45 days')
    onClose()
  }

  return (
    <Sheet open title="Add a filter" onClose={onClose}>
      {phase === 'intro' && (
        <div className="flex flex-col gap-4">
          <p className="text-sm leading-relaxed text-muted">
            One photo is all it takes. <span className="font-semibold text-ink">Photograph the EDGE of the filter where the size is printed</span> — that strip tells us the size, brand, and MERV.
          </p>
          <Card
            onClick={() => setPhase('scanning')}
            className="flex flex-col items-center gap-3 border-2 border-dashed border-navy-600 bg-surface-1/60 py-10"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-amber/40 bg-amber/15">
              <Camera className="h-7 w-7 text-amber" />
            </div>
            <div className="text-sm font-bold">Snap the filter edge</div>
            <div className="text-xs text-faint">Tap to open the camera</div>
          </Card>
          <Button variant="ghost" onClick={() => setPhase('manual')}>Type it in instead</Button>
        </div>
      )}

      {phase === 'scanning' && (
        <Card className="flex flex-col items-center gap-3 py-12">
          <Loader2 className="h-8 w-8 animate-spin text-amber" />
          <div className="text-sm font-bold">Reading your photo…</div>
          <div className="text-xs text-muted">{SCAN_LINES[line]}</div>
        </Card>
      )}

      {phase === 'confirm' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-bold">We read {s.nominal} — is that right?</div>
            <Badge tone="green">HIGH CONFIDENCE · text was legible</Badge>
          </div>
          <div className="rounded-2xl border border-border-1 bg-surface-1 p-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted">Size we read</div>
            <div className="tnum font-cond text-4xl font-bold leading-tight">{s.nominal}</div>
            <div className="mt-2 flex flex-col">
              <Row left="Actual size" right={s.actual} />
              <Row left="MERV" right={s.merv} />
              <Row left="Brand" right={s.brand} />
              <Row left="Part #" right={s.pn} />
              <Row left="Type" right={s.ftype} />
            </div>
          </div>
          <Button variant="primary" onClick={confirmScan}>That's right</Button>
          <Button
            variant="secondary"
            onClick={() => {
              setForm({ nominal: s.nominal, merv: String(s.merv), nickname: 'New filter', system: SYSTEMS[0] })
              setPhase('manual')
            }}
          >
            Not quite — fix it
          </Button>
        </div>
      )}

      {phase === 'manual' && (
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-border-1 bg-surface-1 p-3 text-xs leading-relaxed text-muted">
            <span className="font-bold text-ink">Measure the SLOT, not the filter.</span> Round up to the nearest whole inch. The nominal size (like 20x25x1) is the name on the label — the filter itself runs about a half inch smaller.
          </div>
          <Field label="Nominal size" hint="The size printed on the frame, like 20x25x1">
            <Input
              placeholder="e.g. 20x25x1"
              value={form.nominal}
              onChange={(e) => setForm({ ...form, nominal: e.target.value })}
            />
          </Field>
          <Field label="MERV rating" hint="11 is right for most homes with pets">
            <Select
              value={form.merv}
              onChange={(e) => setForm({ ...form, merv: e.target.value })}
              options={[
                { value: '8', label: 'MERV 8' },
                { value: '11', label: 'MERV 11' },
                { value: '13', label: 'MERV 13' },
              ]}
            />
          </Field>
          <Field label="Nickname">
            <Input
              placeholder="e.g. Upstairs · hallway ceiling"
              value={form.nickname}
              onChange={(e) => setForm({ ...form, nickname: e.target.value })}
            />
          </Field>
          <Field label="System">
            <Select
              value={form.system}
              onChange={(e) => setForm({ ...form, system: e.target.value })}
              options={SYSTEMS}
            />
          </Field>
          <Button variant="primary" disabled={!form.nominal.trim()} onClick={saveManual}>Save filter</Button>
        </div>
      )}
    </Sheet>
  )
}
