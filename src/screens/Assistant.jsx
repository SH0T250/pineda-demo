// AI Voice Assistant — live call transcript with one-tap booking.
import { Mic, PhoneCall, Sparkles } from 'lucide-react'
import { assistant, assistantOffer } from '../data.js'
import { Badge, Button, Card, Footnote, ScreenTitle, useToast } from '../ui.jsx'
import { useStore } from '../store.jsx'

export default function Assistant() {
  const { db, add } = useStore()
  const toast = useToast()

  // Derived from db so it survives reloads and can't double-book (same as Inbox).
  const booked = db.jobs.some((j) => j.client === 'Maria G.' && j.aiBooked)

  const confirm = () => {
    if (booked) {
      toast('Already booked · today 5:00p')
      return
    }
    add('jobs', {
      time: '5:00p', client: 'Maria G.', task: 'AC not cooling — capacitor diag', tech: 'Chaun P.',
      addr: '415 Oak Run', parts: '—', rev: 0, profit: 0, done: false, aiBooked: true,
    })
    toast('Booked · Chaun arrives 5:00p')
  }

  return (
    <div className="rise-in flex flex-col gap-4">
      <ScreenTitle
        kicker="AI Voice Assistant"
        title="Always answering."
        right={<Badge tone="green" pulse>ON CALL</Badge>}
      />

      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start">
        <div className="flex flex-col gap-4">
          <Card raised className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-amber/40 bg-amber/15">
              <PhoneCall className="h-5 w-5 text-amber" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-bold">Incoming call · Maria G.</div>
              <div className="truncate text-xs text-muted">Answered on ring 1 · transcribed live</div>
            </div>
          </Card>

          <div className="stagger flex flex-col gap-3">
            {assistant.map((m, i) =>
              m.from === 'ai' ? (
                <div key={i} className="max-w-[85%] self-start rounded-2xl rounded-bl-md border border-amber/25 bg-amber/8 px-3.5 py-2.5">
                  <div className="mb-1 flex items-center gap-1 text-[9px] font-bold tracking-[0.18em] text-amber">
                    <Sparkles className="h-3 w-3" />
                    PINEDA AI
                  </div>
                  <p className="text-sm leading-relaxed">{m.text}</p>
                </div>
              ) : (
                <div key={i} className="flex max-w-[85%] flex-col items-end gap-1.5 self-end">
                  {m.tag && <Badge tone="red">{m.tag}</Badge>}
                  <div className="rounded-2xl rounded-br-md bg-surface-3 px-3.5 py-2.5 text-sm leading-relaxed">
                    {m.text}
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Card glow className="flex flex-col gap-3">
            <div className="text-[10px] font-bold uppercase tracking-widest text-amber">Next open slot</div>
            <div>
              <div className="tnum font-cond text-2xl font-bold leading-tight">{assistantOffer.slot}</div>
              <div className="tnum text-xs text-muted">{assistantOffer.desc}</div>
            </div>
            <Button variant="primary" onClick={confirm}>
              {booked ? 'Booked ✓ · Chaun arrives 5:00p' : 'Confirm this slot'}
            </Button>
          </Card>

          <div className="flex min-h-11 items-center gap-3 rounded-full border border-border-1 bg-surface-1 py-1.5 pl-4 pr-1.5">
            <span className="flex-1 truncate text-sm text-faint">Message Pineda AI…</span>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber">
              <Mic className="h-4 w-4 text-navy-950" />
            </div>
          </div>
        </div>
      </div>

      <Footnote>Your front desk never sleeps, never misses, never puts anyone on hold.</Footnote>
    </div>
  )
}
