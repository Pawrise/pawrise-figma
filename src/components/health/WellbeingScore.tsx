import { scoreState, stateMeta } from "../../data/health"

const SIZE = 84
const CENTER = SIZE / 2

export default function WellbeingScore({ score }: { score: number }) {
  const meta = stateMeta(scoreState(score))
  const R = 32
  const C = 2 * Math.PI * R
  const pct = score / 100

  return (
    <div
      className="relative shrink-0"
      aria-label={`Score de bien-être ${score}, ${meta.label}`}
    >
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="-rotate-90"
      >
        <circle
          cx={CENTER}
          cy={CENTER}
          r={R}
          fill="none"
          stroke="var(--pw-color-subtle-strong)"
          strokeWidth="7"
        />
        <circle
          cx={CENTER}
          cy={CENTER}
          r={R}
          fill="none"
          stroke={meta.color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - pct)}
          style={{
            transition:
              "stroke-dashoffset 700ms cubic-bezier(.2,.8,.2,1), stroke 400ms",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono text-[26px] font-bold leading-none tabular-nums">
          {score}
        </span>
      </div>
    </div>
  )
}
