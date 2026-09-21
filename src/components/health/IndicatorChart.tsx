import type { ReactNode } from "react"
import type { Indicator, IndicatorVariant, Period } from "../../data/health"
import { stateMeta } from "../../data/health"

const W = 320
const H = 150
const PAD = { l: 8, r: 8, t: 14, b: 22 }

type Props = { indicator: Indicator; variant: IndicatorVariant; period: Period }

export default function IndicatorChart({ indicator, variant, period }: Props) {
  const color = stateMeta(variant.state).color
  const data = variant.series[period]

  if (indicator.chart === "afib") return <AfibStrip data={data} color={color} />
  if (indicator.chart === "sleep" && period === "today") return <SleepComposition variant={variant} />
  if (indicator.chart === "activity" || (indicator.chart === "sleep" && period !== "today"))
    return <Bars data={data} color={color} unit={indicator.unit} />
  return <LineArea data={data} color={color} band={indicator.normalBand} unit={indicator.unit} />
}

function scaleX(i: number, n: number) {
  const inner = W - PAD.l - PAD.r
  return PAD.l + (n <= 1 ? inner / 2 : (i / (n - 1)) * inner)
}
function scaleYFactory(min: number, max: number) {
  const inner = H - PAD.t - PAD.b
  const span = max - min || 1
  return (v: number) => PAD.t + inner - ((v - min) / span) * inner
}

function LineArea({
  data,
  color,
  band,
  unit,
}: {
  data: { label: string; value: number }[]
  color: string
  band?: [number, number]
  unit: string
}) {
  const values = data.map((d) => d.value)
  const lo = Math.min(...values, ...(band ?? []))
  const hi = Math.max(...values, ...(band ?? []))
  const pad = (hi - lo) * 0.15 || 1
  const min = lo - pad
  const max = hi + pad
  const y = scaleYFactory(min, max)
  const pts = data.map((d, i) => [scaleX(i, data.length), y(d.value)] as const)
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ")
  const area = `${line} L${pts[pts.length - 1][0]},${H - PAD.b} L${pts[0][0]},${H - PAD.b} Z`

  return (
    <ChartFrame data={data} unit={unit}>
      <defs>
        <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {band && (
        <rect
          x={PAD.l}
          y={y(band[1])}
          width={W - PAD.l - PAD.r}
          height={Math.max(0, y(band[0]) - y(band[1]))}
          fill="var(--pw-color-subtle)"
          rx="4"
        />
      )}
      <path d={area} fill="url(#fill)" />
      <path d={line} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={4} fill={color} stroke="var(--color-card)" strokeWidth={2} />
    </ChartFrame>
  )
}

function Bars({
  data,
  color,
  unit,
}: {
  data: { label: string; value: number }[]
  color: string
  unit: string
}) {
  const max = Math.max(...data.map((d) => d.value)) || 1
  const inner = W - PAD.l - PAD.r
  const gap = 4
  const bw = Math.min(26, inner / data.length - gap)
  return (
    <ChartFrame data={data} unit={unit}>
      {data.map((d, i) => {
        const x = PAD.l + (i / data.length) * inner + (inner / data.length - bw) / 2
        const h = (d.value / max) * (H - PAD.t - PAD.b)
        const last = i === data.length - 1
        return (
          <rect
            key={i}
            x={x}
            y={H - PAD.b - h}
            width={bw}
            height={Math.max(3, h)}
            rx={4}
            fill={color}
            opacity={last ? 1 : 0.45}
          />
        )
      })}
    </ChartFrame>
  )
}

function SleepComposition({ variant }: { variant: IndicatorVariant }) {
  const segs = variant.series.today // [Profond, Léger, Éveillé]
  const total = segs.reduce((s, p) => s + p.value, 0)
  const colors = ["var(--color-good)", "var(--color-primary)", "var(--color-watch)"]
  return (
    <div className="px-1 pt-1">
      <div className="flex h-6 gap-1 overflow-hidden rounded-full">
        {segs.map((s, i) => (
          <div key={s.label} style={{ width: `${(s.value / total) * 100}%`, background: colors[i] }} />
        ))}
      </div>
      <div className="mt-3 flex justify-between">
        {segs.map((s, i) => (
          <div key={s.label} className="flex items-center gap-1.5 text-[12px]">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: colors[i] }} />
            <span className="text-muted-foreground">{s.label}</span>
            <span className="font-mono">{s.value} h</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function AfibStrip({ data, color }: { data: { label: string; value: number }[]; color: string }) {
  // A stylized ECG rhythm strip; markers where value === 1 flag an irregular beat.
  const beats = data.length
  const bw = W / beats
  let path = `M0 ${H / 2}`
  const markers: number[] = []
  data.forEach((d, i) => {
    const cx = i * bw + bw / 2
    if (d.value === 1) markers.push(cx)
    // small baseline then a QRS spike
    path += ` L${cx - bw * 0.35},${H / 2}`
    path += ` L${cx - bw * 0.15},${H / 2 - (d.value ? 12 : 6)}`
    path += ` L${cx},${H / 2 + (d.value ? 44 : 30)}`
    path += ` L${cx + bw * 0.15},${H / 2 - (d.value ? 20 : 14)}`
    path += ` L${cx + bw * 0.35},${H / 2}`
  })
  path += ` L${W} ${H / 2}`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none" height={H}>
      <rect width={W} height={H} fill="var(--pw-color-subtle)" rx="8" />
      <line x1="0" y1={H / 2} x2={W} y2={H / 2} stroke="var(--pw-color-border)" strokeWidth="1" />
      <path d={path} fill="none" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
      {markers.map((cx, i) => (
        <g key={i}>
          <circle cx={cx} cy={H / 2 + 44} r={4} fill="var(--color-alert)" />
          <circle cx={cx} cy={H / 2 + 44} r={9} fill="none" stroke="var(--color-alert)" strokeWidth="1.5" opacity="0.6" />
        </g>
      ))}
    </svg>
  )
}

function ChartFrame({
  data,
  unit,
  children,
}: {
  data: { label: string; value: number }[]
  unit: string
  children: ReactNode
}) {
  const ticks = data.length > 8 ? [data[0], data[Math.floor(data.length / 2)], data[data.length - 1]] : data
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" height={H}>
        <line x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b} stroke="var(--pw-color-border)" strokeWidth="1" />
        {children}
      </svg>
      <div className="mt-1 flex justify-between px-1 font-mono text-[10px] text-muted-foreground">
        {ticks.map((t, i) => (
          <span key={i}>{t.label}</span>
        ))}
        {unit && <span className="text-muted-foreground/60">{unit}</span>}
      </div>
    </div>
  )
}
