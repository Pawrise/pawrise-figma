import { scoreState, stateMeta } from "../../data/health"
import Icon from "../Icon"

export default function WellbeingScore({ score }: { score: number }) {
  const state = scoreState(score)
  const meta = stateMeta(state)
  const R = 70
  const C = 2 * Math.PI * R
  const pct = score / 100

  const message =
    state === "good"
      ? "Tout semble normal. Rien à signaler pour le moment."
      : state === "watch"
        ? "Des indicateurs méritent votre attention aujourd'hui."
        : "Une donnée importante est hors de ses valeurs habituelles."

  return (
    <div className="flex flex-1 flex-col items-center justify-center py-2 text-center">
      <div className="relative">
        <svg width={172} height={172} viewBox="0 0 172 172" className="-rotate-90">
          <circle cx="86" cy="86" r={R} fill="none" stroke="var(--pw-color-subtle-strong)" strokeWidth="12" />
          <circle
            cx="86"
            cy="86"
            r={R}
            fill="none"
            stroke={meta.color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - pct)}
            style={{ transition: "stroke-dashoffset 700ms cubic-bezier(.2,.8,.2,1), stroke 400ms" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-[46px] font-bold leading-none tabular-nums">{score}</span>
          <span
            className="mt-1.5 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12.5px] font-bold"
            style={{ background: meta.soft, color: meta.color }}
          >
            <Icon name={state === "good" ? "check" : "alert"} size={13} strokeWidth={2.6} />
            {meta.label}
          </span>
        </div>
      </div>

      <p className="mt-4 max-w-[16rem] text-[14px] leading-snug text-foreground/90">{message}</p>
    </div>
  )
}
