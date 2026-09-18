import { useEffect, useMemo, useRef, useState } from "react"
import { useApp } from "../../app-context"
import Icon, { type IconName } from "../Icon"
import { button, field } from "./styles"
import { filterAndSortVets, formatSlotTime, nextSlot, vetDays, vetLabel, vets, type EmergencyFilter, type PartnerFilter, type SlotDay, type VetClinic, type VetSort } from "../../data/vets"

type Step = "list" | "contact" | "slots" | "review" | "success"

const PARTNER_FILTERS: { id: PartnerFilter; label: string; logo?: boolean; ariaLabel: string }[] = [
  { id: "all", label: "Tous", ariaLabel: "Afficher tous les vétérinaires" },
  { id: "partner", label: "Partenaires", logo: true, ariaLabel: "Afficher les partenaires Pawrise" },
  { id: "other", label: "Non partenaires", ariaLabel: "Afficher les vétérinaires hors réseau Pawrise" },
]

export default function Vet() {
  const { currentDog, care } = useApp()
  const [step, setStep] = useState<Step>("list")
  const [vet, setVet] = useState<VetClinic | null>(null)
  const [slot, setSlot] = useState("")
  const [dayKey, setDayKey] = useState("")
  const [reason, setReason] = useState("Consultation")
  const [share, setShare] = useState(false)
  const [cancelId, setCancelId] = useState<string | null>(null)
  const [emergencyFilter, setEmergencyFilter] = useState<EmergencyFilter>("all")
  const [partnerFilter, setPartnerFilter] = useState<PartnerFilter>("all")
  const [sort, setSort] = useState<VetSort>("distance")

  const appointments = care.appointments.filter((a) => a.dogId === currentDog.id)
  const booked = useMemo(
    () => new Set(care.appointments.filter((a) => a.status === "confirmed").map((a) => `${a.clinic}|${a.date}`)),
    [care.appointments],
  )
  const listed = useMemo(
    () => filterAndSortVets(vets, emergencyFilter, partnerFilter, sort, booked),
    [emergencyFilter, partnerFilter, sort, booked],
  )
  const days = useMemo(() => (vet ? vetDays(vet, booked) : []), [vet, booked])
  const selectedDay = days.find((day) => day.key === dayKey) ?? days[0]

  const openVet = (next: VetClinic) => {
    setVet(next)
    setSlot("")
    setReason("Consultation")
    setShare(false)
    if (!next.partner) {
      setDayKey("")
      setStep("contact")
      return
    }
    const schedule = vetDays(next, booked)
    const firstOpen = schedule.find((day) => day.slots.some((item) => item.available)) ?? schedule[0]
    setDayKey(firstOpen?.key ?? "")
    setStep("slots")
  }

  const chooseSlot = (iso: string) => {
    setSlot(iso)
    setStep("review")
  }

  const confirm = () => {
    if (!vet || !slot) { setStep("list"); return }
    care.setAppointments((as) => [...as, {
      id: crypto.randomUUID(),
      dogId: currentDog.id,
      clinic: vetLabel(vet),
      date: slot,
      reason: reason.trim() || "Consultation",
      share,
      status: "confirmed",
    }])
    care.notify(currentDog.id, `Rendez-vous confirmé : ${vetLabel(vet)}`, "vet")
    setStep("success")
  }

  const reset = () => {
    setStep("list")
    setVet(null)
    setSlot("")
    setDayKey("")
    setReason("Consultation")
    setShare(false)
  }

  return (
    <div className="space-y-4">
      {step === "list" && (
        <>
          <h1 className="text-[26px] font-bold">Rendez-vous</h1>
          <p className="text-sm text-muted-foreground">Choisissez un vétérinaire pour {currentDog.name}.</p>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {PARTNER_FILTERS.map((option) => {
              const selected = partnerFilter === option.id
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={selected}
                  aria-label={option.ariaLabel}
                  onClick={() => setPartnerFilter(option.id)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-semibold transition-colors ${
                    selected ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"
                  }`}
                >
                  {option.logo && <PawriseMark size={16} />}
                  {option.label}
                </button>
              )
            })}
          </div>
          <div className="flex flex-col items-end gap-2">
            <RadioGroup
              name="vet-filter"
              label="Habilité urgence"
              value={emergencyFilter}
              onChange={setEmergencyFilter}
              options={[
                { id: "all", icon: "list", ariaLabel: "Afficher tous les vétérinaires" },
                { id: "emergency", icon: "alert", ariaLabel: "Afficher les vétérinaires habilités urgence" },
              ]}
            />
            <RadioGroup
              name="vet-sort"
              label="Trier"
              value={sort}
              onChange={setSort}
              options={[
                { id: "distance", icon: "locate", ariaLabel: "Trier par distance" },
                { id: "soonest", icon: "clock", ariaLabel: "Trier par prochain créneau" },
              ]}
            />
          </div>
          <p className="text-xs text-muted-foreground">{listed.length} vétérinaire{listed.length > 1 ? "s" : ""}</p>
          <ul className="space-y-2.5">
            {listed.map((item) => {
              const next = nextSlot(item, booked)
              return (
                <li key={item.id}>
                  <button
                    onClick={() => openVet(item)}
                    className="flex w-full items-center gap-3 rounded-3xl border border-hairline bg-card p-3 text-left active:scale-[0.99]"
                  >
                    <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-[13px] font-bold text-primary">
                      {initials(item.name)}
                      {item.partner && (
                        <span className="absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary ring-2 ring-card">
                          <PawriseMark size={12} />
                        </span>
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-[15.5px] font-semibold">{item.name}</span>
                        {item.emergency && <span className="shrink-0 rounded-full bg-alert-soft px-2 py-0.5 text-[10px] font-bold text-alert">Urgence</span>}
                      </span>
                      {item.partner && <span className="mt-1 block"><PartnerBadge /></span>}
                      <span className="block truncate text-[12.5px] text-muted-foreground">{item.clinic} · {item.specialty}</span>
                      <span className="mt-1 block text-[12px] text-primary">
                        {item.partner
                          ? `${item.distanceKm.toLocaleString("fr-FR")} km · ${next ? `Prochain : ${formatSlotTime(next)}` : "Aucun créneau"}`
                          : `${item.distanceKm.toLocaleString("fr-FR")} km · Prendre rendez-vous par téléphone`}
                      </span>
                    </span>
                    <Icon name="chevron-right" size={18} strokeWidth={2.2} className="shrink-0 text-muted-foreground" />
                  </button>
                </li>
              )
            })}
          </ul>
          {!listed.length && <p className="text-sm text-muted-foreground">Aucun vétérinaire pour ce filtre.</p>}
          <Appointments appointments={appointments} cancelId={cancelId} setCancelId={setCancelId} />
        </>
      )}

      {step === "contact" && vet && (
        <>
          <Back onClick={() => setStep("list")} />
          <VetHeader vet={vet} />
          <div className="rounded-2xl bg-elevated p-4">
            <p className="text-sm font-semibold">Hors réseau Pawrise</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Les créneaux en ligne et l'envoi des mesures du collier sont réservés aux partenaires Pawrise.
              Prenez rendez-vous auprès de la clinique avec les coordonnées ci-dessous.
            </p>
          </div>
          <section className="space-y-4 rounded-3xl border border-hairline bg-card p-4">
            <h3 className="text-sm font-semibold">Prendre rendez-vous</h3>
            <div className="flex gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <Icon name="locate" size={18} strokeWidth={2.2} />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Lieu</p>
                <p className="text-[15px] font-semibold">{vet.address}</p>
                <p className="text-sm text-muted-foreground">{vet.clinic}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <Icon name="phone" size={18} strokeWidth={2.2} />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Contact</p>
                <a href={`tel:${vet.phone.replace(/\s/g, "")}`} className="text-[15px] font-semibold text-primary">
                  {vet.phone}
                </a>
              </div>
            </div>
          </section>
          <a href={`tel:${vet.phone.replace(/\s/g, "")}`} className={`${button} block text-center`}>
            Appeler la clinique
          </a>
        </>
      )}

      {step === "slots" && vet && (
        <>
          <Back onClick={() => setStep("list")} />
          <VetHeader vet={vet} />
          <div className="rounded-2xl bg-good-soft p-4">
            <p className="text-sm font-semibold">Partenaire Pawrise</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Cette clinique peut réceptionner les mesures du collier si vous le souhaitez, à la confirmation du rendez-vous.
            </p>
          </div>
          <p className="text-sm">Créneaux pour {currentDog.name}.</p>
          {selectedDay ? (
            <>
              <DayCarousel days={days} selectedKey={selectedDay.key} onSelect={setDayKey} />
              <section className="space-y-2">
                <h3 className="text-sm font-semibold">Horaires du {selectedDay.label}</h3>
                <ul className="space-y-2">
                  {selectedDay.slots.map((item) => (
                    <li key={item.iso}>
                      {item.available ? (
                        <button
                          className="flex w-full items-center justify-between rounded-2xl border border-hairline bg-card px-4 py-3.5 text-left active:scale-[0.99]"
                          aria-label={`Réserver ${formatSlotTime(item.iso)} le ${selectedDay.label}`}
                          onClick={() => chooseSlot(item.iso)}
                        >
                          <span className="font-mono text-[15px] font-semibold">{formatSlotTime(item.iso)}</span>
                          <span className="flex items-center gap-1 text-sm font-semibold text-primary">
                            Réserver
                            <Icon name="chevron-right" size={16} strokeWidth={2.4} />
                          </span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="flex w-full items-center justify-between rounded-2xl border border-hairline bg-muted px-4 py-3.5 text-left text-muted-foreground"
                          aria-label={`${formatSlotTime(item.iso)} le ${selectedDay.label}, déjà pris`}
                        >
                          <span className="font-mono text-[15px] font-semibold line-through">{formatSlotTime(item.iso)}</span>
                          <span className="text-sm font-semibold">Déjà pris</span>
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Plus aucun créneau pour ce vétérinaire.</p>
          )}
        </>
      )}

      {step === "review" && vet && (
        <div className="space-y-3 rounded-2xl bg-background/40 p-4">
          <Back onClick={() => setStep("slots")} />
          <h3 className="font-bold">Récapitulatif</h3>
          <p>{vetLabel(vet)}</p>
          <p>{new Date(slot).toLocaleString("fr-FR")}</p>
          <p>Chien : {currentDog.name}</p>
          <div className="rounded-2xl bg-good-soft p-4">
            <div className="flex items-center gap-2">
              <PawriseMark size={18} />
              <p className="text-sm font-semibold">Partenaire Pawrise</p>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Les partenaires peuvent réceptionner les infos du collier directement. Cochez ci-dessous pour les transmettre à la clinique avec le rendez-vous.
            </p>
          </div>
          <label className="block">Motif<textarea className={field} value={reason} onChange={(e) => setReason(e.target.value)} /></label>
          <label className="flex gap-3 text-sm">
            <input type="checkbox" checked={share} onChange={(e) => setShare(e.target.checked)} />
            Transmettre les données du collier, le profil et le dossier médical
          </label>
          {share ? (
            <p className="text-sm">
              {currentDog.breed} · {currentDog.age} · {currentDog.weight ?? "—"} kg<br />
              {currentDog.medical || "Aucune information médicale renseignée."}
              <br />Les dernières mesures du collier seront envoyées à la clinique.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Aucune donnée du collier transmise. La clinique n'aura que le motif du rendez-vous.</p>
          )}
          <button className={button} onClick={confirm}>Confirmer le rendez-vous</button>
          <button className="ml-2" onClick={() => setStep("slots")}>Modifier</button>
        </div>
      )}

      {step === "success" && (
        <>
          <div role="status" className="rounded-2xl bg-good-soft p-4">
            <h3 className="font-bold">Rendez-vous confirmé</h3>
            <p className="text-sm">Vous le retrouverez ci-dessous et dans les notifications.</p>
            <button className="mt-3 text-primary" onClick={reset}>Nouveau rendez-vous</button>
          </div>
          <Appointments appointments={appointments} cancelId={cancelId} setCancelId={setCancelId} />
        </>
      )}
    </div>
  )
}

function Back({ onClick }: { onClick: () => void }) {
  return (
    <button className="flex items-center gap-1 text-sm font-semibold text-primary" onClick={onClick}>
      <Icon name="chevron-right" size={16} strokeWidth={2.4} className="rotate-180" />
      Retour
    </button>
  )
}

function PawriseMark({ size = 16 }: { size?: number }) {
  return (
    <img
      src="/assets/pawrise-logo.png"
      alt=""
      width={size}
      height={size}
      className="shrink-0 object-contain"
    />
  )
}

function PartnerBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5">
      <PawriseMark size={12} />
      <span className="text-[10px] font-bold text-primary-foreground">Partenaire Pawrise</span>
    </span>
  )
}

function VetHeader({ vet }: { vet: VetClinic }) {
  return (
    <header className="space-y-1">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-xl font-bold">{vet.name}</h2>
        {vet.partner && <PartnerBadge />}
      </div>
      <p className="text-sm text-muted-foreground">{vet.clinic} · {vet.specialty}</p>
      <p className="text-sm text-muted-foreground">{vet.address} · {vet.distanceKm.toLocaleString("fr-FR")} km</p>
      <p className="text-sm font-semibold" style={{ color: vet.emergency ? "var(--color-alert)" : "var(--color-muted-foreground)" }}>
        {vet.emergency ? "Habilité urgence" : "Non habilité urgence"}
      </p>
    </header>
  )
}

function DayCarousel({
  days,
  selectedKey,
  onSelect,
}: {
  days: SlotDay[]
  selectedKey: string
  onSelect: (key: string) => void
}) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const programmatic = useRef(false)
  const index = Math.max(0, days.findIndex((day) => day.key === selectedKey))

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const card = scroller.querySelector<HTMLElement>(`[data-day="${selectedKey}"]`)
    if (!card) return
    programmatic.current = true
    scroller.scrollTo({
      left: card.offsetLeft - (scroller.clientWidth - card.offsetWidth) / 2,
      behavior: "smooth",
    })
    const done = () => { programmatic.current = false }
    const timer = window.setTimeout(done, 380)
    return () => window.clearTimeout(timer)
  }, [selectedKey])

  const go = (delta: number) => {
    const next = days[index + delta]
    if (next) onSelect(next.key)
  }

  const syncFromScroll = () => {
    const scroller = scrollerRef.current
    if (!scroller || programmatic.current) return
    const center = scroller.scrollLeft + scroller.clientWidth / 2
    let closest = selectedKey
    let dist = Infinity
    for (const day of days) {
      const card = scroller.querySelector<HTMLElement>(`[data-day="${day.key}"]`)
      if (!card) continue
      const gap = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center)
      if (gap < dist) {
        dist = gap
        closest = day.key
      }
    }
    if (closest !== selectedKey) onSelect(closest)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Jour</p>
        <div className="flex gap-1">
          <button
            type="button"
            aria-label="Jour précédent"
            disabled={index <= 0}
            onClick={() => go(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-foreground disabled:opacity-30"
          >
            <Icon name="chevron-right" size={18} strokeWidth={2.4} className="rotate-180" />
          </button>
          <button
            type="button"
            aria-label="Jour suivant"
            disabled={index >= days.length - 1}
            onClick={() => go(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-foreground disabled:opacity-30"
          >
            <Icon name="chevron-right" size={18} strokeWidth={2.4} />
          </button>
        </div>
      </div>
      <div
        ref={scrollerRef}
        onScroll={syncFromScroll}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-2.5 overflow-x-auto"
      >
        <div className="w-[29%] shrink-0" aria-hidden />
        {days.map((day) => {
          const selected = day.key === selectedKey
          const free = day.slots.filter((slot) => slot.available).length
          return (
            <button
              key={day.key}
              type="button"
              data-day={day.key}
              aria-pressed={selected}
              aria-label={day.label}
              onClick={() => onSelect(day.key)}
              className={`w-[42%] shrink-0 snap-center rounded-3xl border px-3 py-3 text-center transition-colors ${
                selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-hairline bg-card"
              }`}
            >
              <span className={`block text-[11px] font-semibold uppercase tracking-wide ${selected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                {day.weekday}
              </span>
              <span className="mt-0.5 block font-display text-[28px] leading-none font-bold">{day.dayNumber}</span>
              <span className={`mt-1 block text-[12px] ${selected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                {day.month}
              </span>
              <span className={`mt-2 block text-[11px] font-semibold ${selected ? "text-primary-foreground" : "text-primary"}`}>
                {free ? `${free} libre${free > 1 ? "s" : ""}` : "Complet"}
              </span>
            </button>
          )
        })}
        <div className="w-[29%] shrink-0" aria-hidden />
      </div>
    </div>
  )
}

function RadioGroup<T extends string>({
  name,
  label,
  value,
  onChange,
  options,
}: {
  name: string
  label: string
  value: T
  onChange: (value: T) => void
  options: { id: T; icon: IconName; ariaLabel: string }[]
}) {
  return (
    <fieldset className="m-0 min-w-0 border-0 p-0">
      <legend className="sr-only">{label}</legend>
      <div className="flex gap-1 rounded-full bg-background/60 p-1">
        {options.map((option) => (
          <label
            key={option.id}
            className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors ${
              value === option.id ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            <input
              type="radio"
              name={name}
              className="sr-only"
              checked={value === option.id}
              onChange={() => onChange(option.id)}
              aria-label={option.ariaLabel}
            />
            <Icon name={option.icon} size={18} strokeWidth={2.2} />
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function initials(name: string) {
  return name.replace(/^Dr\.\s*/, "").split(/\s+/).map((part) => part[0]).join("").slice(0, 2)
}

function Appointments({
  appointments,
  cancelId,
  setCancelId,
}: {
  appointments: { id: string; clinic: string; date: string; reason: string; status: "confirmed" | "cancelled" }[]
  cancelId: string | null
  setCancelId: (id: string | null) => void
}) {
  const { care } = useApp()
  return (
    <section className="space-y-3">
      <h3 className="font-bold">Mes rendez-vous</h3>
      {!appointments.length && <p className="text-sm text-muted-foreground">Aucun rendez-vous.</p>}
      {appointments.map((a) => (
        <article className="space-y-2 rounded-2xl border border-hairline p-3" key={a.id}>
          <p>{a.clinic}</p>
          <p className="text-sm">{new Date(a.date).toLocaleString("fr-FR")} · {a.status === "cancelled" ? "Annulé" : "Confirmé"}</p>
          <p className="text-sm">{a.reason}</p>
          {a.status === "confirmed" && (cancelId === a.id ? (
            <div className="flex gap-3">
              <button onClick={() => { care.setAppointments((as) => as.map((x) => x.id === a.id ? { ...x, status: "cancelled" } : x)); setCancelId(null) }}>Confirmer l'annulation</button>
              <button onClick={() => setCancelId(null)}>Conserver</button>
            </div>
          ) : (
            <button className="text-sm text-primary" onClick={() => setCancelId(a.id)}>Annuler le rendez-vous</button>
          ))}
        </article>
      ))}
    </section>
  )
}
