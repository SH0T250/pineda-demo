// Schedule — day timeline, week grid, month density. Jobs CRUD via store.
import { useState } from 'react'
import { Plus, CalendarDays } from 'lucide-react'
import { ScreenTitle, Card, Badge, Button, Segmented, Sheet, Field, Input, Select, useToast, EmptyState } from '../ui.jsx'
import { useStore } from '../store.jsx'
import { weekStrip, techs, money } from '../data.js'

const toMin = (t) => {
  const m = /^(\d+):(\d+)([ap])/.exec(t)
  if (!m) return 0
  return ((+m[1] % 12) + (m[3] === 'p' ? 12 : 0)) * 60 + +m[2]
}

// 7:00a..6:00p half-hour slots
const SLOTS = []
for (let m = 7 * 60; m <= 18 * 60; m += 30) {
  const h = Math.floor(m / 60)
  SLOTS.push(`${((h + 11) % 12) + 1}:${String(m % 60).padStart(2, '0')}${h < 12 ? 'a' : 'p'}`)
}

// static plausible chips for non-Wed days in Week view
const GHOSTS = {
  MON: ['9:00a', '1:30p'],
  TUE: ['8:00a', '10:30a', '2:00p', '4:30p'],
  THU: ['9:30a', '12:00p', '3:00p'],
  FRI: ['8:00a', '9:30a', '11:00a', '1:00p', '3:30p'],
  SAT: ['10:00a'],
  SUN: [],
}

// June 2025 job density, index 0 = Sun Jun 1 (0-3 dots per day)
const MONTH_DOTS = [0,2,3,2,3,3,1, 0,3,2,2,3,2,1, 0,2,3,3,2,3,1, 0,2,3,3,2,3,1, 0,2]

const emptyForm = { client: '', task: '', time: '8:00a', tech: techs[0].name, addr: '' }

function Info({ label, value, span }) {
  return (
    <div className={span ? 'col-span-2' : ''}>
      <div className="text-[10px] font-bold uppercase tracking-widest text-muted">{label}</div>
      <div className="tnum text-sm font-semibold">{value}</div>
    </div>
  )
}

function JobBadge({ job }) {
  if (job.done) return <Badge tone="green">DONE</Badge>
  if (job.aiBooked) return <Badge tone="amber" pulse>AI BOOKED</Badge>
  return <Badge tone="amber">SCHEDULED</Badge>
}

