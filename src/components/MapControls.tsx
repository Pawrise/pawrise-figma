import type { ReactNode } from "react"
import Icon from "./Icon"

type Props = {
  onZoomIn: () => void
  onZoomOut: () => void
  onRecenter: () => void
  onRefresh: () => void
  refreshing: boolean
}

function CtlButton({
  children,
  onClick,
  label,
}: {
  children: ReactNode
  onClick: () => void
  label: string
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center border-b border-hairline bg-card/80 text-foreground backdrop-blur-xl transition-colors last:border-b-0 hover:bg-elevated active:scale-95"
    >
      {children}
    </button>
  )
}

export default function MapControls({ onZoomIn, onZoomOut, onRecenter, onRefresh, refreshing }: Props) {
  return (
    <div className="flex flex-col items-end gap-3">
      <div className="overflow-hidden rounded-2xl border border-hairline shadow-xl">
        <CtlButton onClick={onZoomIn} label="Zoomer">
          <Icon name="plus" size={20} strokeWidth={2.2} />
        </CtlButton>
        <CtlButton onClick={onZoomOut} label="Dézoomer">
          <Icon name="minus" size={20} strokeWidth={2.2} />
        </CtlButton>
      </div>

      <button
        onClick={onRefresh}
        aria-label="Actualiser la position"
        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-hairline bg-card/80 text-foreground shadow-xl backdrop-blur-xl transition-colors hover:bg-elevated active:scale-95"
      >
        <Icon
          name="refresh"
          size={19}
          strokeWidth={2.2}
          className={refreshing ? "animate-spin" : ""}
        />
      </button>

      <button
        onClick={onRecenter}
        aria-label="Recentrer sur Nala"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xl transition-transform active:scale-95"
        style={{ boxShadow: "0 10px 30px var(--pw-color-subtle-strong)" }}
      >
        <Icon name="locate" size={24} strokeWidth={2.4} />
      </button>
    </div>
  )
}
