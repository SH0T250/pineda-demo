import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { maria } from '../data.js'
import { Card, Badge, Avatar, Button, Row, Footnote } from '../ui.jsx'

export default function Portal({ go }) {
  const [showSystems, setShowSystems] = useState(false)

  return (
    <div className="rise-in flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Avatar initials={maria.initials} size="h-12 w-12 text-base" />
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber">Client Portal</div>
          <h1 className="font-cond text-3xl font-bold leading-tight">{maria.name}</h1>
          <div className="text-xs text-muted">{maria.since} · {maria.loc}</div>
        </div>
      </div>

      <Card className="flex items-center gap-3 border-amber/30 bg-amber/10">
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-bold uppercase tracking-widest text-amber">Reminder</div>
          <div className="text-sm font-semibold leading-snug">{maria.nudge}</div>
        </div>
        <Button primary className="shrink-0 !px-3 !py-2" onClick={() => go && go('assistant')}>Book</Button>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        {maria.tiles.map((t) => {
          const isBook = t.name === 'Book Service'
          const isEquip = t.name === 'My Equipment'
          return (
            <Card
              key={t.name}
              onClick={isBook ? () => go && go('assistant') : isEquip ? () => setShowSystems((s) => !s) : undefined}
              className="flex flex-col gap-1"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold">{t.name}</div>
                {isBook && <ChevronRight className="h-4 w-4 text-faint" />}
                {isEquip && <ChevronDown className={`h-4 w-4 text-faint transition ${showSystems ? 'rotate-180' : ''}`} />}
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
            <Row key={s.name} left={s.name} sub={s.sub} badge={<Badge tone={s.tone}>{s.tone === 'green' ? 'COVERED' : 'EXPIRED'}</Badge>} />
          ))}
        </Card>
      )}

      <Footnote>Everything about your home's comfort, in one place.</Footnote>
    </div>
  )
}
