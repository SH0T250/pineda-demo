import { useState } from 'react'
import { ChevronDown, ChevronRight, FileText } from 'lucide-react'
import { maria, money } from '../data.js'
import { Card, Badge, Avatar, Button, Row, Footnote, Sheet, useToast } from '../ui.jsx'

const CHANNELS = ['Google', 'Facebook', 'Yelp', 'Nextdoor']

const PAST_INVOICES = [
  { desc: 'Condenser replacement', date: 'Jun 10, 2025', amt: 2040 },
  { desc: 'Spring tune-up', date: 'Mar 04, 2025', amt: 189 },
  { desc: 'System 1 install · Goodman 3-Ton', date: 'Sep 12, 2024', amt: 8650 },
]

const DOCS = [
  { name: 'Goodman GLXS4BA · Install manual', sub: 'PDF · 4.2 MB' },
  { name: 'Goodman GLXS4BA · Warranty certificate', sub: 'Registered Sep 2024' },
  { name: 'Goodman CAPF37 coil · Install manual', sub: 'PDF · 2.8 MB' },
  { name: 'ecobee Smart Pro · User guide', sub: 'PDF · 1.9 MB' },
  { name: 'AHRI matched-system certificate', sub: 'Cert #202451188' },
  { name: 'System 2 · GSX140421 spec sheet', sub: 'PDF · 1.1 MB' },
  { name: 'Invoice · Condenser replacement', sub: 'Jun 10, 2025' },
  { name: 'Warranty registration confirmation', sub: 'Goodman · 10-yr parts' },
]

export default function Portal({ go }) {
  const [showSystems, setShowSystems] = useState(false)
  const [sheet, setSheet] = useState(null) // 'review' | 'pay' | 'docs'
  const toast = useToast()

  const tileAction = {
    'Book Service': () => go && go('assistant'),
    'My Equipment': () => setShowSystems((s) => !s),
    'Leave a Review': () => setSheet('review'),
    'Invoices & Pay': () => setSheet('pay'),
    Documents: () => setSheet('docs'),
  }

  return (
    <div className="rise-in flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Avatar initials={maria.initials} size="h-14 w-14 text-lg" />
        <div className="min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber">Client Portal</div>
          <h1 className="truncate font-cond text-3xl font-bold leading-tight">{maria.name}</h1>
          <div className="text-xs text-muted">{maria.since} · {maria.loc}</div>
        </div>
      </div>

      <Card glow className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-bold uppercase tracking-widest text-amber">Reminder</div>
          <div className="text-sm font-semibold leading-snug">{maria.nudge}</div>
        </div>
        <Button variant="primary" className="shrink-0" onClick={() => go && go('assistant')}>Book</Button>
      </Card>

      <div className="stagger grid grid-cols-2 gap-3 lg:grid-cols-3">
        {maria.tiles.map((t) => {
          const onClick = tileAction[t.name]
          const isEquip = t.name === 'My Equipment'
          return (
            <Card key={t.name} onClick={onClick} className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <div className="truncate text-sm font-bold">{t.name}</div>
                {isEquip ? (
                  <ChevronDown className={`h-4 w-4 shrink-0 text-faint transition ${showSystems ? 'rotate-180' : ''}`} />
                ) : onClick ? (
                  <ChevronRight className="h-4 w-4 shrink-0 text-faint" />
                ) : null}
              </div>
              <div className="text-[11px] text-muted">{t.sub}</div>
            </Card>
          )
        })}
      </div>

      {showSystems && (
        <Card className="rise-in">
          <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted">My Equipment</div>
          {maria.systems.map((s) => (
            <Row
              key={s.name}
              left={s.name}
              sub={s.sub}
              badge={<Badge tone={s.tone}>{s.tone === 'green' ? 'COVERED' : 'LABOR EXPIRED'}</Badge>}
            />
          ))}
        </Card>
      )}

      <Footnote>Everything about your home's comfort, in one place.</Footnote>

      <Sheet open={sheet === 'review'} onClose={() => setSheet(null)} title="Leave a review">
        <p className="mb-4 text-sm text-muted">One tap — we'll take you straight there. Every review earns $25 off your next visit.</p>
        <div className="flex flex-col gap-2">
          {CHANNELS.map((c) => (
            <Button
              key={c}
              className="w-full"
              onClick={() => { setSheet(null); toast('Thanks Maria — $25 off your next visit') }}
            >
              Review on {c}
            </Button>
          ))}
        </div>
      </Sheet>

      <Sheet open={sheet === 'pay'} onClose={() => setSheet(null)} title="Invoices & Pay">
        <div className="mb-4 flex flex-col items-center gap-1 rounded-2xl border border-border-1 bg-surface-1 py-6 text-center">
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted">Balance due</div>
          <div className="tnum font-cond text-5xl font-bold leading-none">$0</div>
          <div className="mt-1"><Badge tone="green" pulse>AUTOPAY ON</Badge></div>
        </div>
        <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted">Past invoices</div>
        {PAST_INVOICES.map((i) => (
          <Row key={i.desc} left={i.desc} sub={i.date} right={money(i.amt)} badge={<Badge tone="green">PAID</Badge>} />
        ))}
      </Sheet>

      <Sheet open={sheet === 'docs'} onClose={() => setSheet(null)} title="Documents">
        {DOCS.map((d) => (
          <Row
            key={d.name}
            left={
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4 shrink-0 text-faint" />
                <span className="truncate">{d.name}</span>
              </span>
            }
            sub={d.sub}
            onClick={() => toast('Opening — saved to your phone')}
          />
        ))}
      </Sheet>
    </div>
  )
}
