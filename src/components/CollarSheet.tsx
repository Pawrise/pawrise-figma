import { useApp } from "../app-context"
import { useState } from "react"
import { normalizeCollar, validCollar } from "../data/validation"
import Icon from "./Icon"
import Sheet from "./Sheet"

type Props = { open: boolean; onClose: () => void }

export default function CollarSheet({ open, onClose }: Props) {
  const { currentDog: dog, dogs, updateDog, care } = useApp()
  const [replacement, setReplacement] = useState(false)
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const replace = () => {
    const next = normalizeCollar(code)
    if (!validCollar(next) || dogs.some(d => normalizeCollar(d.collarId) === next)) { setError("Code invalide ou déjà associé."); return }
    updateDog(dog.id, { collarId: next, connected: true, battery: 100 }); setReplacement(false); setCode(""); setError("")
    care.notify(dog.id, `Nouveau collier associé à ${dog.name}`, "health")
  }
  const battery = dog.battery
  const batteryColor =
    battery > 40 ? "var(--color-good)" : battery > 15 ? "var(--color-watch)" : "var(--color-alert)"
  const signalStrong = dog.connected

  const rows: { icon: "signal" | "battery" | "shield"; label: string; value: string; color?: string }[] = [
    {
      icon: "signal",
      label: "Réseau",
      value: signalStrong ? "Signal fort" : "Déconnecté",
      color: signalStrong ? "var(--color-good)" : "var(--color-watch)",
    },
    { icon: "shield", label: "Code du collier", value: dog.collarId },
    { icon: "battery", label: "Modèle", value: "Pawrise Collar C2" },
  ]

  return (
    <Sheet open={open} onClose={onClose} title="Collier">
      {/* battery hero */}
      <div className="mb-4 flex items-center gap-4 rounded-3xl border border-hairline bg-background/40 p-4">
        <span
          className="flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ background: "color-mix(in srgb, " + batteryColor + " 16%, transparent)", color: batteryColor }}
        >
          <Icon name="battery" size={26} strokeWidth={2} />
        </span>
        <div className="flex-1">
          <p className="text-[13px] text-muted-foreground">Batterie du collier</p>
          <p className="text-2xl font-bold" style={{ color: batteryColor }}>
            {battery}%
          </p>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-hairline">
            <div className="h-full rounded-full" style={{ width: `${battery}%`, background: batteryColor }} />
          </div>
        </div>
      </div>

      <div className="divide-y divide-[var(--color-border)] overflow-hidden rounded-3xl border border-hairline bg-background/40">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-3 px-4 py-3.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-elevated text-muted-foreground">
              <Icon name={r.icon} size={18} strokeWidth={2} />
            </span>
            <span className="flex-1 text-[14px] text-muted-foreground">{r.label}</span>
            <span className="font-mono text-[13.5px]" style={r.color ? { color: r.color } : undefined}>
              {r.value}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-center text-[12px] text-muted-foreground/70">
        {dog.name} · {dog.connected ? "collier connecté" : "collier déconnecté"}
      </p>
      <button className="mt-4 w-full rounded-2xl bg-elevated p-3 text-sm" onClick={() => setReplacement(true)}>Remplacer le collier</button>
      {replacement && <div className="mt-3 space-y-2"><label className="block text-sm">Nouveau code du collier<input aria-label="Nouveau code du collier" className="mt-2 w-full rounded-2xl bg-background p-3" placeholder="PW-ABC123" value={code} onChange={e => setCode(e.target.value)} /></label><p className="text-xs text-muted-foreground">L'ancien collier sera dissocié de {dog.name}.</p>{error && <p role="alert">{error}</p>}<button className="rounded-2xl bg-primary p-3 text-sm text-primary-foreground" onClick={replace}>Confirmer le remplacement</button><button className="ml-3" onClick={() => setReplacement(false)}>Annuler</button></div>}
    </Sheet>
  )
}
