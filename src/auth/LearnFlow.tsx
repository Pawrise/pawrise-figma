import { useState } from "react"
import Icon, { type IconName } from "../components/Icon"

const STEPS: { short: string; icon: IconName; title: string; hint: string }[] = [
  {
    short: "App",
    icon: "paw",
    title: "Pawrise veille sur votre chien",
    hint: "Le collier mesure sa santé et indique où il se trouve. Vous consultez tout dans l'application.",
  },
  {
    short: "Collier",
    icon: "signal",
    title: "Allumez le collier",
    hint: "Maintenez le bouton du boîtier jusqu'au voyant. Le collier se réveille et se prépare à transmettre.",
  },
  {
    short: "Mesures",
    icon: "heart",
    title: "Les mesures arrivent",
    hint: "Rythme cardiaque, activité, sommeil et température s'affichent dans Santé dès que le collier envoie ses données.",
  },
  {
    short: "Alerte",
    icon: "alert",
    title: "Un rendez-vous en cas de danger",
    hint: "Si une alerte s'affiche, ouvrez Rendez-vous et réservez un vétérinaire pour votre chien.",
  },
  {
    short: "Position",
    icon: "map",
    title: "Suivez sa position",
    hint: "L'onglet Localisation montre où se trouve votre chien, pour le retrouver rapidement.",
  },
]

export default function LearnFlow({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]
  const last = step === STEPS.length - 1

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-background" style={{ animation: "pw-rise 240ms ease-out" }}>
      <header className="px-4 pb-3" style={{ paddingTop: "calc(env(safe-area-inset-top) + 14px)" }}>
        <div className="mb-4 flex items-center gap-3">
          {step > 0 ? (
            <button
              onClick={() => setStep((value) => value - 1)}
              aria-label="Retour"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-foreground active:scale-95"
            >
              <Icon name="chevron-right" size={18} strokeWidth={2.4} className="rotate-180" />
            </button>
          ) : (
            <span className="h-9 w-9" />
          )}
          <p className="flex-1 text-center text-[13px] font-semibold text-muted-foreground">
            Étape {step + 1} sur {STEPS.length}
          </p>
          <span className="h-9 w-9" />
        </div>
        <nav aria-label="Parcours" className="flex items-center justify-center gap-1">
          {STEPS.map((item, index) => {
            const state = index === step ? "current" : index < step ? "done" : "upcoming"
            return (
              <span key={item.short} className="flex items-center gap-1">
                {index > 0 && (
                  <span
                    className="h-px w-2 shrink-0"
                    style={{ background: index <= step ? "var(--color-primary)" : "var(--pw-color-subtle-strong)" }}
                  />
                )}
                <button
                  type="button"
                  disabled={index > step}
                  onClick={() => setStep(index)}
                  aria-current={index === step ? "step" : undefined}
                  className={`rounded-full px-2 py-1 text-[11px] font-semibold whitespace-nowrap ${
                    state === "current"
                      ? "bg-primary text-primary-foreground"
                      : state === "done"
                        ? "bg-primary/10 text-primary"
                        : "bg-card text-muted-foreground"
                  }`}
                >
                  {item.short}
                </button>
              </span>
            )
          })}
        </nav>
      </header>

      <div key={step} className="flex flex-1 flex-col items-center justify-center px-6 text-center" style={{ animation: "pw-rise 260ms ease-out" }}>
        <span className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-elevated text-primary">
          <Icon name={current.icon} size={40} strokeWidth={1.8} />
        </span>
        <h1 className="text-[26px] font-bold leading-tight">{current.title}</h1>
        <p className="mt-3 max-w-[20rem] text-[15px] leading-snug text-muted-foreground">{current.hint}</p>
      </div>

      <footer className="px-5 pt-3" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)" }}>
        <button
          onClick={() => (last ? onDone() : setStep((value) => value + 1))}
          className="w-full rounded-2xl bg-primary py-4 text-[16px] font-bold text-primary-foreground active:scale-[0.99]"
        >
          {last ? "Connecter le collier" : "Suivant"}
        </button>
      </footer>
    </div>
  )
}
