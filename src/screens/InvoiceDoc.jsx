// Full-page branded invoice document — QuickBooks-synced look, printer-friendly.
// Rendered as an overlay by Invoices.jsx. White paper on purpose: it prints 1:1.
import { Printer, X, RefreshCw } from 'lucide-react'
import { company } from '../data.js'

const fmt = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function InvoiceDoc({ invoice, onClose }) {
  const lines = invoice.lines?.length
    ? invoice.lines
    : [{ desc: 'HVAC service', detail: '', qty: 1, rate: invoice.amt }]
  const subtotal = lines.reduce((s, l) => s + l.qty * l.rate, 0)
  // seeded invoices carry an exact tax figure (parts portion @ 8.25%); fall back to computing it
  const tax = invoice.tax ?? Math.round(subtotal * 0.4 * 0.0825 * 100) / 100
  const total = Math.round((subtotal + tax) * 100) / 100
  const paid = invoice.status === 'PAID'

  return (
    <div className="invoice-overlay fixed inset-0 z-[70] overflow-y-auto bg-black/70 backdrop-blur-sm print:overflow-visible print:bg-white">
      {/* toolbar — never prints */}
      <div className="no-print sticky top-0 z-10 flex items-center justify-between bg-black/40 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2 text-xs font-semibold text-white/80">
          <RefreshCw className="h-3.5 w-3.5 text-green" />
          Synced from QuickBooks · {invoice.num}
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="flex min-h-10 items-center gap-2 rounded-xl bg-amber px-4 text-sm font-bold text-navy-950 transition hover:bg-amber-bright">
            <Printer className="h-4 w-4" /> Print / Save PDF
          </button>
          <button onClick={onClose} aria-label="Close" className="flex min-h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* the paper */}
      <div className="invoice-paper relative mx-auto my-6 w-[min(100%-2rem,800px)] bg-white text-slate-800 shadow-2xl print:my-0 print:w-full print:shadow-none">
        {/* brand band */}
        <div className="h-2 bg-gradient-to-r from-[#13202f] via-[#22324a] to-[#e7a93c]" />

        <div className="p-8 sm:p-12">
          {/* header */}
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex items-center gap-4">
              <img src={import.meta.env.BASE_URL + 'logo.png'} alt="" className="h-16 w-16 object-contain" />
              <div>
                <div className="text-xl font-extrabold tracking-tight text-[#13202f]">{company.name}</div>
                <div className="mt-0.5 text-xs leading-relaxed text-slate-500">
                  {company.city}<br />
                  {company.phone} · {company.email}<br />
                  TACLA license on file
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-extrabold tracking-tight text-[#13202f]">INVOICE</div>
              <div className="tnum mt-1 text-sm font-bold text-slate-600">{invoice.num}</div>
              <div className="mt-2 text-xs leading-relaxed text-slate-500">
                Issued: {invoice.issued || 'Jun 25, 2025'}<br />
                Due: {invoice.due || 'Jul 10, 2025'} · Net 15
              </div>
              {paid ? (
                <div className="mt-2 inline-block rounded-md border-2 border-emerald-500 px-2.5 py-0.5 text-xs font-extrabold tracking-widest text-emerald-600">PAID</div>
              ) : (
                <div className="mt-2 inline-block rounded-md border-2 border-[#e7a93c] px-2.5 py-0.5 text-xs font-extrabold tracking-widest text-[#b07d20]">DUE</div>
              )}
            </div>
          </div>

          {/* bill to */}
          <div className="mt-8 grid grid-cols-2 gap-6">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">Billed to</div>
              <div className="mt-1 text-sm font-bold">{invoice.client}</div>
              {invoice.addr && <div className="text-xs text-slate-500">{invoice.addr}</div>}
            </div>
            <div className="text-right">
              <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">Service</div>
              <div className="mt-1 text-sm font-semibold text-slate-600">{invoice.service || 'HVAC service & repair'}</div>
            </div>
          </div>

          {/* itemized table */}
          <table className="mt-8 w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-[#13202f] text-left text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
                <th className="py-2.5 pr-2">Description</th>
                <th className="tnum w-14 py-2.5 text-right">Qty</th>
                <th className="tnum w-24 py-2.5 text-right">Rate</th>
                <th className="tnum w-28 py-2.5 pl-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-3 pr-2">
                    <div className="font-semibold text-slate-800">{l.desc}</div>
                    {l.detail && <div className="text-xs text-slate-400">{l.detail}</div>}
                  </td>
                  <td className="tnum py-3 text-right text-slate-600">{l.qty}</td>
                  <td className="tnum py-3 text-right text-slate-600">{fmt(l.rate)}</td>
                  <td className="tnum py-3 pl-2 text-right font-semibold">{fmt(l.qty * l.rate)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* totals */}
          <div className="mt-4 flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-1.5 text-sm text-slate-600">
                <span>Subtotal</span><span className="tnum">{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between py-1.5 text-sm text-slate-600">
                <span>Sales tax (8.25% · parts)</span><span className="tnum">{fmt(tax)}</span>
              </div>
              <div className="mt-1 flex justify-between border-t-2 border-[#13202f] py-2.5 text-base font-extrabold text-[#13202f]">
                <span>Total {paid ? 'paid' : 'due'}</span><span className="tnum">{fmt(total)}</span>
              </div>
            </div>
          </div>

          {/* footer */}
          <div className="mt-10 grid grid-cols-2 gap-6 border-t border-slate-200 pt-6 text-xs leading-relaxed text-slate-500">
            <div>
              <div className="mb-1 font-extrabold uppercase tracking-widest text-slate-400">Payment</div>
              Card, ACH, or check payable to {company.name}.<br />
              Pay online any time from your customer portal.
            </div>
            <div className="text-right">
              <div className="mb-1 font-extrabold uppercase tracking-widest text-slate-400">Warranty</div>
              Parts registered with the manufacturer.<br />
              Labor covered 2 years from service date.
            </div>
          </div>

          <div className="mt-8 text-center text-[11px] font-semibold text-slate-400">
            Thank you for trusting {company.name} — {company.tagline.toLowerCase()}
          </div>
        </div>
      </div>
    </div>
  )
}
