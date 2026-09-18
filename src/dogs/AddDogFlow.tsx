// Progressive add-a-dog onboarding + collar pairing.
import { normalizeCollar, validCollar, validMeasurement, validBirthDate } from "../data/validation"
import { useEffect, useRef, useMemo, useState, type ReactNode } from "react"
import { useApp } from "../app-context"
import { breeds, samplePhotos, type Dog } from "../data/mock"
import Icon from "../components/Icon"

type Form = {
  photo: string
  name: string
  dob: string
  sex: "male" | "female" | ""
  breed: string
  weight: string
  height: string
  medical: string
}

const STEPS = [
  "photo",
  "name",
  "dob",
  "sex",
  "breed",
  "weight",
  "height",
  "medical",
  "summary",
] as const
type StepKey = (typeof STEPS)[number]

type Phase = "profile" | "collarIntro" | "scan" | "manual" | "activating" | "success"

export default function AddDogFlow() {
  const { addDog, setAddingDog, setTab, dogs } = useApp()
  const [form, setForm] = useState<Form>({
    photo: "",
    name: "",
    dob: "",
    sex: "",
    breed: "",
    weight: "",
    height: "",
    medical: "",
  })
  const [i, setI] = useState(0)
  const [phase, setPhase] = useState<Phase>("profile")

  const [collarCode, setCollarCode] = useState("")
  const [pairError, setPairError] = useState("")
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])
  const step = STEPS[i]
  const dogName = form.name.trim() || "votre chien"

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }))

  const canNext = step === "name" ? form.name.trim().length > 0 : step === "sex" ? !!form.sex : step === "dob" ? validBirthDate(form.dob) : step === "weight" ? validMeasurement(form.weight) : step === "height" ? validMeasurement(form.height) : true

  const goBack = () => {
    if (phase === "manual" || phase === "scan") return setPhase("collarIntro")
    if (phase === "collarIntro") return setPhase("profile")
    if (phase === "profile" && i > 0) return setI((n) => n - 1)
    if (phase === "profile" && i === 0) return setAddingDog(false)
  }

  const next = () => {
    if (!canNext) return
    if (i < STEPS.length - 1) setI((n) => n + 1)
    else setPhase("collarIntro")
  }

  const activate = (input?: string) => {
    const code = normalizeCollar(input || `PW-${crypto.randomUUID().replace(/-/g, "").slice(0,6)}`)
    if (!validCollar(code) || dogs.some(d => normalizeCollar(d.collarId) === code)) { setPairError("Code invalide ou déjà associé à un chien."); return }
    setPairError(""); setCollarCode(code); setPhase("activating")
    timer.current = setTimeout(() => setPhase("success"), 1000)
  }

  const finish = () => {
    const newDog: Dog = {
      id: `dog_${Date.now()}`,
      name: form.name.trim() || "Nouveau chien",
      breed: form.breed || "Race inconnue",
      age: form.dob ? ageFrom(form.dob) : "—",
      dob: form.dob || undefined,
      sex: form.sex || undefined,
      weight: form.weight ? Number(form.weight) : undefined,
      height: form.height ? Number(form.height) : undefined,
      medical: form.medical.trim() || undefined,
      photo: form.photo || samplePhotos[0],
      collarId: collarCode,
      connected: true,
      battery: 100,
    }
    addDog(newDog)
    setAddingDog(false)
    setTab("health")
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-background" style={{ animation: "pw-rise 240ms ease-out" }}>
      {/* header: back + progress + close */}
      <header
        className="flex items-center gap-3 px-4 pb-3"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 14px)" }}
      >
        <button
          onClick={goBack}
          aria-label="Retour"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-foreground active:scale-95"
        >
          <Icon name="chevron-right" size={18} strokeWidth={2.4} className="rotate-180" />
        </button>

        {phase === "profile" ? (
          <div className="flex flex-1 items-center gap-1.5">
            {STEPS.map((_, idx) => (
              <span
                key={idx}
                className="h-1.5 flex-1 rounded-full transition-colors"
                style={{ background: idx <= i ? "var(--color-primary)" : "var(--pw-color-subtle-strong)" }}
              />
            ))}
          </div>
        ) : (
          <div className="flex-1 text-center text-[13px] font-semibold text-muted-foreground">
            Collier Pawrise
          </div>
        )}

        <button
          onClick={() => setAddingDog(false)}
          aria-label="Fermer"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-muted-foreground active:scale-95"
        >
          <Icon name="close" size={18} strokeWidth={2.4} />
        </button>
      </header>

      {/* body */}
      <div key={`${phase}-${step}`} className="no-scrollbar flex-1 overflow-y-auto px-5" style={{ animation: "pw-rise 260ms ease-out" }}>
        {phase === "profile" && (
          <ProfileStep step={step} form={form} set={set} dogName={dogName} goEdit={setI} onContinue={next} />
        )}
        {phase === "collarIntro" && <CollarIntro dogName={dogName} onScan={() => setPhase("scan")} onManual={() => setPhase("manual")} />}
        {phase === "scan" && <ScanView onDetected={() => activate()} />}
        {phase === "manual" && <ManualView onSubmit={activate} />}
        {phase === "activating" && <Activating dogName={dogName} />}
        {phase === "success" && <Success dogName={dogName} photo={form.photo || samplePhotos[0]} />}
      </div>

      {pairError && <p role="alert" className="px-5 text-sm text-watch">{pairError}</p>}
      {!canNext && <p className="px-5 text-xs text-muted-foreground">Renseignez une valeur valide pour continuer.</p>}
      {/* footer action */}
      <footer className="px-5 pt-3" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)" }}>
        {phase === "profile" && step !== "summary" && (
          <PrimaryButton disabled={!canNext} onClick={next}>
            Suivant
          </PrimaryButton>
        )}
        {phase === "profile" && step === "summary" && (
          <PrimaryButton onClick={next}>Continuer</PrimaryButton>
        )}
        {phase === "success" && (
          <PrimaryButton onClick={finish}>
            Voir le tableau de bord de {dogName}
          </PrimaryButton>
        )}
      </footer>
    </div>
  )
}

