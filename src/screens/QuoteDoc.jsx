// Full-page branded quote document — printer-friendly, with a side-by-side
// "what QuickBooks sends" vs "what Pineda OS sends" comparison for the pitch.
import { useState } from 'react'
import { Printer, X, ShieldCheck, Check } from 'lucide-react'
import { company, quickbooksQuote } from '../data.js'
import { LABOR_SELL } from '../store.jsx'

const fmt = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const amountOf = (l) => (l.kind === 'labor' ? l.hours * LABOR_SELL : l.sell * (l.qty || 1))

const INCLUDED = [
  'Manufacturer registration of every serial number — warranty starts the day we leave',
  'Permit pulled and TDLR inspection scheduled by us',
  'Refrigerant recovered and equipment disposed of to EPA standards',
  'Startup report: subcooling, superheat, static pressure and airflow documented',
  'Job-site protection and full haul-away — nothing left behind',
]

const TERMS = [
  'Quote valid for 30 days from the issue date.',
  '50% deposit due at scheduling; balance due upon completion and customer sign-off.',
  'Price includes all equipment, materials, labor, permit and inspection listed above.',
  'Ductwork repair allowance covers sealing and re-strapping; full duct replacement, if required, will be quoted separately before any work begins.',
  'No sales tax is charged on residential system replacement labor and materials under Texas Tax Code §151.0101 (residential repair/remodel).',
]

function Paper({ children }) {
  return (
    <div className="invoice-paper relative mx-auto my-6 w-[min(100%-2rem,820px)] bg-white text-slate-800 shadow-2xl print:my-0 print:w-full print:shadow-none">
      {children}
    </div>
  )
}

/* ---------- BEFORE: faithful recreation of the QuickBooks PDF ---------- */
function QuickBooksVersion() {
  const q = quickbooksQuote
  return (
    <Paper>
      <div className="p-10 font-sans text-[13px] leading-relaxed">
        <div className="font-bold">Pineda Heating and Air LLC</div>
        <div className="text-[11px] text-slate-500">
          2141 Good Luck Rd<br />Seguin, TX 78155-1435 USA<br />+3604802<br />pinedahvac@yahoo.com
        </div>

        <div className="mt-8 text-xl tracking-tight">INVOICE</div>

        <div className="mt-4 flex justify-between text-[11px]">
          <div>
            <div className="text-slate-400">BILL TO</div>
            <div>{q.client}</div>
            {q.addr.map((a) => <div key={a}>{a}</div>)}
          </div>
          <div className="flex gap-6 text-slate-400">
            <div>
              <div>INVOICE</div><div>DATE</div><div>DUE DATE</div>
            </div>
            <div className="text-slate-700">
              <div>{q.num}</div><div>{q.date}</div><div>{q.due}</div>
            </div>
          </div>
        </div>

        <table className="mt-8 w-full text-[11px]">
          <thead className="text-slate-400">
            <tr className="text-left">
              <th className="w-16 font-normal">DATE</th>
              <th className="w-24 font-normal">SERVICE</th>
              <th className="font-normal">DESCRIPTION</th>
              <th className="w-12 text-right font-normal">QTY</th>
              <th className="w-24 text-right font-normal">RATE</th>
              <th className="w-24 text-right font-normal">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            <tr className="align-top">
              <td />
              <td className="pt-4">{q.service}</td>
              <td className="pt-4">{q.description.map((d, i) => <div key={i}>{d}</div>)}</td>
              <td />
              <td className="pt-4 text-right">15,000.00</td>
              <td className="pt-4 text-right">15,000.00</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6 border-t border-dashed border-slate-300 pt-4">
          <div className="ml-auto w-72 text-[11px]">
            {[['SUBTOTAL', '15,000.00'], ['TAX', '0.00'], ['TOTAL', '15,000.00'], ['PAYMENT', '7,500.00']].map(([k, v]) => (
              <div key={k} className="flex justify-between py-0.5"><span className="text-slate-400">{k}</span><span>{v}</span></div>
            ))}
            <div className="mt-1 flex justify-between border-t border-dashed border-slate-300 pt-2">
              <span className="text-slate-400">BALANCE DUE</span><span className="text-lg font-bold">$7,500.00</span>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center text-[10px] text-slate-400">
          Please call Chaun at 830-360-4802 when payment is ready to be picked up.<br /><br />
          TACLB 00111996E<br /><br />
          Texas Department of Licensing and Regulation<br />920 Colorado St<br />Austin, TX 78701<br />Page 1 of 1
        </div>
      </div>
    </Paper>
  )
}

