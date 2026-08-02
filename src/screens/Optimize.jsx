import { CalendarCheck } from 'lucide-react'
import { optimize } from '../data.js'
import { Badge, Button, Card, Footnote, Row, ScreenTitle } from '../ui.jsx'

const dot = { green: 'bg-green', amber: 'bg-amber', red: 'bg-red', muted: 'bg-surface-3' }

const agoLabel = (i, len) =>
  i === len - 1 ? 'current' : len - 1 - i === 1 ? '1 change ago' : `${len - 1 - i} changes ago`

export default function Optimize({ go }) {
  return (
    <div className="rise-in flex flex-col gap-4">
      <ScreenTitle kicker="Optimize System" title="Your system, tuned" right={<Badge tone="green">HEALTHY</Badge>} />

      <div className="stagger flex flex-col gap-4 lg:grid lg:grid-cols-2">
        {/* Habits + interval timeline */}
        <Card>
          <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted">Your filter habits</div>
          {optimize.habits.map((h) => (
            <Row key={h.label} left={<span className="font-medium text-muted">{h.label}</span>} right={h.value} />
          ))}
          <div className="mt-4 flex flex-col gap-2">
            {optimize.timeline.map((days, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-24 shrink-0 text-right text-[10px] text-muted">{agoLabel(i, optimize.timeline.length)}</div>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-1">
                  <div
                    className={`h-full rounded-full ${days <= optimize.target + 7 ? 'bg-green' : 'bg-amber'}`}
                    style={{ width: `${Math.min((days / 90) * 100, 100)}%` }}
                  />
                </div>
                <div className="tnum w-9 shrink-0 text-right text-xs font-bold">{days}d</div>
              </div>
            ))}
            <div className="text-right text-[10px] text-faint">target · {optimize.target} days</div>
          </div>
        </Card>

        {/* Health checklist */}
        <Card>
          <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted">System health</div>
          {optimize.checklist.map((c) => (
            <div key={c.name} className="flex items-center justify-between gap-3 border-b border-border-1 py-2.5 last:border-0">
              <div className="flex min-w-0 items-start gap-2.5">
                <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${dot[c.tone]}`} />
                <div className="min-w-0">
                  <div className="text-sm font-bold">{c.name}</div>
                  <div className="text-xs text-muted">{c.note}</div>
                </div>
              </div>
              <Badge tone={c.tone}>{c.status.toUpperCase()}</Badge>
            </div>
          ))}
        </Card>

        {/* Recommendations */}
        {optimize.recommendations.map((r, i) => (
          <Card key={r.title} glow={i === 0} className="lg:col-span-2">
            <div className="text-sm font-bold">{r.title}</div>
            <p className="mt-1 text-sm leading-relaxed text-muted">{r.body}</p>
            <Button variant="primary" onClick={() => go('assistant')} className="mt-3 w-full lg:w-auto">
              <CalendarCheck className="h-4 w-4" /> {r.action}
            </Button>
          </Card>
        ))}
      </div>

      <Footnote>
        A clogged filter makes the blower work harder, cool less, and wear out sooner. We don't invent savings
        percentages — we keep your system out of trouble.
      </Footnote>
    </div>
  )
}
