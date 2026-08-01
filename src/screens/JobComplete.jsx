import { Check } from 'lucide-react'
import { jobComplete, money } from '../data.js'
import { Card, Stat, Badge, Footnote, ScreenTitle } from '../ui.jsx'

const beforeBg = {
  background:
    'radial-gradient(ellipse 55% 40% at 50% 72%, rgba(148,163,184,0.28), transparent 70%), linear-gradient(160deg, #3b4456 0%, #2b3242 55%, #232938 100%)',
}
const afterBg = {
  background:
    'radial-gradient(ellipse 55% 40% at 50% 68%, rgba(52,211,153,0.22), transparent 70%), linear-gradient(160deg, #1e3a4f 0%, #16324a 55%, #12283c 100%)',
}

export default function JobComplete() {
  return (
    <div className="rise-in flex flex-col gap-4">
      <ScreenTitle
        kicker="Job Complete · Proof of work"
        title={jobComplete.client}
        right={<Badge tone="green" pulse>SIGNED OFF</Badge>}
      />

      <Card className="flex flex-col gap-0.5 !py-3">
        <div className="text-sm font-bold">{jobComplete.title}</div>
        <div className="text-xs text-muted">{jobComplete.addr} · {jobComplete.id}</div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <div className="relative aspect-video overflow-hidden rounded-xl border border-navy-600/60" style={beforeBg}>
          <div className="absolute left-2 top-2"><Badge tone="muted">BEFORE</Badge></div>
        </div>
        <div className="relative aspect-video overflow-hidden rounded-xl border border-green/30" style={afterBg}>
          <div className="absolute left-2 top-2"><Badge tone="green">AFTER</Badge></div>
        </div>
      </div>

      <Card>
        <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted">Work performed</div>
        {jobComplete.work.map((w) => (
          <div key={w} className="flex items-start gap-2.5 border-b border-navy-700/60 py-2.5 last:border-0">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green/15">
              <Check className="h-3 w-3 text-green" />
            </span>
            <span className="text-sm leading-snug">{w}</span>
          </div>
        ))}
      </Card>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Man-Hours" value={jobComplete.manHours} sub={jobComplete.crewNote} />
        <Stat label="Materials" value={money(jobComplete.materials)} sub={jobComplete.matNote} />
        <Stat label="Completed" value="2:40p" sub="Jun 10" tone="green" />
      </div>

      <Footnote>Photo-documented, customer-signed, warranty-registered — automatically.</Footnote>
    </div>
  )
}
