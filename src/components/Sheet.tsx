import { useEffect, useRef, useId, type ReactNode } from "react"
import Icon from "./Icon"

type Props = {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export default function Sheet({ open, onClose, title, children }: Props) {
  const dialog = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const close = useRef(onClose)
  close.current = onClose
  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    const el = dialog.current
    el?.focus()
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); close.current(); return }
      if (event.key !== "Tab" || !el) return
      const items = Array.from(el.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select, textarea, a[href], [tabindex="0"]')).filter(e => e.getClientRects().length)
      const first = items[0], last = items[items.length-1]
      if (!first) { event.preventDefault(); return }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === el)) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && (document.activeElement === last || document.activeElement === el)) { event.preventDefault(); first.focus() }
    }
    el?.addEventListener("keydown", keyboard)
    return () => { el?.removeEventListener("keydown", keyboard); previous?.focus() }
  }, [open])
  if (!open) return null
  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : "Détails"}
        tabIndex={-1}
        className="no-scrollbar relative max-h-[82%] overflow-y-auto rounded-t-[30px] border-t border-hairline bg-card px-5 pb-8 pt-3 shadow-2xl"
        style={{ animation: "pw-sheet-up 300ms cubic-bezier(.2,.8,.2,1)" }}
      >
        <div className="sticky top-0 -mx-5 -mt-3 mb-3 bg-card px-5 pb-2 pt-3">
          <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-hairline" />
          <div className="flex items-center justify-between">
            {title && <h3 id={titleId} className="text-xl font-bold">{title}</h3>}
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-elevated text-muted-foreground active:scale-95"
            >
              <Icon name="close" size={18} strokeWidth={2.4} />
            </button>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
