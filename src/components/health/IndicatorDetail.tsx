import { useState } from "react"
import Sheet from "../Sheet"
import Icon from "../Icon"
import IndicatorChart from "./IndicatorChart"
import { periodLabels, stateMeta, type Indicator, type Period } from "../../data/health"
import { useApp } from "../../app-context"

const PERIODS: Period[] = ["today", "7d", "30d"]

type Props = { indicator: Indicator | null; anomaly: boolean; onClose: () => void }

export default function IndicatorDetail({ indicator, anomaly, onClose }: Props) {
  const { askPawriseAboutAlert, currentDog } = useApp()
  const [period, setPeriod] = useState<Period>("today")

  if (!indicator) return null
  const variant = anomaly ? indicator.alerte : indicator.normal
  const meta = stateMeta(variant.state)
  const isAlert = variant.state !== "good"

  return (
    <Sheet open={!!indicator} onClose={onClose} title={indicator.label}>
      <div className="flex items-center justify-between">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-bold"
          style={{ background: meta.soft, color: meta.color }}
        >
          <Icon name={variant.state === "good" ? "check" : "alert"} size={14} strokeWidth={2.6} />
          {variant.status}
        </span>
        <span className="font-mono text-xl font-bold">{variant.headline}</span>
      </div>

      <p className="mt-3 text-[14px] leading-snug text-foreground/90">{variant.message.split("Nala").join(currentDog.name)}</p>
      <p className="mt-1.5 text-[13px] leading-snug text-muted-foreground">{variant.detail.split("Nala").join(currentDog.name)}</p>

      {indicator.hasPeriods && (
        <div className="mt-4 flex gap-1 rounded-full bg-background/60 p-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 rounded-full py-2 text-[13px] font-semibold transition-colors ${
                period === p ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 rounded-3xl border border-hairline bg-background/40 p-3">
        <IndicatorChart indicator={indicator} variant={variant} period={indicator.hasPeriods ? period : "today"} />
      </div>

      {isAlert && (
        <button
          onClick={() => {
            onClose()
            askPawriseAboutAlert()
          }}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-[15px] font-bold text-primary-foreground active:scale-[0.99]"
        >
          <Icon name="paw" size={18} /> Demander à Pawrise
        </button>
      )}
    </Sheet>
  )
}
