import { useState } from 'react'
import { Star, Camera, Briefcase, Sparkles, Check, MessageSquare } from 'lucide-react'
import { reputation } from '../data.js'
import { Badge, Card, ScreenTitle, Avatar, Button, Row, Footnote, useToast } from '../ui.jsx'

const DRAFT =
  "Thanks, Rick — glad we could get your AC back up that fast, that's exactly how we like to run a call. We keep pricing fair and paperwork same-day, and we'll be here whenever you need us again."

export default function Reputation() {
  const toast = useToast()
  const [replyState, setReplyState] = useState('idle') // idle | drafted | posted
  const [autoText, setAutoText] = useState(true)

  const toggleAuto = () => {
    setAutoText((v) => {
      toast(v ? 'Review requests paused' : 'Review requests back on')
      return !v
    })
  }

  return (
    <div className="rise-in flex flex-col gap-4">
      <ScreenTitle kicker="Reputation Engine" title="Reviews, handled" />

      <div className="stagger flex flex-col gap-4">
        {/* Hero */}
        <Card glow className="flex flex-col items-center gap-2 py-6 text-center">
          <div className="tnum font-cond text-[64px] font-bold leading-none">{reputation.rating}</div>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} className="h-5 w-5 fill-amber text-amber" />
            ))}
          </div>
          <div className="text-sm text-muted">
            <span className="tnum font-semibold text-ink">{reputation.total}</span> · {reputation.note}
          </div>
        </Card>

        {/* Channels */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {reputation.channels.map((c) => (
            <Card key={c.name} className="flex flex-col gap-0.5 !p-3">
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted">{c.name}</div>
              <div className="tnum font-cond text-xl font-bold">{c.rating}</div>
              <div className="tnum text-[11px] text-muted">{c.count} reviews</div>
            </Card>
          ))}
        </div>

        {/* Social chips */}
        <div className="flex flex-wrap gap-2">
          {reputation.social.map((s) => (
            <span key={s.name} className="inline-flex items-center gap-2 rounded-full border border-border-2 bg-surface-2 px-3.5 py-2 text-xs font-semibold">
              {s.name === 'Instagram' ? <Camera className="h-3.5 w-3.5 text-amber" /> : <Briefcase className="h-3.5 w-3.5 text-amber" />}
              {s.name}
              <span className="tnum font-normal text-muted">{s.note}</span>
            </span>
          ))}
        </div>

        {/* Review needing reply */}
        <Card className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Avatar initials="RD" />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold">{reputation.review.who}</div>
              <div className="text-xs text-muted">{reputation.review.meta}</div>
            </div>
            {replyState === 'posted'
              ? <Badge tone="green">POSTED</Badge>
              : <Badge tone="red" pulse>{reputation.review.badge}</Badge>}
          </div>
          <p className="text-sm italic leading-relaxed text-muted">{reputation.review.text}</p>

          {replyState !== 'idle' && (
            <div className="fade-in rounded-xl border border-border-1 bg-surface-1 p-3.5">
              <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber">
                <Sparkles className="h-3 w-3" /> AI draft
              </div>
              <p className="text-sm leading-relaxed">{DRAFT}</p>
            </div>
          )}

          <div className="flex gap-2">
            {replyState === 'idle' && (
              <>
                <Button variant="primary" className="flex-1" onClick={() => setReplyState('drafted')}>
                  <Sparkles className="h-4 w-4" /> AI-draft reply
                </Button>
                <Button variant="secondary" onClick={() => toast('Opening reply on Google')}>
                  <MessageSquare className="h-4 w-4" /> Reply
                </Button>
              </>
            )}
            {replyState === 'drafted' && (
              <Button variant="primary" className="flex-1" onClick={() => { setReplyState('posted'); toast('Reply posted to Google') }}>
                Post reply
              </Button>
            )}
            {replyState === 'posted' && (
              <div className="flex min-h-11 flex-1 items-center justify-center gap-2 text-sm font-bold text-green">
                <Check className="h-4 w-4" /> Posted
              </div>
            )}
          </div>
        </Card>

        {/* Auto-request toggle */}
        <Card>
          <Row
            left="Auto-text a review request after each job"
            sub={autoText ? 'On — sends 30 min after job close' : 'Off'}
            right={
              <button
                role="switch"
                aria-checked={autoText}
                aria-label="Auto-text review requests"
                onClick={toggleAuto}
                className="-m-2 rounded-full p-2"
              >
                <span className={`relative block h-7 w-12 rounded-full border transition ${autoText ? 'border-amber/60 bg-amber' : 'border-border-2 bg-surface-1'}`}>
                  <span className={`absolute top-0.5 h-[22px] w-[22px] rounded-full transition-all ${autoText ? 'left-[22px] bg-navy-950' : 'left-0.5 bg-muted'}`} />
                </span>
              </button>
            }
          />
        </Card>
      </div>

      <Footnote>5 stars compound — every job asks for its review automatically.</Footnote>
    </div>
  )
}
