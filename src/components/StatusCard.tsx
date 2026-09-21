import Icon from "./Icon"
import { useApp } from "../app-context"

function formatRecency(seconds: number) {
  if (seconds < 60) return `il y a ${seconds} seconde${seconds > 1 ? "s" : ""}`
  const m = Math.floor(seconds / 60)
  if (m < 60) return `il y a ${m} min`
  const h = Math.floor(m / 60)
  return `il y a ${h} h`
}

type Props = { secondsAgo: number; stale: boolean }

export default function StatusCard({ secondsAgo, stale }: Props) {
  const { currentDog: dog } = useApp()
  const collar = dog
  const battery = dog.battery
  return (
    <div className="rounded-[26px] border border-hairline bg-card/80 p-3 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={dog.photo}
            alt={`Photo de ${dog.name}`}
            className="h-14 w-14 rounded-2xl object-cover"
            style={{ backgroundColor: "var(--pw-color-avatar-backdrop)" }}
          />
          <span
            className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2"
            style={{
              borderColor: "var(--color-card)",
              background: collar.connected ? "var(--color-good)" : "var(--color-muted-foreground)",
            }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-lg font-bold leading-none">{dog.name}</h2>
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={{ background: "var(--color-good-soft)", color: "var(--color-good)" }}
            >
              <Icon name="signal" size={11} strokeWidth={2.4} /> {dog.connected ? "Collier connecté" : "Collier déconnecté"}
            </span>
          </div>
          <p
            className={`mt-1.5 flex items-center gap-1.5 text-[13px] ${
              stale ? "text-[var(--color-watch)]" : "text-muted-foreground"
            }`}
          >
            <Icon name="locate" size={13} strokeWidth={2.2} />
            <span className="font-mono">
              {dog.name} — Localisée {formatRecency(secondsAgo)}
            </span>
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1 text-sm font-semibold">
            <Icon
              name="battery"
              size={18}
              strokeWidth={2}
              className={battery <= 20 ? "text-[var(--color-alert)]" : "text-foreground"}
            />
            <span className="font-mono tabular-nums">{battery}%</span>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground">{dog.collarId}</span>
        </div>
      </div>

      {stale && (
        <div
          className="mt-3 flex items-start gap-2 rounded-2xl px-3 py-2 text-[12.5px] leading-snug"
          style={{ background: "var(--color-watch-soft)", color: "var(--color-watch)" }}
        >
          <Icon name="alert" size={16} strokeWidth={2.2} className="mt-0.5 shrink-0" />
          <span>
            Position possiblement obsolète — le collier a du mal à transmettre. Actualisez pour obtenir la
            dernière position.
          </span>
        </div>
      )}
    </div>
  )
}
