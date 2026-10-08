import { createPortal } from "react-dom"
import type { ReactNode } from "react"
import Icon from "./Icon"

export default function InfoPage({ title, onBack, children }: { title: string; onBack: () => void; children: ReactNode }) {
  const page = (
    <div className="absolute inset-0 z-50 flex flex-col bg-background" style={{ animation: "pw-rise 240ms ease-out" }}>
      <header className="px-4 pb-2" style={{ paddingTop: "calc(var(--pw-safe-top) + 14px)" }}>
        <button
          onClick={onBack}
          className="flex items-center gap-1 rounded-full py-1 pr-3 text-[15px] font-semibold text-primary active:opacity-70"
        >
          <Icon name="chevron-right" size={18} strokeWidth={2.4} className="rotate-180" />
          Retour
        </button>
      </header>
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-10">
        <h1 className="mb-5 text-[26px] font-bold">{title}</h1>
        {children}
      </div>
    </div>
  )
  const shell = document.getElementById("pawrise-shell")
  return shell ? createPortal(page, shell) : page
}