/* ---------- AFTER: the Pineda OS quote ---------- */
function PinedaVersion({ quote }) {
  const lines = quote.lines || []
  const equipment = lines.filter((l) => (l.group || (l.kind === 'labor' ? 'labor' : 'equipment')) === 'equipment')
  const labor = lines.filter((l) => (l.group || (l.kind === 'labor' ? 'labor' : 'equipment')) === 'labor')
  const sum = (arr) => arr.reduce((s, l) => s + amountOf(l), 0)
  const equipTotal = sum(equipment)
  const laborTotal = sum(labor)
  const subtotal = equipTotal + laborTotal
  const tax = 0
  const total = subtotal + tax
  const deposit = Math.round(total * ((quote.depositPct ?? 50) / 100) * 100) / 100
  const balance = total - deposit

  const Section = ({ title, rows, total: t }) => (
    <>
      <tr>
        <td colSpan={4} className="pt-6 pb-1">
          <div className="border-b-2 border-[#13202f] pb-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#13202f]">{title}</div>
        </td>
      </tr>
      {rows.map((l, i) => (
        <tr key={i} className="border-b border-slate-100 align-top">
          <td className="py-2.5 pr-3">
            <div className="font-semibold text-slate-800">{l.name}</div>
            {(l.pn || l.detail) && (
              <div className="text-[11px] leading-snug text-slate-400">
                {l.pn ? `Model ${l.pn}` : ''}{l.pn && l.detail ? ' · ' : ''}{l.detail || ''}
              </div>
            )}
          </td>
          <td className="tnum w-14 py-2.5 text-right text-slate-600">{l.kind === 'labor' ? `${l.hours} hr` : l.qty}</td>
          <td className="tnum w-24 py-2.5 text-right text-slate-600">{fmt(l.kind === 'labor' ? LABOR_SELL : l.sell)}</td>
          <td className="tnum w-28 py-2.5 pl-2 text-right font-semibold">{fmt(amountOf(l))}</td>
        </tr>
      ))}
      <tr>
        <td colSpan={3} className="py-2 text-right text-[11px] font-bold uppercase tracking-widest text-slate-400">{title} subtotal</td>
        <td className="tnum py-2 pl-2 text-right font-bold">{fmt(t)}</td>
      </tr>
    </>
  )

  return (
    <Paper>
      <div className="h-2 bg-gradient-to-r from-[#13202f] via-[#22324a] to-[#e7a93c]" />

      <div className="p-8 sm:p-12">
        {/* header */}
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <img src={import.meta.env.BASE_URL + 'logo.png'} alt="" className="h-20 w-20 object-contain" />
            <div>
              <div className="text-xl font-extrabold tracking-tight text-[#13202f]">{company.legal}</div>
              <div className="mt-1 text-xs leading-relaxed text-slate-500">
                {company.street} · {company.cityState}<br />
                {company.phone} · {company.email}<br />
                License {company.license}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-extrabold tracking-tight text-[#13202f]">QUOTE</div>
            <div className="tnum mt-1 text-sm font-bold text-slate-600">{quote.num}</div>
            <div className="mt-2 text-xs leading-relaxed text-slate-500">
              Issued: {quote.issued}<br />
              Valid until: {quote.expires}<br />
              Prepared by: {company.owner}
            </div>
          </div>
        </div>

        {/* customer + project */}
        <div className="mt-8 grid grid-cols-2 gap-6 rounded-lg bg-slate-50 p-4">
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">Prepared for</div>
            <div className="mt-1 text-sm font-bold">{quote.client}</div>
            <div className="text-xs text-slate-500">{quote.addr}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">Project</div>
            <div className="mt-1 text-sm font-semibold text-slate-700">{quote.title}</div>
            <div className="text-xs text-slate-500">Complete system replacement</div>
          </div>
        </div>

        {/* itemized */}
        <table className="mt-2 w-full border-collapse text-sm">
          <thead>
            <tr className="text-left text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
              <th className="pt-6">Description</th>
              <th className="pt-6 text-right">Qty</th>
              <th className="pt-6 text-right">Rate</th>
              <th className="pt-6 pl-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <Section title="Equipment & Materials" rows={equipment} total={equipTotal} />
            <Section title="Labor & Services" rows={labor} total={laborTotal} />
          </tbody>
        </table>

        {/* totals */}
        <div className="mt-5 flex justify-end">
          <div className="w-72">
            <div className="flex justify-between py-1.5 text-sm text-slate-600"><span>Subtotal</span><span className="tnum">{fmt(subtotal)}</span></div>
            <div className="flex justify-between py-1.5 text-sm text-slate-600"><span>Sales tax</span><span className="tnum">{fmt(tax)}</span></div>
            <div className="mt-1 flex justify-between border-t-2 border-[#13202f] py-2.5 text-base font-extrabold text-[#13202f]">
              <span>Project total</span><span className="tnum">{fmt(total)}</span>
            </div>
            <div className="mt-2 rounded-lg bg-[#13202f] px-3 py-2 text-white">
              <div className="flex justify-between text-sm font-bold"><span>Deposit to schedule ({quote.depositPct}%)</span><span className="tnum">{fmt(deposit)}</span></div>
              <div className="mt-0.5 flex justify-between text-xs text-slate-300"><span>Balance on completion</span><span className="tnum">{fmt(balance)}</span></div>
            </div>
          </div>
        </div>

        {/* warranty */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          {[
            { term: '10 Years', label: 'Major parts', note: 'Manufacturer-registered by us at install — no forms for you.' },
            { term: '2 Years', label: 'Labor', note: 'Pineda-backed. If it was our workmanship, we make it right.' },
          ].map((w) => (
            <div key={w.label} className="rounded-lg border-2 border-[#e7a93c] bg-[#fdf8ee] p-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#b07d20]" />
                <span className="text-lg font-extrabold text-[#13202f]">{w.term}</span>
                <span className="text-xs font-bold uppercase tracking-widest text-[#b07d20]">{w.label}</span>
              </div>
              <div className="mt-1 text-xs leading-relaxed text-slate-600">{w.note}</div>
            </div>
          ))}
        </div>

        {/* included */}
        <div className="mt-8">
          <div className="border-b-2 border-[#13202f] pb-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#13202f]">Included with this installation</div>
          <div className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {INCLUDED.map((t) => (
              <div key={t} className="flex items-start gap-2 text-xs leading-snug text-slate-600">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2f9e63]" strokeWidth={3} />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* terms */}
        <div className="mt-8">
          <div className="border-b-2 border-[#13202f] pb-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#13202f]">Terms</div>
          <ol className="mt-3 list-decimal space-y-1 pl-4 text-[11px] leading-relaxed text-slate-500">
            {TERMS.map((t) => <li key={t}>{t}</li>)}
          </ol>
        </div>

        {/* acceptance */}
        <div className="mt-8 rounded-lg border border-slate-300 p-5">
          <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">Acceptance</div>
          <p className="mt-1 text-xs text-slate-600">
            Signing below authorizes {company.name} to perform the work described above at the quoted price.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-8">
            <div className="border-t border-slate-400 pt-1 text-[10px] uppercase tracking-widest text-slate-400">Customer signature</div>
            <div className="border-t border-slate-400 pt-1 text-[10px] uppercase tracking-widest text-slate-400">Date</div>
          </div>
        </div>

        {/* footer */}
        <div className="mt-8 border-t border-slate-200 pt-5 text-center text-[10px] leading-relaxed text-slate-400">
          <div className="font-bold text-slate-500">{company.legal} · License {company.license}</div>
          Serving {company.serviceArea}<br />
          Regulated by the {company.regulator}<br />
          <span className="mt-2 inline-block font-semibold text-slate-500">
            Questions? Call Chaun directly at {company.phone}.
          </span>
        </div>
      </div>
    </Paper>
  )
}

export default function QuoteDoc({ quote, onClose }) {
  const [view, setView] = useState('pineda')
  const comparable = quote.num === '#Q-2014'

  return (
    <div className="invoice-overlay fixed inset-0 z-[70] overflow-y-auto bg-black/70 backdrop-blur-sm print:overflow-visible print:bg-white">
      <div className="no-print sticky top-0 z-10 flex flex-wrap items-center justify-between gap-2 bg-black/40 px-4 py-3 backdrop-blur">
        {comparable ? (
          <div className="flex rounded-xl border border-white/15 bg-white/5 p-1">
            {[['pineda', 'Pineda OS quote'], ['qb', 'QuickBooks original']].map(([k, label]) => (
              <button
                key={k}
                onClick={() => setView(k)}
                className={`min-h-9 rounded-lg px-3 text-xs font-bold transition ${view === k ? 'bg-amber text-navy-950' : 'text-white/70 hover:text-white'}`}
              >
                {label}
              </button>
            ))}
          </div>
        ) : <div className="text-xs font-semibold text-white/70">{quote.num}</div>}

        <div className="flex gap-2">
          <button onClick={() => window.print()} className="flex min-h-10 items-center gap-2 rounded-xl bg-amber px-4 text-sm font-bold text-navy-950 transition hover:bg-amber-bright">
            <Printer className="h-4 w-4" /> Print / Save PDF
          </button>
          <button onClick={onClose} aria-label="Close" className="flex min-h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {view === 'qb' && comparable ? <QuickBooksVersion /> : <PinedaVersion quote={quote} />}
    </div>
  )
}
