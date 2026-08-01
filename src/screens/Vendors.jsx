import { parts, money } from '../data.js'
import { Card, ScreenTitle, Footnote } from '../ui.jsx'

export default function Vendors() {
  return (
    <div className="rise-in flex flex-col gap-4">
      <ScreenTitle kicker="Vendor Database" title="Parts & pricing" />

      <div className="flex flex-col gap-3">
        {parts.map((p) => (
          <Card key={p.pn} className="flex flex-col gap-2.5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-bold">{p.item}</div>
                <div className="truncate text-xs text-muted">{p.vendor} · {p.pn}</div>
              </div>
              <div className="shrink-0 text-right">
                <div className="tnum text-sm font-bold">{money(p.sell)}</div>
                <div className="tnum text-[11px] font-semibold text-green">+{money(p.margin)}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="tnum shrink-0 text-[11px] text-faint">Cost {money(p.cost)} · Markup {p.markup}</span>
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-navy-700">
                <div className="h-full rounded-full bg-amber" style={{ width: `${Math.min((parseInt(p.markup) / 130) * 100, 100)}%` }} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Footnote>Every part priced once — margin baked into every quote.</Footnote>
    </div>
  )
}
