import { useState } from 'react'
import { Camera, Loader2, ScanLine, Box, AlertTriangle } from 'lucide-react'
import { snapKnow } from '../data.js'
import { Card, Badge, Button, Footnote } from '../ui.jsx'

const SCAN_LINES = ['Reading the nameplate…', 'Matching model + serial…', 'Listening for symptoms…']

export default function SnapKnow() {
  const [phase, setPhase] = useState('idle') // idle | scanning | done
  const [line, setLine] = useState(0)
  const [booked, setBooked] = useState(false)

  const startScan = () => {
    setPhase('scanning')
    setLine(0)
    setTimeout(() => setLine(1), 600)
    setTimeout(() => setLine(2), 1200)
    setTimeout(() => setPhase('done'), 1800)
  }

  return (
    <div className="rise-in flex flex-col gap-4">
      <div>
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber">Snap &amp; Know</div>
        <h1 className="font-cond text-3xl font-bold leading-tight">Snap it. Know it.</h1>
      </div>

      {phase === 'idle' && (
        <Card
          onClick={startScan}
          className="flex flex-col items-center gap-3 border-2 border-dashed border-navy-600 bg-navy-800/40 py-12"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-amber/40 bg-amber/15">
            <Camera className="h-8 w-8 text-amber" />
          </div>
          <div className="text-sm font-bold">Snap a photo of your unit</div>
          <div className="text-xs text-muted">Tap to open the camera</div>
        </Card>
      )}

      {phase === 'scanning' && (
        <Card className="flex flex-col items-center gap-3 py-12">
          <Loader2 className="h-8 w-8 animate-spin text-amber" />
          <div className="text-sm font-bold">Analyzing…</div>
          <div className="text-xs text-muted">{SCAN_LINES[line]}</div>
        </Card>
      )}

      {phase === 'done' && (
        <>
          <Card className="relative overflow-hidden bg-gradient-to-br from-navy-700 to-navy-900 p-0">
            <div className="relative flex h-44 items-center justify-center">
              {/* faint fan-motor circle motif */}
              <div className="absolute h-36 w-36 rounded-full border border-amber/15" />
              <div className="absolute h-24 w-24 rounded-full border border-amber/20" />
              <div className="absolute h-12 w-12 rounded-full border-2 border-amber/25" />
              <ScanLine className="h-6 w-6 text-amber/40" />
              <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-navy-600 bg-navy-900/80 px-2.5 py-1 text-[10px] font-bold tracking-widest text-ink">
                <Box className="h-3 w-3 text-amber" /> TAP FOR 3D · FAN MOTOR
              </div>
            </div>
          </Card>

          <Card>
            <div className="mb-1 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted">Equip ID</div>
              <Badge tone="green">MATCHED</Badge>
            </div>
            <div className="text-sm font-bold">{snapKnow.equip}</div>
          </Card>

          <Card>
            <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted">Plain-English Diagnosis</div>
            <p className="text-sm leading-relaxed">{snapKnow.diagnosis}</p>
          </Card>

          <Card className="flex items-center gap-3 border-red/30 bg-red/10">
            <AlertTriangle className="h-5 w-5 shrink-0 text-red" />
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-red">Urgency</div>
              <div className="text-sm font-bold text-red">{snapKnow.urgency}</div>
            </div>
          </Card>

          <Button primary onClick={() => setBooked(true)}>
            {booked ? 'Requested ✓ — Pineda will confirm by text' : 'Book service — today'}
          </Button>
        </>
      )}

      <Footnote>Point your camera at any unit — know what it is, what's wrong, and what it costs.</Footnote>
    </div>
  )
}
