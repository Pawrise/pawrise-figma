export type VetClinic = {
  id: string
  name: string
  clinic: string
  specialty: string
  address: string
  phone: string
  distanceKm: number
  emergency: boolean
  partner: boolean
  hours: string[]
  closedDays: number[]
  daysAhead: number
}

export type EmergencyFilter = "all" | "emergency"
export type PartnerFilter = "all" | "partner" | "other"
export type VetSort = "distance" | "soonest"

export const vets: VetClinic[] = [
  { id: "moreau", name: "Dr. Camille Moreau", clinic: "Clinique des Compagnons", specialty: "Médecine générale", address: "12 rue des Lilas", phone: "01 43 57 12 08", distanceKm: 0.8, emergency: true, partner: true, hours: ["09:00", "09:30", "10:00", "11:00", "14:00", "15:30", "16:30"], closedDays: [0], daysAhead: 5 },
  { id: "lefevre", name: "Dr. Julien Lefèvre", clinic: "Cabinet du Parc", specialty: "Chirurgie", address: "4 allée du Parc", phone: "01 45 21 33 90", distanceKm: 1.2, emergency: true, partner: false, hours: ["08:30", "10:00", "13:30", "15:00", "17:00"], closedDays: [0, 6], daysAhead: 6 },
  { id: "benali", name: "Dr. Inès Benali", clinic: "Vet'Avenir", specialty: "Nutrition & comportement", address: "28 boulevard Voltaire", phone: "01 43 55 18 44", distanceKm: 1.9, emergency: false, partner: true, hours: ["10:00", "11:30", "14:30", "16:00"], closedDays: [0], daysAhead: 5 },
  { id: "garnier", name: "Dr. Thomas Garnier", clinic: "Clinique Bellefeuille", specialty: "Urgences", address: "9 place Bellefeuille", phone: "01 42 08 77 21", distanceKm: 2.4, emergency: true, partner: true, hours: ["08:00", "09:00", "12:00", "18:00", "19:30"], closedDays: [], daysAhead: 4 },
  { id: "kim", name: "Dr. Sarah Kim", clinic: "Cabinet des Quais", specialty: "Dermatologie", address: "15 quai de la Loire", phone: "01 40 37 62 15", distanceKm: 2.8, emergency: false, partner: false, hours: ["09:15", "11:00", "14:00", "16:45"], closedDays: [0, 1], daysAhead: 7 },
  { id: "roux", name: "Dr. Antoine Roux", clinic: "Clinique du Mail", specialty: "Cardiologie", address: "3 rue du Mail", phone: "01 42 61 04 88", distanceKm: 3.1, emergency: false, partner: false, hours: ["09:00", "10:30", "15:00", "16:30"], closedDays: [0, 6], daysAhead: 6 },
  { id: "martin", name: "Dr. Léa Martin", clinic: "Vet&Co République", specialty: "Médecine générale", address: "41 avenue de la République", phone: "01 43 55 90 12", distanceKm: 3.5, emergency: false, partner: true, hours: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"], closedDays: [0], daysAhead: 5 },
  { id: "haddad", name: "Dr. Omar Haddad", clinic: "Clinique des Lilas", specialty: "Orthopédie", address: "7 rue des Acacias", phone: "01 48 97 33 06", distanceKm: 4.2, emergency: true, partner: false, hours: ["08:45", "11:15", "14:15", "17:30"], closedDays: [0, 6], daysAhead: 6 },
  { id: "dubois", name: "Dr. Claire Dubois", clinic: "Cabinet Montsouris", specialty: "NAC & chiens", address: "22 rue de la Tombe-Issoire", phone: "01 45 88 21 70", distanceKm: 5.0, emergency: false, partner: false, hours: ["10:00", "11:00", "15:30", "17:00"], closedDays: [0], daysAhead: 5 },
  { id: "petit", name: "Dr. Hugo Petit", clinic: "Animalis 24/7", specialty: "Urgences", address: "1 rue de l'Hôpital", phone: "01 44 73 24 24", distanceKm: 5.6, emergency: true, partner: true, hours: ["07:30", "12:30", "18:30", "21:00"], closedDays: [], daysAhead: 3 },
  { id: "elamrani", name: "Dr. Nadia El Amrani", clinic: "Clinique Voltaire", specialty: "Ophtalmologie", address: "18 rue Voltaire", phone: "01 43 55 61 09", distanceKm: 6.1, emergency: false, partner: true, hours: ["09:30", "11:30", "14:00", "16:00"], closedDays: [0, 6], daysAhead: 7 },
  { id: "fournier", name: "Dr. Maxime Fournier", clinic: "Cabinet de la Gare", specialty: "Médecine générale", address: "5 place de la Gare", phone: "01 40 19 28 55", distanceKm: 6.8, emergency: false, partner: false, hours: ["08:00", "09:00", "10:30", "13:00", "15:45"], closedDays: [0], daysAhead: 5 },
]

export function vetLabel(vet: VetClinic) {
  return `${vet.name} · ${vet.clinic}`
}

function pad(n: number) {
  return String(n).padStart(2, "0")
}

export function toLocalIso(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export type DaySlot = {
  iso: string
  available: boolean
}

export type SlotDay = {
  key: string
  label: string
  weekday: string
  dayNumber: string
  month: string
  slots: DaySlot[]
}

function hashString(value: string) {
  let hash = 2166136261
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function heldByClinic(vetId: string, iso: string, index: number, total: number) {
  if (total <= 1) return false
  const takenIndex = hashString(`${vetId}|${iso.slice(0, 10)}`) % total
  if (index === takenIndex) return true
  return hashString(`${vetId}|${iso}`) % 4 === 0
}

function cap(label: string) {
  const trimmed = label.replace(/\.$/, "")
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
}

export function formatSlotDay(iso: string) {
  const label = new Date(iso).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
  return cap(label)
}

export function formatSlotTime(iso: string) {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
}

export function vetDays(vet: VetClinic, booked: Set<string>, now = Date.now()): SlotDay[] {
  if (!vet.partner) return []
  const days: SlotDay[] = []
  for (let offset = 0; offset < vet.daysAhead; offset++) {
    const day = new Date(now)
    day.setHours(0, 0, 0, 0)
    day.setDate(day.getDate() + offset)
    if (vet.closedDays.includes(day.getDay())) continue
    const remaining: string[] = []
    for (const hm of vet.hours) {
      const [h, m] = hm.split(":").map(Number)
      const slot = new Date(day)
      slot.setHours(h, m, 0, 0)
      if (slot.getTime() <= now + 20 * 60 * 1000) continue
      remaining.push(toLocalIso(slot))
    }
    if (!remaining.length) continue
    const iso = remaining[0]
    days.push({
      key: iso.slice(0, 10),
      label: formatSlotDay(iso),
      weekday: cap(new Date(iso).toLocaleDateString("fr-FR", { weekday: "short" })),
      dayNumber: new Date(iso).toLocaleDateString("fr-FR", { day: "numeric" }),
      month: cap(new Date(iso).toLocaleDateString("fr-FR", { month: "short" })),
      slots: remaining.map((slotIso, index) => ({
        iso: slotIso,
        available: !booked.has(`${vetLabel(vet)}|${slotIso}`) && !heldByClinic(vet.id, slotIso, index, remaining.length),
      })),
    })
  }
  return days
}

export function availableSlots(vet: VetClinic, booked: Set<string>, now = Date.now()) {
  return vetDays(vet, booked, now).flatMap((day) => day.slots.filter((slot) => slot.available).map((slot) => slot.iso))
}

export function nextSlot(vet: VetClinic, booked: Set<string>, now = Date.now()) {
  return availableSlots(vet, booked, now)[0] ?? null
}

export function filterAndSortVets(
  list: VetClinic[],
  filter: EmergencyFilter,
  partnerFilter: PartnerFilter,
  sort: VetSort,
  booked: Set<string>,
  now = Date.now(),
) {
  let filtered = filter === "emergency" ? list.filter((vet) => vet.emergency) : list
  if (partnerFilter === "partner") filtered = filtered.filter((vet) => vet.partner)
  if (partnerFilter === "other") filtered = filtered.filter((vet) => !vet.partner)
  return [...filtered].sort((a, b) => {
    if (sort === "distance") return a.distanceKm - b.distanceKm
    const slotA = nextSlot(a, booked, now)
    const slotB = nextSlot(b, booked, now)
    if (!slotA && !slotB) return a.distanceKm - b.distanceKm
    if (!slotA) return 1
    if (!slotB) return -1
    return slotA.localeCompare(slotB) || a.distanceKm - b.distanceKm
  })
}
