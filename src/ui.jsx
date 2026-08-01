// Shared UI kit — every screen builds from these so the app reads as one system.

const tones = {
  green: 'text-green bg-green/10 border-green/30',
  amber: 'text-amber bg-amber/10 border-amber/30',
  red: 'text-red bg-red/10 border-red/30',
  muted: 'text-muted bg-navy-700/60 border-navy-600',
}

export function Badge({ tone = 'muted', children, pulse }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-widest ${tones[tone]}`}>
      {pulse && <span className={`h-1.5 w-1.5 rounded-full pulse-dot ${tone === 'green' ? 'bg-green' : tone === 'red' ? 'bg-red' : 'bg-amber'}`} />}
      {children}
    </span>
  )
}

export function Card({ className = '', children, onClick }) {
  return (
    <div onClick={onClick} className={`rounded-2xl border border-navy-600/60 bg-navy-800/80 p-4 ${onClick ? 'cursor-pointer active:scale-[0.99] transition' : ''} ${className}`}>
      {children}
    </div>
  )
}

export function Stat({ label, value, sub, tone }) {
  return (
    <Card className="flex flex-col gap-1">
      <div className="text-[10px] font-bold uppercase tracking-widest text-muted">{label}</div>
      <div className="tnum font-cond text-2xl font-bold leading-none">{value}</div>
      {sub && <div className={`text-xs ${tone === 'green' ? 'text-green' : tone === 'red' ? 'text-red' : 'text-muted'}`}>{sub}</div>}
    </Card>
  )
}

export function ScreenTitle({ kicker, title, right }) {
  return (
    <div className="mb-4 flex items-end justify-between">
      <div>
        {kicker && <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber">{kicker}</div>}
        <h1 className="font-cond text-3xl font-bold leading-tight">{title}</h1>
      </div>
      {right}
    </div>
  )
}

export function Row({ left, sub, right, rightSub, badge }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-navy-700/60 py-2.5 last:border-0">
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold">{left}</div>
        {sub && <div className="truncate text-xs text-muted">{sub}</div>}
      </div>
      <div className="flex shrink-0 items-center gap-2 text-right">
        {badge}
        <div>
          {right && <div className="tnum text-sm font-bold">{right}</div>}
          {rightSub && <div className="text-[11px] text-muted">{rightSub}</div>}
        </div>
      </div>
    </div>
  )
}

export function Avatar({ initials, size = 'h-10 w-10 text-sm' }) {
  return (
    <div className={`flex ${size} shrink-0 items-center justify-center rounded-full border border-amber/40 bg-amber/15 font-bold text-amber`}>
      {initials}
    </div>
  )
}

export function Button({ primary, className = '', children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-4 py-2.5 text-sm font-bold transition active:scale-[0.98] ${
        primary
          ? 'bg-amber text-navy-950 hover:brightness-110'
          : 'border border-navy-600 bg-navy-700/60 text-ink hover:bg-navy-700'
      } ${className}`}
    >
      {children}
    </button>
  )
}

export function Footnote({ children }) {
  return <p className="mt-3 text-center text-[11px] leading-relaxed text-faint">{children}</p>
}
