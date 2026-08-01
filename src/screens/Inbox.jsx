import { useState } from 'react'
import { PhoneCall } from 'lucide-react'
import { inbox } from '../data.js'
import { Badge, Button, Card, Footnote, ScreenTitle } from '../ui.jsx'

export default function Inbox() {
  const [booked, setBooked] = useState(false)
  return (
    <div className="rise-in flex flex-col gap-4">
      <ScreenTitle kicker="Inbox · AI Answering Service" title="Never miss a call" />

      <Card className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-green/40 bg-green/15">
          <PhoneCall className="h-4 w-4 text-green" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm font-bold">Pineda AI Agent</div>
            <Badge tone="green" pulse>LIVE</Badge>
          </div>
          <div className="tnum text-xs text-muted">{inbox.stats}</div>
        </div>
      </Card>

      {inbox.items.map((item) => (
        <Card key={item.who} className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="truncate text-sm font-bold">{item.who}</div>
              <div className="text-[11px] text-muted">{item.meta}</div>
            </div>
            <Badge tone={item.tone}>{item.badge}</Badge>
          </div>
          <p className="text-sm italic leading-relaxed text-ink/90">{item.text}</p>
          {item.note && <div className="text-xs font-semibold text-green">{item.note}</div>}
          {item.actions.length > 0 && (
            <div className="mt-1 flex gap-2">
              {item.actions.map((action, i) => {
                const isBookBtn = action === 'Book this afternoon'
                return (
                  <Button
                    key={action}
                    primary={i === 0}
                    className="flex-1"
                    onClick={isBookBtn ? () => setBooked(true) : undefined}
                  >
                    {isBookBtn && booked ? 'Booked · added to schedule ✓' : action}
                  </Button>
                )
              })}
            </div>
          )}
        </Card>
      ))}

      <Footnote>AI answers every call, books the job, and texts the customer a confirmation.</Footnote>
    </div>
  )
}
