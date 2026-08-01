// Job Complete — proof-of-work record: before/after photos, checklist, cost stats.
import { Check } from 'lucide-react'
import { jobComplete, money } from '../data.js'
import { Badge, Card, Stat, ScreenTitle, Footnote } from '../ui.jsx'

const shots = [
  { label: 'BEFORE', tone: 'muted', border: 'border-border-2', img: import.meta.env.BASE_URL + 'photos/before.webp' },
  { label: 'AFTER', tone: 'green', border: 'border-green/30', img: import.meta.env.BASE_URL + 'photos/after.webp' },
]

export default function JobComplete() {
  const j = jobComplete
  return (
    <div className="rise-in flex flex-col gap-4">
      <ScreenTitle
        kicker="Job Complete · Proof of work"
        title={j.client}
        right={<Badge tone="green">SIGNED OFF</Badge>}
      />

      <div className="stagger flex flex-col gap-4">
        <Card>
          <div className="text-base font-bold">{j.title}</div>
          <div className="mt-0.5 text-xs text-muted">{j.addr} · {j.id}</div>
        </Card>

        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-3 lg:content-start">
            {shots.map((s) => (
              <div key={s.label} className={`relative aspect-video overflow-hidden rounded-xl border ${s.border}`}>
                <img src={s.img} alt={`${s.label.toLowerCase()} photo of the condenser`} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                <div className="absolute left-2 top-2"><Badge tone={s.tone}>{s.label}</Badge></div>
              </div>
            ))}
          </div>

          <Card>
            <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted">Work performed</div>
            {j.work.map((w) => (
              <div key={w} className="flex items-start gap-2.5 border-b border-border-1 py-2.5 last:border-0">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green/15">
                  <Check className="h-3 w-3 text-green" />
                </span>
                <span className="text-sm leading-snug">{w}</span>
              </div>
            ))}
          </Card>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Stat label="Man-Hours" value={j.manHours} sub={j.crewNote} />
          <Stat label="Materials" value={money(j.materials)} sub={j.matNote} />
          <Stat label="Completed" value="2:40p" sub="Jun 10" tone="green" />
        </div>

        <Footnote>Photo-documented, customer-signed, warranty-registered — automatically.</Footnote>
      </div>
    </div>
  )
}
