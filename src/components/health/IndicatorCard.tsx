import { stateMeta, type Indicator } from "../../data/health"
import Icon, { type IconName } from "../Icon"

const iconFor: Record<string, IconName> = {
  heart: "heart",
  pulse: "pulse",
  activity: "activity",
  moon: "moon",
  thermometer: "thermometer",
}

type Props = { indicator: Indicator; anomaly: boolean; onOpen: () => void }

export default function IndicatorCard({ indicator, anomaly, onOpen }: Props) {
  const variant = anomaly ? indicator.alerte : indicator.normal
  const meta = stateMeta(variant.state)

  return (
    <button
      onClick={onOpen}
      className="w-full rounded-3xl border border-hairline bg-card p-4 text-left transition-colors hover:bg-elevated active:scale-[0.99]"
    >
      <div className="flex items-center gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
          style={{ background: meta.soft, color: meta.color }}
        >
          <Icon name={iconFor[indicator.icon] ?? "heart"} size={22} strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[15.5px] font-semibold">{indicator.label}</h3>
            <span className="font-mono text-[13px] text-muted-foreground">{variant.headline}</span>
          </div>
          <span
            className="mt-1 inline-flex items-center gap-1 text-[12px] font-semibold"
            style={{ color: meta.color }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: meta.color }} />
            {variant.status}
          </span>
        </div>
      </div>

      <p className="mt-3 text-[13.5px] leading-snug text-foreground/85">{variant.message}</p>

      <span className="mt-2.5 flex items-center gap-1 text-[12.5px] font-semibold text-primary">
        Voir les détails <Icon name="chevron-right" size={14} strokeWidth={2.6} />
      </span>
    </button>
  )
}
