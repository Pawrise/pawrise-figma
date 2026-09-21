import { useApp } from "../app-context"
import { useState } from "react"
import Icon from "./Icon"
import Sheet from "./Sheet"
import type { SafeZone } from "../data/mock"

type Props = {
  position: { x: number; y: number }
  open: boolean
  onClose: () => void
  zones: SafeZone[]
  setZones: (updater: (z: SafeZone[]) => SafeZone[]) => void
  selectedId: string | null
  onSelect: (id: string | null) => void
}


export default function SafeZonesSheet({
  position,
  open,
  onClose,
  zones,
  setZones,
  selectedId,
  onSelect,
}: Props) {
  const { currentDog: dog } = useApp()
  const [editingId, setEditingId] = useState<string | null>(null)

  const toggleAlerts = (id: string) =>
    setZones((zs) => zs.map((z) => (z.id === id ? { ...z, alertsOn: !z.alertsOn } : z)))

  const setRadius = (id: string, radius: number) =>
    setZones((zs) => zs.map((z) => (z.id === id ? { ...z, radius } : z)))

  const removeZone = (id: string) => {
    setZones((zs) => zs.filter((z) => z.id !== id))
    if (selectedId === id) onSelect(null)
  }

  const addZone = () => {
    const id = `zone_${Date.now()}`
    setZones((zs) => [
      ...zs,
      {
        id,
        label: `Nouvelle zone ${zs.length + 1}`,
        emoji: "📍",
        x: 620,
        y: 560,
        radius: 110,
        alertsOn: true,
      },
    ])
    onSelect(id)
    setEditingId(id)
  }

  return (
    <Sheet open={open} onClose={onClose} title="Zones de sécurité">
      <p className="mb-4 text-[13px] leading-snug text-muted-foreground">
        Définissez des zones sûres. Pawrise vous alerte dès que {dog.name} en sort.
      </p>

      <div className="space-y-3">
        {zones.map((z) => {
          const inside = Math.hypot(position.x - z.x, position.y - z.y) <= z.radius
          const selected = selectedId === z.id
          return (
            <div
              key={z.id}
              className={`rounded-3xl border p-3 transition-colors ${
                selected ? "border-primary/60 bg-elevated" : "border-hairline bg-background/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onSelect(selected ? null : z.id)}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-elevated text-xl active:scale-95"
                >
                  {z.emoji}
                </button>
                <div className="min-w-0 flex-1 text-left">
                  {editingId === z.id ? (
                    <input
                      autoFocus
                      aria-label="Nom de la zone"
                      value={z.label}
                      onChange={(e) =>
                        setZones((zs) =>
                          zs.map((x) => (x.id === z.id ? { ...x, label: e.target.value } : x)),
                        )
                      }
                      onBlur={() => setEditingId(null)}
                      onKeyDown={(e) => e.key === "Enter" && setEditingId(null)}
                      className="w-full rounded-lg bg-background/60 px-2 py-1 text-[15px] font-semibold outline-none ring-1 ring-primary/50"
                    />
                  ) : (
                    <span
                      className="block truncate text-[15px] font-semibold"
                      onDoubleClick={() => setEditingId(z.id)}
                    >
                      {z.label}
                    </span>
                  )}
                  <span
                    className="mt-0.5 inline-flex items-center gap-1 text-[11.5px] font-medium"
                    style={{ color: inside ? "var(--color-good)" : "var(--color-watch)" }}
                  >
                    <Icon name={inside ? "check" : "alert"} size={12} strokeWidth={2.4} />
                    {inside ? `${dog.name} est à l’intérieur` : `${dog.name} n’est pas dans cette zone`}
                  </span>
                </div>
                <button aria-label={`Renommer ${z.label}`} onClick={() => setEditingId(z.id)}><Icon name="pencil" size={16} /></button>
                <button
                  onClick={() => removeZone(z.id)}
                  aria-label="Supprimer la zone"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-[var(--color-alert)] active:scale-95"
                >
                  <Icon name="trash" size={17} strokeWidth={2} />
                </button>
              </div>

              {selected && (
                <div className="mt-3 space-y-3 border-t border-hairline pt-3">
                  <label className="flex items-center justify-between text-[13px]">
                    <span className="text-muted-foreground">Alertes de sortie</span>
                    <button
                      onClick={() => toggleAlerts(z.id)}
                      aria-label={`Alertes de sortie de ${z.label}`}
                      role="switch"
                      aria-checked={z.alertsOn}
                      className="relative h-6 w-11 rounded-full transition-colors"
                      style={{ background: z.alertsOn ? "var(--color-primary)" : "var(--pw-color-subtle-strong)" }}
                    >
                      <span
                        className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all"
                        style={{ left: z.alertsOn ? "22px" : "2px" }}
                      />
                    </button>
                  </label>
                  <div className="text-[13px]">
                    <div className="mb-1 flex items-center justify-between text-muted-foreground">
                      <span>Rayon</span>
                      <span className="font-mono text-foreground">{Math.round(z.radius / 1.5)} m</span>
                    </div>
                    <input
                      aria-label={`Rayon de ${z.label}`}
                      type="range"
                      min={60}
                      max={220}
                      value={z.radius}
                      onChange={(e) => setRadius(z.id, Number(e.target.value))}
                      className="w-full accent-[var(--color-primary)]"
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <button
        onClick={addZone}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-hairline py-3 text-[14px] font-semibold text-foreground active:scale-[0.99]"
      >
        <Icon name="plus" size={18} strokeWidth={2.4} /> Ajouter une zone de sécurité
      </button>
    </Sheet>
  )
}
