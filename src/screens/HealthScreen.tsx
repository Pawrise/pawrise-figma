// Health dashboard — bound to the currently selected dog.
import { useState } from "react"
import { useApp } from "../app-context"
import { indicators, scoreAnomaly, scoreNormal, scoreState, stateMeta, type Indicator } from "../data/health"
import Icon, { type IconName } from "../components/Icon"
import WellbeingScore from "../components/health/WellbeingScore"
import IndicatorDetail from "../components/health/IndicatorDetail"
import DogSelector from "../components/DogSelector"
import DogEditSheet from "../components/DogEditSheet"
import CollarSheet from "../components/CollarSheet"

// Icon per indicator, tinted with its status color on the Santé grid.
const iconFor: Record<string, IconName> = {
  heart: "heart",
  pulse: "pulse",
  activity: "activity",
  moon: "moon",
  thermometer: "thermometer",
}

export default function HealthScreen() {
  const { anomaly, setAnomaly, currentDog: dog, openPanel, care, setTab } = useApp()
  const [open, setOpen] = useState<Indicator | null>(null)
  const [selectorOpen, setSelectorOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [collarOpen, setCollarOpen] = useState(false)
  const score = anomaly ? scoreAnomaly : scoreNormal

  const battery = dog.battery
  const batteryColor =
    battery > 40 ? "var(--color-good)" : battery > 15 ? "var(--color-watch)" : "var(--color-alert)"
  const batterySoft =
    battery > 40 ? "var(--color-good-soft)" : battery > 15 ? "var(--color-watch-soft)" : "var(--color-alert-soft)"

  const scoreMeta = stateMeta(scoreState(score))

  return (
    <div className="relative h-full">
      <div
        className="no-scrollbar h-full overflow-y-auto px-4 pb-6"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 14px)" }}
      >
        {!dog.connected && <p role="status" className="mb-3 text-sm text-watch">Collier déconnecté · dernières mesures reçues</p>}
        {/* profile + wellbeing — one full-width card, at least half the screen */}
        <div
          className="relative mb-5 flex min-h-[52vh] w-full flex-col items-center rounded-[28px] border border-hairline p-4"
          style={{ background: `linear-gradient(165deg, ${scoreMeta.soft}, var(--color-card))` }}
        >
          {/* card actions */}
          <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
            <div className="flex gap-2">
              <span className="w-20" />
            </div>
            <button aria-label={`Notifications (${care.notices.filter(n => !n.read).length})`} onClick={() => openPanel("alerts")} className="absolute left-1/2 -translate-x-1/2 flex h-10 w-10 items-center justify-center rounded-2xl border border-hairline bg-card/60 text-muted-foreground">
              <Icon name="alert" size={18} strokeWidth={2} />
              {care.notices.some(n => !n.read) && <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-alert" />}
            </button>
            <div className="flex gap-2">
              <button onClick={() => setSelectorOpen(true)} aria-label="Changer de chien" className="flex h-10 w-10 items-center justify-center rounded-2xl border border-hairline bg-card/60 text-muted-foreground active:scale-95"><Icon name="swap" size={18} strokeWidth={2} /></button>
              <button onClick={() => setEditOpen(true)} aria-label={`Modifier les infos de ${dog.name}`} className="flex h-10 w-10 items-center justify-center rounded-2xl border border-hairline bg-card/60 text-muted-foreground active:scale-95"><Icon name="pencil" size={17} strokeWidth={2} /></button>
              <button aria-label="Ouvrir les rappels de soins" onClick={() => openPanel("reminders")} className="flex h-10 w-10 items-center justify-center rounded-2xl border border-hairline bg-card/60 text-muted-foreground"><Icon name="doc" size={18} strokeWidth={2} /></button>
              <button aria-label="Ouvrir le vétérinaire" onClick={() => setTab("vet")} className="flex h-10 w-10 items-center justify-center rounded-2xl border border-hairline bg-card/60 text-muted-foreground"><Icon name="plus" size={18} strokeWidth={2} /></button>
              <button
                onClick={() => setAnomaly(!anomaly)}
                aria-label={anomaly ? "Revenir à tout va bien" : "Passer en alerte"}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-hairline bg-card/60 text-muted-foreground active:scale-95"
              >
                <Icon name="alert" size={18} strokeWidth={2.2} className={anomaly ? "text-[var(--color-alert)]" : ""} />
              </button>
            </div>
          </div>

          {/* dog — centered & accentuated */}
          <div className="mt-12 flex flex-col items-center text-center">
            <img
              src={dog.photo}
              alt={`Photo de ${dog.name}`}
              className="h-24 w-24 rounded-full object-cover shadow-lg ring-2 ring-hairline"
              style={{ backgroundColor: "var(--pw-color-avatar-backdrop)" }}
            />
            <h1 className="mt-3 text-[26px] font-bold leading-none">{dog.name}</h1>
            <p className="mt-2 text-[13.5px] text-muted-foreground">
              {dog.breed} · {dog.age}
            </p>
          </div>

          <WellbeingScore score={score} />
        </div>

        <div className="mb-2 mt-6 flex items-center justify-between px-1">
          <h2 className="text-[13px] font-bold uppercase tracking-wider text-muted-foreground">Indicateurs</h2>
          <span className="text-[11px] text-muted-foreground/70">Toucher pour le détail</span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {indicators.map((ind) => {
            const variant = anomaly ? ind.alerte : ind.normal
            const meta = stateMeta(variant.state)
            return (
              <button
                key={ind.id}
                onClick={() => setOpen(ind)}
                aria-label={`${ind.label} — ${variant.status}`}
                className="flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border border-hairline p-1.5 transition-colors active:scale-95"
                style={{ color: meta.color, background: meta.soft }}
              >
                <Icon name={iconFor[ind.icon] ?? "heart"} size={40} strokeWidth={1.9} />
                <span className="max-w-full truncate text-[11.5px] font-bold leading-tight">
                  {variant.headline}
                </span>
              </button>
            )
          })}

          {/* collar battery — tap for network + collar code */}
          <button
            onClick={() => setCollarOpen(true)}
            aria-label={`Batterie du collier — ${battery}%`}
            className="relative flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border border-hairline p-1.5 transition-colors active:scale-95"
            style={{ color: batteryColor, background: batterySoft }}
          >
            <Icon name="battery" size={40} strokeWidth={1.9} />
            <span className="max-w-full truncate text-[11.5px] font-bold leading-tight">{battery}%</span>
          </button>
        </div>
      </div>

      <IndicatorDetail indicator={open} anomaly={anomaly} onClose={() => setOpen(null)} />
      <DogSelector open={selectorOpen} onClose={() => setSelectorOpen(false)} />
      {editOpen && <DogEditSheet dog={dog} onClose={() => setEditOpen(false)} />}
      <CollarSheet open={collarOpen} onClose={() => setCollarOpen(false)} />
    </div>
  )
}
