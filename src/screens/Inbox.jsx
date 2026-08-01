// Inbox — AI answering service. Calls the agent handled, with one-tap booking.
import { PhoneCall } from 'lucide-react'
import { inbox } from '../data.js'
import { Badge, Button, Card, Footnote, ScreenTitle, useToast } from '../ui.jsx'
import { useStore } from '../store.jsx'

export default function Inbox() {
  const { db, add } = useStore()
  const toast = useToast()

  // Derived from db so it survives reloads and can't double-book.
  const mariaBooked = db.jobs.some((j) => j.client === 'Maria G.' && j.aiBooked)

  const bookMaria = () => {
    if (mariaBooked) {
      toast('Already on today’s schedule · 5:00p')
      return
    }
    add('jobs', {
      time: '5:00p', client: 'Maria G.', task: 'AC not cooling — capacitor diag', tech: 'Chaun P.',
      addr: '415 Oak Run', parts: '—', rev: 0, profit: 0, done: false, aiBooked: true,
    })
    toast('Booked — added to today 5:00p')
  }

  const actionFor = (label) => {
    if (label === 'Book this afternoon') return bookMaria
    if (label === 'Call back') return () => toast('Calling Maria…')
    return () => toast(label)
  }

  return (
    <div className="rise-in flex flex-col gap-4">
      <ScreenTitle kicker="Inbox · AI Answering Service" title="Never miss a call" />

      <Card raised className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-amber/40 bg-amber/15">
          <PhoneCall className="h-5 w-5 text-amber" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="truncate text-sm font-bold">Pineda AI Agent</div>
            <Badge tone="green" pulse>LIVE</Badge>
          </div>
          <div className="tnum truncate text-xs text-muted">{inbox.stats}</div>
        </div>
      </Card>

      <div className="stagger flex flex-col gap-3">
        {inbox.items.map((item) => (
          <Card key={item.who} className="flex flex-col gap-2.5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-bold">{item.who}</div>
                <div className="tnum text-xs text-muted">{item.meta}</div>
              </div>
              <Badge tone={item.tone}>{item.badge}</Badge>
            </div>
            <p className="text-sm italic leading-relaxed text-ink/90">{item.text}</p>
            {item.note && <div className="text-xs font-semibold text-green">{item.note}</div>}
            {item.actions.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-2">
                {item.actions.map((label) => {
                  const isBook = label === 'Book this afternoon'
                  return (
                    <Button
                      key={label}
                      variant={isBook ? 'primary' : 'secondary'}
                      className="flex-1"
                      onClick={actionFor(label)}
                    >
                      {isBook && mariaBooked ? 'On the schedule ✓' : label}
                    </Button>
                  )
                })}
              </div>
            )}
          </Card>
        ))}
      </div>

      <Footnote>AI answers every call, books the job, and texts the customer a confirmation.</Footnote>
    </div>
  )
}