/* ---------- shared pieces ---------- */

function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-2xl bg-primary py-4 text-[16px] font-bold text-primary-foreground transition-opacity active:scale-[0.99] disabled:opacity-40"
    >
      {children}
    </button>
  )
}

function Question({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="mb-6 mt-4">
      <h1 className="text-[26px] font-bold leading-tight">{title}</h1>
      {hint && <p className="mt-2 text-[13.5px] leading-snug text-muted-foreground">{hint}</p>}
    </div>
  )
}

/* ---------- profile steps ---------- */

function ProfileStep({
  step,
  form,
  set,
  dogName,
  goEdit,
  onContinue,
}: {
  step: StepKey
  form: Form
  set: <K extends keyof Form>(k: K, v: Form[K]) => void
  dogName: string
  goEdit: (i: number) => void
  onContinue: () => void
}) {
  const inputCls =
    "w-full rounded-2xl border border-hairline bg-card px-4 py-4 text-[17px] outline-none focus:border-primary/60"

  switch (step) {
    case "photo":
      return (
        <div>
          <Question title="Ajoutez une photo de votre chien" />
          <div className="flex flex-col items-center">
            <label className="relative mb-5 cursor-pointer">
              <div
                className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-hairline bg-card"
                style={form.photo ? { borderStyle: "solid", borderColor: "var(--color-primary)" } : undefined}
              >
                {form.photo ? (
                  <img src={form.photo} alt="Aperçu" className="h-full w-full object-cover" />
                ) : (
                  <Icon name="paw" size={44} className="text-muted-foreground" />
                )}
              </div>
              <span className="absolute bottom-1 right-1 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                <Icon name="plus" size={22} strokeWidth={2.6} />
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file && file.type.startsWith("image/") && file.size <= 1500000) {
                    const reader = new FileReader()
                    reader.onload = () => set("photo", String(reader.result))
                    reader.readAsDataURL(file)
                  } else if (file) { e.currentTarget.value = ""; window.alert("Choisissez une image de moins de 1,5 Mo.") }
                }}
              />
            </label>
            <p className="mb-3 text-[12.5px] text-muted-foreground">ou choisissez un exemple</p>
            <div className="flex gap-3">
              {samplePhotos.map((p) => (
                <button
                  key={p}
                  onClick={() => set("photo", p)}
                  className="h-16 w-16 overflow-hidden rounded-2xl border-2 transition-colors"
                  style={{ borderColor: form.photo === p ? "var(--color-primary)" : "transparent" }}
                >
                  <img src={p} alt="Exemple de photo" className="h-full w-full object-cover" style={{ backgroundColor: "var(--pw-color-avatar-backdrop)" }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )

    case "name":
      return (
        <div>
          <Question title="Comment s'appelle votre chien ?" />
          <input
            autoFocus
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Ex. Rio"
            className={inputCls}
          />
        </div>
      )

    case "dob":
      return (
        <div>
          <Question
            title={`Quand est né${form.sex === "female" ? "e" : ""} ${dogName} ?`}
            hint="Si vous ne connaissez pas la date exacte, vous pouvez indiquer une date approximative."
          />
          <input type="date" value={form.dob} onChange={(e) => set("dob", e.target.value)} className={inputCls} />
        </div>
      )

    case "sex":
      return (
        <div>
          <Question title={`${dogName} est…`} />
          <div className="grid grid-cols-2 gap-3">
            {([
              ["female", "Femelle", "♀"],
              ["male", "Mâle", "♂"],
            ] as const).map(([val, label, sym]) => {
              const active = form.sex === val
              return (
                <button
                  key={val}
                  onClick={() => set("sex", val)}
                  className={`flex flex-col items-center gap-2 rounded-3xl border py-8 transition-colors ${
                    active ? "border-primary bg-primary/10 text-primary" : "border-hairline bg-card text-foreground"
                  }`}
                >
                  <span className="text-4xl">{sym}</span>
                  <span className="text-[15px] font-semibold">{label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )

    case "breed":
      return <BreedStep value={form.breed} onChange={(v) => set("breed", v)} dogName={dogName} />

    case "weight":
      return (
        <div>
          <Question title={`Combien pèse ${dogName} ?`} hint="Un poids approximatif suffit." />
          <UnitInput value={form.weight} onChange={(v) => set("weight", v)} unit="kg" placeholder="0" />
        </div>
      )

    case "height":
      return (
        <div>
          <Question
            title={`Quelle est la taille de ${dogName} ?`}
            hint="Au garrot, en centimètres. Une mesure approximative est acceptée."
          />
          <UnitInput value={form.height} onChange={(v) => set("height", v)} unit="cm" placeholder="0" />
        </div>
      )

    case "medical":
      return (
        <div>
          <Question
            title={`Y a-t-il quelque chose d'important à savoir sur la santé de ${dogName} ?`}
            hint="Optionnel — conditions connues, traitements, allergies, antécédents… Ces informations pourront aider votre vétérinaire plus tard."
          />
          <textarea
            value={form.medical}
            onChange={(e) => set("medical", e.target.value)}
            rows={6}
            placeholder="Écrire ici (facultatif)…"
            className="w-full resize-none rounded-2xl border border-hairline bg-card px-4 py-3.5 text-[15px] outline-none focus:border-primary/60"
          />
        </div>
      )

    case "summary":
      return <Summary form={form} dogName={dogName} goEdit={goEdit} />
  }
}

function UnitInput({
  value,
  onChange,
  unit,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  unit: string
  placeholder: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-hairline bg-card px-4 py-3">
      <input
        autoFocus
        type="number"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent py-1 text-[26px] font-bold outline-none"
      />
      <span className="text-[18px] font-semibold text-muted-foreground">{unit}</span>
    </div>
  )
}

function BreedStep({
  value,
  onChange,
  dogName,
}: {
  value: string
  onChange: (v: string) => void
  dogName: string
}) {
  const [q, setQ] = useState("")
  const filtered = useMemo(
    () => breeds.filter((b) => b.toLowerCase().includes(q.trim().toLowerCase())),
    [q],
  )
  return (
    <div>
      <Question title={`Quelle est la race de ${dogName} ?`} />
      <div className="mb-3 flex items-center gap-2 rounded-2xl border border-hairline bg-card px-4 py-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher une race…"
          className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
        />
      </div>
      <div className="no-scrollbar max-h-[46vh] space-y-1.5 overflow-y-auto pb-2">
        {filtered.map((b) => {
          const active = value === b
          return (
            <button
              key={b}
              onClick={() => onChange(b)}
              className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left text-[15px] transition-colors ${
                active ? "border-primary bg-primary/10 font-semibold text-primary" : "border-hairline bg-card"
              }`}
            >
              {b}
              {active && <Icon name="check" size={17} strokeWidth={2.6} />}
            </button>
          )
        })}
        {filtered.length === 0 && (
          <p className="px-1 py-6 text-center text-[13px] text-muted-foreground">Aucune race trouvée.</p>
        )}
      </div>
    </div>
  )
}

function Summary({ form, dogName, goEdit }: { form: Form; dogName: string; goEdit: (i: number) => void }) {
  const rows: [string, string, number][] = [
    ["Date de naissance", form.dob ? formatDate(form.dob) : "—", 2],
    ["Sexe", form.sex === "male" ? "Mâle" : form.sex === "female" ? "Femelle" : "—", 3],
    ["Race", form.breed || "—", 4],
    ["Poids", form.weight ? `${form.weight} kg` : "—", 5],
    ["Taille", form.height ? `${form.height} cm` : "—", 6],
    ["Infos santé", form.medical.trim() || "Aucune", 7],
  ]
  return (
    <div>
      <Question title={`Le profil de ${dogName}`} hint="Vérifiez les informations avant de continuer." />
      <div className="mb-5 flex flex-col items-center">
        <img
          src={form.photo || samplePhotos[0]}
          alt={`Photo de ${dogName}`}
          className="h-24 w-24 rounded-3xl object-cover"
          style={{ backgroundColor: "var(--pw-color-avatar-backdrop)" }}
        />
        <h2 className="mt-3 text-2xl font-bold">{dogName}</h2>
      </div>
      <div className="divide-y divide-[var(--color-border)] overflow-hidden rounded-3xl border border-hairline bg-card">
        {rows.map(([label, val, editIdx]) => (
          <button
            key={label}
            onClick={() => goEdit(editIdx)}
            className="flex w-full items-center gap-3 px-4 py-3.5 text-left active:bg-elevated"
          >
            <span className="w-32 shrink-0 text-[13px] text-muted-foreground">{label}</span>
            <span className="flex-1 truncate text-[14px]">{val}</span>
            <Icon name="chevron-right" size={16} strokeWidth={2.2} className="text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  )
}

/* ---------- collar pairing ---------- */

function CollarIntro({
  dogName,
  onScan,
  onManual,
}: {
  dogName: string
  onScan: () => void
  onManual: () => void
}) {
  return (
    <div className="flex h-full flex-col">
      <Question
        title={`Connectons le collier de ${dogName}`}
        hint="Chaque chien Pawrise a son propre collier. Le QR code se trouve directement sur le boîtier du collier."
      />
      <div className="mt-2 space-y-3">
        <button
          onClick={onScan}
          className="flex w-full items-center gap-4 rounded-3xl bg-primary p-4 text-left text-primary-foreground active:scale-[0.99]"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/15">
            <QrGlyph />
          </span>
          <span>
            <span className="block text-[16px] font-bold">Scanner le QR code</span>
            <span className="block text-[12.5px] opacity-80">Recommandé · rapide</span>
          </span>
        </button>
        <button
          onClick={onManual}
          className="flex w-full items-center gap-4 rounded-3xl border border-hairline bg-card p-4 text-left active:scale-[0.99]"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-elevated text-primary">
            <Icon name="pulse" size={24} strokeWidth={2} />
          </span>
          <span>
            <span className="block text-[16px] font-bold">Saisir le code manuellement</span>
            <span className="block text-[12.5px] text-muted-foreground">Code inscrit sous le collier</span>
          </span>
        </button>
      </div>
    </div>
  )
}

function ScanView({ onDetected }: { onDetected: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center py-6">
      <h1 className="mb-2 text-[22px] font-bold">Scannez le QR code</h1>
      <p className="mb-6 text-center text-[13.5px] text-muted-foreground">
        Placez le QR code du collier dans le cadre.
      </p>
      <div className="relative flex h-64 w-64 items-center justify-center overflow-hidden rounded-3xl bg-black/40">
        {/* camera viewfinder */}
        <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(circle at 50% 40%, var(--color-elevated), var(--color-background))" }} />
        <QrGlyph size={120} className="relative text-foreground/70" />
        {/* corner frame */}
        {[
          "left-4 top-4 border-l-2 border-t-2",
          "right-4 top-4 border-r-2 border-t-2",
          "left-4 bottom-4 border-l-2 border-b-2",
          "right-4 bottom-4 border-r-2 border-b-2",
        ].map((c) => (
          <span key={c} className={`absolute h-8 w-8 rounded-[4px] border-primary ${c}`} />
        ))}
        {/* scan line */}
        <span
          className="absolute left-6 right-6 h-0.5 bg-primary"
          style={{ boxShadow: "0 0 12px var(--color-primary)", animation: "pw-scan 1.8s ease-in-out infinite" }}
        />
      </div>
      <button
        onClick={onDetected}
        className="mt-8 rounded-2xl bg-primary px-6 py-3.5 text-[15px] font-bold text-primary-foreground active:scale-95"
      >
        QR code détecté
      </button>
    </div>
  )
}

function ManualView({ onSubmit }: { onSubmit: (code: string) => void }) {
  const [code, setCode] = useState("")
  const valid = validCollar(code)
  return (
    <div>
      <Question title="Saisir le code d'activation" hint="Format attendu : PW- suivi de 6 lettres ou chiffres." />
      <input
        autoFocus
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="PW-XXXXXX"
        className="w-full rounded-2xl border border-hairline bg-card px-4 py-4 text-center font-mono text-[22px] tracking-[0.3em] outline-none focus:border-primary/60"
      />
      <button
        onClick={() => onSubmit(code)}
        disabled={!valid}
        className="mt-5 w-full rounded-2xl bg-primary py-4 text-[16px] font-bold text-primary-foreground active:scale-[0.99] disabled:opacity-40"
      >
        Activer le collier
      </button>
    </div>
  )
}

function Activating({ dogName }: { dogName: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center py-10 text-center">
      <div className="relative mb-6 h-20 w-20">
        <span className="absolute inset-0 rounded-full border-4 border-hairline" />
        <span
          className="absolute inset-0 rounded-full border-4 border-transparent"
          style={{ borderTopColor: "var(--color-primary)", animation: "spin 0.9s linear infinite" }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-primary">
          <Icon name="signal" size={28} strokeWidth={2.2} />
        </span>
      </div>
      <h1 className="text-[20px] font-bold">Activation du collier…</h1>
      <p className="mt-2 text-[13.5px] text-muted-foreground">
        Nous connectons le collier de {dogName} à Pawrise. Un instant.
      </p>
    </div>
  )
}

function Success({ dogName, photo }: { dogName: string; photo: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center py-8 text-center" style={{ animation: "pw-rise 300ms ease-out" }}>
      <div className="relative mb-5">
        <img src={photo} alt={`Photo de ${dogName}`} className="h-28 w-28 rounded-full object-cover" style={{ backgroundColor: "var(--pw-color-avatar-backdrop)" }} />
        <span
          className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full text-primary-foreground"
          style={{ background: "var(--color-good)" }}
        >
          <Icon name="check" size={22} strokeWidth={3} />
        </span>
      </div>
      <h1 className="text-[24px] font-bold">Le collier de {dogName} est activé</h1>
      <p className="mt-2 max-w-[16rem] text-[14px] leading-snug text-muted-foreground">
        {dogName} est maintenant connecté à Pawrise. Sa localisation et sa santé sont suivies en temps réel.
      </p>
    </div>
  )
}

/* ---------- helpers ---------- */

function QrGlyph({ size = 26, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M3 3h7v7H3V3Zm2 2v3h3V5H5Zm9-2h7v7h-7V3Zm2 2v3h3V5h-3ZM3 14h7v7H3v-7Zm2 2v3h3v-3H5Zm9 0h2v2h-2v-2Zm2 2h2v-2h-2v-4h-2v2h-2v2h2v4h2v-2Zm0 0h2v2h-2v-2Zm2 0h2v2h-2v-2Zm0-4h2v2h-2v-2Z" />
    </svg>
  )
}

function randomCode() {
  return Math.random().toString(16).slice(2, 6).toUpperCase()
}

function ageFrom(iso: string) {
  const years = (Date.now() - new Date(iso).getTime()) / (365.25 * 864e5)
  if (years < 1) return `${Math.max(1, Math.round(years * 12))} mois`
  return `${Math.floor(years)} an${Math.floor(years) > 1 ? "s" : ""}`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
}
