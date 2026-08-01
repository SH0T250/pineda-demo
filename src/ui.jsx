// Pineda OS UI kit v2 — every screen builds from these so the app reads as one system.
// Tones: 'green' | 'amber' | 'red' | 'muted'
import { createContext, useContext, useEffect, useState } from 'react'
import { X, Loader2, Inbox } from 'lucide-react'

const tones = {
  green: 'text-green bg-green/10 border-green/30',
  amber: 'text-amber bg-amber/10 border-amber/30',
  red: 'text-red bg-red/10 border-red/30',
  muted: 'text-muted bg-surface-3/60 border-border-2',
}
export const toneText = { green: 'text-green', amber: 'text-amber', red: 'text-red', muted: 'text-muted' }

export function Badge({ tone = 'muted', children, pulse }) {
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-widest ${tones[tone]}`}>
      {pulse && <span className={`h-1.5 w-1.5 rounded-full pulse-dot ${tone === 'green' ? 'bg-green' : tone === 'red' ? 'bg-red' : 'bg-amber'}`} />}
      {children}
    </span>
  )
}

export function Card({ className = '', children, onClick, raised, glow }) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      onClick={onClick}
      className={`block w-full rounded-2xl border text-left ${
        glow ? 'border-amber/40 shadow-glow-amber' : 'border-border-1'
      } ${raised ? 'bg-surface-3 shadow-raised' : 'bg-surface-2 shadow-card'} p-4 ${
        onClick ? 'transition hover:border-border-2 hover:bg-surface-3 active:scale-[0.99]' : ''
      } ${className}`}
    >
      {children}
    </Tag>
  )
}

export function Stat({ label, value, sub, tone }) {
  return (
    <Card className="flex flex-col gap-1">
      <div className="text-[10px] font-bold uppercase tracking-widest text-muted">{label}</div>
      <div className="tnum font-cond text-[26px] font-bold leading-none">{value}</div>
      {sub && <div className={`text-xs ${toneText[tone] || 'text-muted'}`}>{sub}</div>}
    </Card>
  )
}

export function ScreenTitle({ kicker, title, right }) {
  return (
    <div className="mb-1 flex items-end justify-between gap-3">
      <div className="min-w-0">
        {kicker && <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber">{kicker}</div>}
        <h1 className="truncate font-cond text-3xl font-bold leading-tight">{title}</h1>
      </div>
      {right}
    </div>
  )
}

export function Row({ left, sub, right, rightSub, badge, onClick }) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag onClick={onClick} className={`flex w-full items-center justify-between gap-3 border-b border-border-1 py-2.5 text-left last:border-0 ${onClick ? 'transition hover:bg-surface-3/40 -mx-2 rounded-lg px-2' : ''}`}>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold">{left}</div>
        {sub && <div className="truncate text-xs text-muted">{sub}</div>}
      </div>
      <div className="flex shrink-0 items-center gap-2 text-right">
        {badge}
        <div>
          {right != null && <div className="tnum text-sm font-bold">{right}</div>}
          {rightSub && <div className="text-[11px] text-muted">{rightSub}</div>}
        </div>
      </div>
    </Tag>
  )
}

export function Avatar({ initials, size = 'h-10 w-10 text-sm' }) {
  return (
    <div className={`flex ${size} shrink-0 items-center justify-center rounded-full border border-amber/40 bg-amber/15 font-bold text-amber`}>
      {initials}
    </div>
  )
}

export function Button({ variant = 'secondary', className = '', children, onClick, loading, disabled, type = 'button' }) {
  const styles = {
    primary: 'bg-amber text-navy-950 hover:bg-amber-bright',
    secondary: 'border border-border-2 bg-surface-3/70 text-ink hover:bg-surface-3',
    ghost: 'text-muted hover:text-ink hover:bg-surface-3/50',
    danger: 'border border-red/40 bg-red/10 text-red hover:bg-red/20',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 ${styles[variant]} ${className}`}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}

export function Field({ label, children, hint }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-bold uppercase tracking-widest text-muted">{label}</span>
      {children}
      {hint && <span className="text-[11px] text-faint">{hint}</span>}
    </label>
  )
}

const inputCls =
  'w-full min-h-11 rounded-xl border border-border-2 bg-surface-1 px-3.5 py-2.5 text-sm font-medium text-ink placeholder:text-faint transition focus:border-amber/60'

export function Input(props) {
  return <input {...props} className={`${inputCls} ${props.className || ''}`} />
}

export function Select({ options = [], ...props }) {
  return (
    <select {...props} className={`${inputCls} appearance-none ${props.className || ''}`}>
      {options.map((o) => (
        <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
      ))}
    </select>
  )
}

export function Segmented({ options, value, onChange, className = '' }) {
  return (
    <div className={`flex rounded-xl border border-border-1 bg-surface-1 p-1 ${className}`}>
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={`min-h-9 flex-1 rounded-lg px-3 text-xs font-bold transition ${
            value === o ? 'bg-amber text-navy-950' : 'text-muted hover:text-ink'
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

// Bottom sheet on mobile, centered modal on desktop.
export function Sheet({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center lg:items-center">
      <div className="fade-in absolute inset-0 bg-black/55 backdrop-blur-[2px]" onClick={onClose} />
      <div className="sheet-up app-scroll relative max-h-[88%] w-full overflow-y-auto rounded-t-3xl border border-border-2 bg-surface-2 p-5 pb-8 shadow-raised lg:max-w-md lg:rounded-3xl lg:pb-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-cond text-xl font-bold">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-surface-3 hover:text-ink">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

const ToastCtx = createContext(() => {})
export const useToast = () => useContext(ToastCtx)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(t)
  }, [toast])
  return (
    <ToastCtx.Provider value={setToast}>
      {children}
      {toast && (
        <div aria-live="polite" className="pointer-events-none absolute inset-x-0 bottom-24 z-[60] flex justify-center px-6 lg:bottom-8">
          <div className="toast-in flex items-center gap-2 rounded-xl border border-green/30 bg-surface-3 px-4 py-2.5 text-sm font-semibold shadow-raised">
            <span className="h-2 w-2 rounded-full bg-green" />
            {toast}
          </div>
        </div>
      )}
    </ToastCtx.Provider>
  )
}

export function EmptyState({ icon: Icon = Inbox, title, sub, action }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border-2 py-10 text-center">
      <Icon className="h-7 w-7 text-faint" strokeWidth={1.5} />
      <div className="text-sm font-bold">{title}</div>
      {sub && <div className="max-w-[240px] text-xs text-muted">{sub}</div>}
      {action}
    </div>
  )
}

export function Footnote({ children }) {
  return <p className="mt-2 text-center text-[11px] leading-relaxed text-faint">{children}</p>
}
