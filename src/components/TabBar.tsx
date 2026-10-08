import { useApp } from "../app-context"
import Icon, { type IconName } from "./Icon"
import PawriseMark from "./PawriseMark"
import type { Tab } from "../app-context"

type TabItem = {
  id: Tab
  label: string
  icon?: IconName
  logo?: boolean
}

const TABS: TabItem[] = [
  { id: "map", label: "Localisation", icon: "map" },
  { id: "chat", label: "Chat IA", icon: "chat" },
  { id: "health", label: "Pawrise", logo: true },
  { id: "vet", label: "Rendez-vous", icon: "doc" },
  { id: "profile", label: "Paramètres", icon: "settings" },
]

export default function TabBar() {
  const { tab, setTab, openPanel } = useApp()

  return (
    <nav
      className="relative z-30 flex shrink-0 items-stretch justify-around border-t border-border bg-background/85 px-2 pt-2 backdrop-blur-xl"
      style={{ paddingBottom: "calc(var(--pw-safe-bottom) + 10px)" }}
    >
      {TABS.map((t) => {
        const active = tab === t.id
        return (
          <button
            key={t.id}
            onClick={() => {
              openPanel(null)
              setTab(t.id)
            }}
            className="group flex flex-1 flex-col items-center gap-1 py-1.5 outline-none"
            aria-current={active ? "page" : undefined}
          >
            <span
              className={`flex h-9 w-14 items-center justify-center rounded-full transition-all duration-200 ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground group-active:scale-90"
              }`}
            >
              {t.logo ? (
                <PawriseMark
                  className={`h-7 w-7 ${
                    active ? "text-primary-foreground" : "text-accent"
                  }`}
                />
              ) : (
                <Icon name={t.icon!} size={21} strokeWidth={2} />
              )}
            </span>
            <span
              className={`text-[10.5px] font-medium tracking-tight transition-colors ${
                active ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {t.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