export default function Schedule({ go }) {
  const { db, update, remove, add } = useStore()
  const toast = useToast()
  const [view, setView] = useState('Day')
  const [selId, setSelId] = useState(null)
  const [completing, setCompleting] = useState(false)
  const [rev, setRev] = useState('')
  const [profit, setProfit] = useState('')
  const [confirmDel, setConfirmDel] = useState(false)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const jobs = [...db.jobs].sort((a, b) => toMin(a.time) - toMin(b.time))
  const sel = db.jobs.find((j) => j.id === selId)

  const closeDetail = () => { setSelId(null); setCompleting(false); setConfirmDel(false); setRev(''); setProfit('') }

  const markComplete = () => {
    update('jobs', sel.id, { done: true, rev: +rev || 0, profit: +profit || 0 })
    toast(`${sel.client} marked complete`)
    closeDetail()
  }

  const removeJob = () => {
    remove('jobs', sel.id)
    toast('Job removed')
    closeDetail()
  }

  const addJob = () => {
    add('jobs', { ...form, parts: '—', rev: 0, profit: 0, done: false })
    toast(`Job added · ${form.time}`)
    setForm(emptyForm)
    setAdding(false)
  }

  const chipTone = (j) =>
    j.done ? 'border-green/30 bg-green/10 text-green' : 'border-amber/30 bg-amber/10 text-amber'

  return (
    <div className="rise-in flex flex-col gap-4">
      <ScreenTitle
        kicker="Schedule"
        title="Your week, mapped"
        right={
          <Button variant="primary" onClick={() => setAdding(true)}>
            <Plus className="h-4 w-4" /> New Job
          </Button>
        }
      />

      <Segmented options={['Day', 'Week', 'Month']} value={view} onChange={setView} />

      {view === 'Day' && (
        <>
          <div className="grid grid-cols-7 gap-1.5">
            {weekStrip.map((d) => (
              <div key={d.d} className={`flex flex-col items-center rounded-xl py-2 ${d.active ? 'bg-amber/10 text-amber ring-1 ring-amber/40' : 'text-muted'}`}>
                <div className="text-[10px] font-bold tracking-widest">{d.d}</div>
                <div className="tnum text-sm font-bold">{d.n}</div>
              </div>
            ))}
          </div>

          {jobs.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="Nothing on the books"
              sub="Add a job to build out today's route."
              action={<Button variant="primary" onClick={() => setAdding(true)}><Plus className="h-4 w-4" /> New Job</Button>}
            />
          ) : (
            <div className="stagger flex flex-col gap-2.5">
              {jobs.map((j) => (
                <div key={j.id} className="flex items-start gap-3">
                  <div className={`tnum w-12 shrink-0 pt-4 text-right text-xs font-bold ${j.done ? 'text-faint' : 'text-amber'}`}>{j.time}</div>
                  <Card onClick={() => setSelId(j.id)} glow={j.aiBooked && !j.done} className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-bold">{j.client} — {j.task}</div>
                        <div className="truncate text-xs text-muted">{j.tech} · {j.addr}</div>
                      </div>
                      <JobBadge job={j} />
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {view === 'Week' && (
        <Card>
          <div className="stagger grid grid-cols-7 gap-1.5">
            {weekStrip.map((d) => (
              <button key={d.d} onClick={() => setView('Day')} className="flex min-h-11 flex-col gap-1.5 rounded-xl p-1 text-left transition hover:bg-surface-3/50">
                <div className={`flex w-full flex-col items-center rounded-lg py-1.5 ${d.active ? 'bg-amber/10 text-amber ring-1 ring-amber/40' : 'text-muted'}`}>
                  <div className="text-[9px] font-bold tracking-widest">{d.d}</div>
                  <div className="tnum text-sm font-bold">{d.n}</div>
                </div>
                <div className="flex min-h-24 w-full flex-col gap-1">
                  {d.active
                    ? jobs.map((j) => (
                        <div key={j.id} className={`tnum rounded-md border px-1 py-1 text-center text-[10px] font-bold ${chipTone(j)}`}>
                          {j.time}
                        </div>
                      ))
                    : GHOSTS[d.d].map((t) => (
                        <div key={t} className="tnum rounded-md bg-surface-3/70 px-1 py-1 text-center text-[10px] font-semibold text-faint">
                          {t}
                        </div>
                      ))}
                </div>
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-center gap-4 border-t border-border-1 pt-3 text-[11px] text-muted">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-green" /> Done</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber/60" /> Scheduled</span>
            <span className="flex items-center gap-1.5"><span className="pulse-dot h-2 w-2 rounded-full bg-amber" /> AI booked</span>
          </div>
        </Card>
      )}

      {view === 'Month' && (
        <Card>
          <div className="mb-3 flex items-baseline justify-between">
            <div className="font-cond text-lg font-bold">June 2025</div>
            <div className="tnum text-[11px] text-muted">62 jobs this month</div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d) => (
              <div key={d} className="pb-1 text-center text-[9px] font-bold tracking-widest text-faint">{d}</div>
            ))}
            {MONTH_DOTS.map((dots, i) => {
              const day = i + 1
              const today = day === 25
              return (
                <div key={day} className={`flex h-11 flex-col items-center justify-center gap-1 rounded-lg ${today ? 'bg-amber/10 ring-1 ring-amber' : 'bg-surface-1/60'}`}>
                  <div className={`tnum text-xs font-bold ${today ? 'text-amber' : ''}`}>{day}</div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: dots }).map((_, k) => (
                      <span key={k} className={`h-1 w-1 rounded-full ${today ? 'bg-amber' : 'bg-muted/50'}`} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Job detail */}
      <Sheet open={!!sel} onClose={closeDetail} title={sel?.client || ''}>
        {sel && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-bold">{sel.task}</div>
              <JobBadge job={sel} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Info label="Time" value={sel.time} />
              <Info label="Tech" value={sel.tech} />
              <Info label="Address" value={sel.addr} span />
              <Info label="Parts" value={sel.parts || '—'} />
              {sel.done && <Info label="Revenue · Profit" value={`${money(sel.rev)} · ${money(sel.profit)}`} />}
            </div>

            {completing ? (
              <div className="flex flex-col gap-3">
                <Field label="Revenue">
                  <Input type="number" inputMode="decimal" placeholder="0" value={rev} onChange={(e) => setRev(e.target.value)} />
                </Field>
                <Field label="Profit">
                  <Input type="number" inputMode="decimal" placeholder="0" value={profit} onChange={(e) => setProfit(e.target.value)} />
                </Field>
                <div className="flex gap-2">
                  <Button variant="primary" className="flex-1" onClick={markComplete}>Save complete</Button>
                  <Button variant="ghost" onClick={() => setCompleting(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                {!sel.done && (
                  <Button variant="primary" className="flex-1" onClick={() => setCompleting(true)}>Mark complete</Button>
                )}
                <Button variant="danger" className={sel.done ? 'flex-1' : ''} onClick={() => (confirmDel ? removeJob() : setConfirmDel(true))}>
                  {confirmDel ? 'Sure?' : 'Remove'}
                </Button>
              </div>
            )}
          </div>
        )}
      </Sheet>

      {/* New job */}
      <Sheet open={adding} onClose={() => setAdding(false)} title="New Job">
        <div className="flex flex-col gap-3">
          <Field label="Client">
            <Input placeholder="Last name, First" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} />
          </Field>
          <Field label="Task">
            <Input placeholder="e.g. Capacitor swap" value={form.task} onChange={(e) => setForm({ ...form, task: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Time">
              <Select options={SLOTS} value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            </Field>
            <Field label="Tech">
              <Select options={techs.map((t) => t.name)} value={form.tech} onChange={(e) => setForm({ ...form, tech: e.target.value })} />
            </Field>
          </div>
          <Field label="Address">
            <Input placeholder="Street, city" value={form.addr} onChange={(e) => setForm({ ...form, addr: e.target.value })} />
          </Field>
          <Button variant="primary" disabled={!form.client.trim() || !form.task.trim()} onClick={addJob}>
            Add to schedule
          </Button>
        </div>
      </Sheet>
    </div>
  )
}
