import { useState } from 'react'
import { Camera, Loader2, ScanLine, Box, AlertTriangle, RotateCcw } from 'lucide-react'
import { snapKnow } from '../data.js'
import { Card, Badge, Button, Footnote, ScreenTitle, useToast } from '../ui.jsx'

const SCAN_LINES = ['Reading model plate…', 'Matching diagnostics…']

export default function SnapKnow() {
  const [phase, setPhase] = useState('idle') // idle | analyzing | result
  const [line, setLine] = useState(0)
  const [booked, setBooked] = useState(false)
  const toast = useToast()

  const startScan = () => {
    setPhase('analyzing')
    setLine(0)
    setTimeout(() => setLine(1), 900)
    setTimeout(() => setPhase('result'), 1800)
  }

  const reset = () => {
    setPhase('idle')
    setBooked(false)
  }

  const book = () => {
    if (booked) return
    setBooked(true)
    toast('Request sent — Pineda will confirm by text')
  }

  return (
    <div className="rise-in flex flex-col gap-4">
      <ScreenTitle kicker="Snap & Know" title="Snap it. Know it." />

      {phase === 'idle' && (
        <Card
          onClick={startScan}
          className="flex flex-col items-center gap-3 border-2 border-dashed border-navy-600 bg-surface-1/60 py-12"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-amber/40 bg-amber/15">
            <Camera className="h-8 w-8 text-amber" />
          </div>
          <div className="text-sm font-bold">Snap a photo of your unit</div>
          <div className="text-xs text-faint">Tap to open the camera</div>
        </Card>
      )}

      {phase === 'analyzing' && (
        <Card className="flex flex-col items-center gap-3 py-12">
          <Loader2 className="h-8 w-8 animate-spin text-amber" />
          <div className="text-sm font-bold">Analyzing…</div>
          <div className="text-xs text-muted">{SCAN_LINES[line]}</div>
        </Card>
      )}

      {phase === 'result' && (
        <div className="stagger flex flex-col gap-4 lg:grid lg:grid-cols-2">
          <Card
            onClick={() => toast('3D viewer coming to your model soon')}
            className="relative overflow-hidden p-0 lg:col-span-2"
          >
            <div className="relative h-44 lg:h-56">
              <img
                src={import.meta.env.BASE_URL + 'photos/unit.webp'}
                alt="Photo of your outdoor AC unit"
                className="absolute inset-0 h-full w-full object-cover"
              />
              {/* scan overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
              <div className="absolute right-3 top-3 rounded-lg border border-green/40 bg-navy-950/70 p-1.5 backdrop-blur-sm">
                <ScanLine className="h-4 w-4 text-green" />
              </div>
              <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-navy-600 bg-navy-950/80 px-2.5 py-1 text-[10px] font-bold tracking-widest backdrop-blur-sm">
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

          <Card className="flex items-center gap-3 border-red/30 bg-red/10 lg:col-span-2">
            <AlertTriangle className="h-5 w-5 shrink-0 text-red" />
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-red">Urgency</div>
              <div className="text-sm font-bold text-red">{snapKnow.urgency}</div>
            </div>
          </Card>

          <Button variant="primary" onClick={book} className="lg:col-span-2">
            {booked ? 'Requested ✓ — Pineda will confirm by text' : 'Book service — today'}
          </Button>

          <Button variant="ghost" onClick={reset} className="lg:col-span-2">
            <RotateCcw className="h-4 w-4" /> Scan another
          </Button>
        </div>
      )}

      <Footnote>Point your camera at any unit — know what it is, what's wrong, and what it costs.</Footnote>
    </div>
  )
}
