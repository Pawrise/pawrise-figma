import { useApp } from "../app-context"
import Icon from "./Icon"

type Props = {
  onOpen: () => void
  onDismiss: () => void
  title?: string
  message?: string
}

// Zone alert. Tapping it opens the contextual Chat.
export default function AlertBanner({ onOpen, onDismiss, title = "Alerte de zone", message }: Props) {
  const { currentDog } = useApp()
  return (
    <div
      role="group"
      className="flex w-full items-center gap-3 rounded-3xl border border-hairline p-3 text-left shadow-2xl backdrop-blur-xl active:scale-[0.99]"
      style={{ background: "var(--color-alert-soft)", animation: "pw-rise 300ms ease-out" }}
    >
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
        style={{ background: "var(--color-alert)", color: "var(--color-white)" }}
      >
        <Icon name="alert" size={22} strokeWidth={2.2} />
      </span>
      <button onClick={onOpen} className="min-w-0 flex-1 text-left">
        <span className="block text-[10.5px] font-bold uppercase tracking-wider" style={{ color: "var(--color-alert)" }}>
          {title}
        </span>
        <span className="block text-[13.5px] font-medium leading-snug text-foreground">
          {message ?? `${currentDog.name} a quitté la zone de sécurité.`}
        </span>
        <span className="mt-0.5 flex items-center gap-1 text-[11.5px]" style={{ color: "var(--color-alert)" }}>
          Toucher pour demander à Pawrise <Icon name="chevron-right" size={12} strokeWidth={2.6} />
        </span>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDismiss()
        }}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground"
        aria-label="Ignorer"
      >
        <Icon name="close" size={16} strokeWidth={2.4} />
      </button>
    </div>
  )
}
