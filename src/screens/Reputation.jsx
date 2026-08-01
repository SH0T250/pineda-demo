import { useState } from 'react'
import { Star } from 'lucide-react'
import { reputation } from '../data.js'
import { Card, Badge, Avatar, Button, Footnote, ScreenTitle } from '../ui.jsx'

const DRAFT =
  'Thank you, Rick! Getting your AC back on fast is exactly why we do this. We appreciate you trusting Pineda Heating & Air — call us anytime. — Chaun'

export default function Reputation() {
  const [showDraft, setShowDraft] = useState(false)
  const [posted, setPosted] = useState(false)
  const [autoText, setAutoText] = useState(true)

  return (
    <div className="rise-in flex flex-col gap-4">
      <ScreenTitle kicker="Reputation Engine" title="Reviews, handled" />

      <Card className="flex flex-col items-center gap-2 py-6 text-center">
        <div className="tnum font-cond text-6xl font-bold leading-none">{reputation.rating}</div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-amber text-amber" />
          ))}
        </div>
        <div className="text-sm font-semibold">{reputation.total}</div>
        <div className="text-xs text-muted">{reputation.note}</div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        {reputation.channels.map((c) => (
          <Card key={c.name} className="flex items-center justify-between py-3">
            <div className="text-sm font-semibold">{c.name}</div>
            <div className="text-right">
              <div className="tnum font-cond text-lg font-bold leading-none">{c.rating}</div>
              <div className="tnum text-[11px] text-muted">{c.count}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex gap-2">
        {reputation.social.map((s) => (
          <div key={s.name} className="flex flex-1 items-center justify-between rounded-full border border-navy-600/60 bg-navy-800/80 px-4 py-2">
            <span className="text-xs font-bold">{s.name}</span>
            <span className="text-[11px] text-muted">{s.note}</span>
          </div>
        ))}
      </div>

      <Card>
        <div className="flex items-start gap-3">
          <Avatar initials="RD" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-sm font-semibold">{reputation.review.who}</div>
                <div className="text-xs text-muted">{reputation.review.meta}</div>
              </div>
              <Badge tone="red">{reputation.review.badge}</Badge>
            </div>
            <p className="mt-2 text-sm italic leading-relaxed text-ink/90">{reputation.review.text}</p>
          </div>
        </div>

        {showDraft && (
          <div className="mt-3 rounded-xl border border-navy-600 bg-navy-900/80 p-3">
            <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-amber">AI draft</div>
            <p className="text-sm leading-relaxed">{DRAFT}</p>
            <Button primary className="mt-3 w-full" onClick={() => setPosted(true)}>
              {posted ? 'Posted ✓' : 'Post reply'}
            </Button>
          </div>
        )}

        {!showDraft && (
          <div className="mt-3 flex gap-2">
            <Button primary className="flex-1" onClick={() => setShowDraft(true)}>AI-draft reply</Button>
            <Button className="flex-1">Reply</Button>
          </div>
        )}
      </Card>

      <Card className="flex items-center justify-between gap-3" onClick={() => setAutoText(!autoText)}>
        <div className="text-sm font-semibold">Auto-text a review request after each job</div>
        <div className={`relative h-6 w-11 shrink-0 rounded-full transition ${autoText ? 'bg-amber' : 'bg-navy-600'}`}>
          <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-navy-950 transition-all ${autoText ? 'left-[22px]' : 'left-0.5'}`} />
        </div>
      </Card>

      <Footnote>5 stars compound — every job asks for its review automatically.</Footnote>
    </div>
  )
}
