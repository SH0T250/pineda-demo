import { useState } from 'react'
import { Mic, Phone, Sparkles } from 'lucide-react'
import { assistant, assistantOffer } from '../data.js'
import { Card, Badge, Button, Footnote } from '../ui.jsx'

export default function Assistant() {
  const [booked, setBooked] = useState(false)
  return (
    <div className="rise-in flex flex-col gap-4">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber">AI Voice Assistant</div>
          <h1 className="font-cond text-3xl font-bold leading-tight">Always answering.</h1>
        </div>
        <Badge tone="green" pulse>ON CALL</Badge>
      </div>

      <Card className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber/40 bg-amber/15">
          <Phone className="h-4 w-4 text-amber" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold">Incoming call · Maria G.</div>
          <div className="text-xs text-muted">Answered on ring 1 · transcribed live</div>
        </div>
      </Card>

      <div className="flex flex-col gap-3">
        {assistant.map((m, i) =>
          m.from === 'them' ? (
            <div key={i} className="flex flex-col items-end gap-1.5 self-end">
              {m.tag && <Badge tone="red">{m.tag.toUpperCase()}</Badge>}
              <div className="max-w-[85%] rounded-2xl rounded-br-md bg-navy-700 px-4 py-3 text-sm leading-relaxed">
                {m.text}
              </div>
            </div>
          ) : (
            <div key={i} className="max-w-[85%] self-start">
              <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-amber">
                <Sparkles className="h-3 w-3" /> PINEDA AI
              </div>
              <div className="rounded-2xl rounded-bl-md border border-amber/30 bg-amber/5 px-4 py-3 text-sm leading-relaxed">
                {m.text}
              </div>
            </div>
          )
        )}
      </div>

      <Card>
        <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted">Next open slot</div>
        <div className="font-cond text-xl font-bold">{assistantOffer.slot}</div>
        <div className="mb-3 text-xs text-muted">{assistantOffer.desc}</div>
        <Button primary className="w-full" onClick={() => setBooked(true)}>
          {booked ? 'Booked ✓ · Chaun is on his way at 3:30' : 'Confirm'}
        </Button>
      </Card>

      <div className="flex items-center gap-3 rounded-2xl border border-navy-600/60 bg-navy-800/50 px-4 py-3">
        <span className="flex-1 text-sm text-faint">Message Pineda AI…</span>
        <Mic className="h-5 w-5 text-amber" />
      </div>

      <Footnote>Your front desk never sleeps, never misses, never puts anyone on hold.</Footnote>
    </div>
  )
}
