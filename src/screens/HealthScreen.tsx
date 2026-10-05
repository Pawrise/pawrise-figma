// Health dashboard — bound to the currently selected dog.
import { useState } from "react"
import { useApp } from "../app-context"
import {
  indicators,
  scoreAnomaly,
  scoreNormal,
  scoreState,
  stateMeta,
  type Indicator,
} from "../data/health"
import Icon, { type IconName } from "../components/Icon"
import WellbeingScore from "../components/health/WellbeingScore"
import IndicatorDetail from "../components/health/IndicatorDetail"
import DogSelector from "../components/DogSelector"
import CollarSheet from "../components/CollarSheet"

// Icon per indicator, tinted with its status color on the Santé grid.
const iconFor: Record<string, IconName> = {
  heart: "heart",
  pulse: "pulse",
  activity: "activity",
  moon: "moon",
  thermometer: "thermometer",
}

const actionBtn =
  "flex h-10 w-10 items-center justify-center rounded-2xl border border-hairline bg-card/60 text-muted-foreground active:scale-95"

function scoreMessage(score: number) {
  const state = scoreState(score)
  if (state === "good")
    return "Tout semble normal. Rien à signaler pour le moment."
  if (state === "watch")
    return "Des indicateurs méritent votre attention aujourd'hui."
  return "Une donnée importante est hors de ses valeurs habituelles."
}

export default function HealthScreen() {
  const { anomaly, setAnomaly, currentDog: dog } = useApp()
  const [open, setOpen] = useState<Indicator | null>(null)
  const [selectorOpen, setSelectorOpen] = useState(false)
  const [collarOpen, setCollarOpen] = useState(false)
  const score = anomaly ? scoreAnomaly : scoreNormal

  const battery = dog.battery
  const batteryColor =
    battery > 40
      ? "var(--color-good)"
      : battery > 15
        ? "var(--color-watch)"
        : "var(--color-alert)"
  const batterySoft =
    battery > 40
      ? "var(--color-good-soft)"
      : battery > 15
        ? "var(--color-watch-soft)"
        : "var(--color-alert-soft)"

  const scoreMeta = stateMeta(scoreState(score))

  return (
    <div className="relative h-full">
      <div
        className="flex h-full min-h-0 flex-col px-4 pb-3"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 12px)" }}
      >
        {!dog.connected && (
          <p role="status" className="mb-2 shrink-0 text-sm text-watch">
            Collier déconnecté · dernières mesures reçues
          </p>
        )}
        <div
          className="mb-3 w-full shrink-0 rounded-[28px] border border-hairline px-3.5 pb-3.5 pt-3"
          style={{
            background: `linear-gradient(165deg, ${scoreMeta.soft}, var(--color-card))`,
          }}
        >
          <div className="mb-2 flex items-center justify-between">
            <button
              onClick={() => setSelectorOpen(true)}
              aria-label="Changer de chien"
              className={actionBtn}
            >
              <Icon name="swap" size={18} strokeWidth={2} />
            </button>
            <button
              onClick={() => setAnomaly(!anomaly)}
              aria-label={
                anomaly ? "Revenir à tout va bien" : "Passer en alerte"
              }
              className={actionBtn}
            >
              <Icon
                name="alert"
                size={18}
                strokeWidth={2.2}
                className={anomaly ? "text-alert" : ""}
              />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <img
              src={dog.photo}
              alt={`Photo de ${dog.name}`}
              className="h-16 w-16 shrink-0 rounded-full object-cover shadow-md ring-2 ring-hairline"
              style={{ backgroundColor: "var(--pw-color-avatar-backdrop)" }}
            />
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-[22px] font-bold leading-none">
                {dog.name}
              </h1>
              <p className="mt-1 truncate text-[13px] text-muted-foreground">
                {dog.breed} · {dog.age}
              </p>
              <span
                className="mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11.5px] font-bold"
                style={{ background: scoreMeta.soft, color: scoreMeta.color }}
              >
                <Icon
                  name={scoreState(score) === "good" ? "check" : "alert"}
                  size={12}
                  strokeWidth={2.6}
                />
                {scoreMeta.label}
              </span>
            </div>
            <WellbeingScore score={score} />
          </div>
          <p className="mt-2.5 text-[12.5px] leading-snug text-foreground/90">
            {scoreMessage(score)}
          </p>
        </div>

        <div className="mb-2 flex shrink-0 items-center justify-between px-1">
          <h2 className="text-[13px] font-bold uppercase tracking-wider text-muted-foreground">
            Indicateurs
          </h2>
          <span className="text-[11px] text-muted-foreground/70">
            Toucher pour le détail
          </span>
        </div>

        <div className="grid shrink-0 grid-cols-3 gap-4">
          {indicators.map((ind) => {
            const variant = anomaly ? ind.alerte : ind.normal
            const meta = stateMeta(variant.state)
            return (
              <button
                key={ind.id}
                onClick={() => setOpen(ind)}
                aria-label={`${ind.label} — ${variant.status}`}
                className="flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border border-hairline px-1.5 transition-colors active:scale-95"
                style={{ color: meta.color, background: meta.soft }}
              >
                <Icon
                  name={iconFor[ind.icon] ?? "heart"}
                  size={28}
                  strokeWidth={1.9}
                />
                <span className="max-w-full truncate text-[11.5px] font-bold leading-tight">
                  {variant.headline}
                </span>
              </button>
            )
          })}

          <button
            onClick={() => setCollarOpen(true)}
            aria-label={`Batterie du collier — ${battery}%`}
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border border-hairline px-1.5 transition-colors active:scale-95"
            style={{ color: batteryColor, background: batterySoft }}
          >
            <Icon name="battery" size={28} strokeWidth={1.9} />
            <span className="max-w-full truncate text-[11.5px] font-bold leading-tight">
              {battery}%
            </span>
          </button>
        </div>
      </div>

      <IndicatorDetail
        indicator={open}
        anomaly={anomaly}
        onClose={() => setOpen(null)}
      />
      <DogSelector open={selectorOpen} onClose={() => setSelectorOpen(false)} />
      <CollarSheet open={collarOpen} onClose={() => setCollarOpen(false)} />
    </div>
  )
}
