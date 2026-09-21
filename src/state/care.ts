import { useStoredState } from "./storage"
export type Notice = { id: string; dogId: string; title: string; kind: "health" | "map" | "reminder" | "vet"; read: boolean; date: string }
export type Reminder = { id: string; dogId: string; title: string; kind: string; date: string; done: boolean }
export type Appointment = { id: string; dogId: string; clinic: string; date: string; reason: string; share: boolean; status: "confirmed" | "cancelled" }
export function useCare() {
  const [notices, setNotices] = useStoredState<Notice[]>("notices", [])
  const [reminders, setReminders] = useStoredState<Reminder[]>("reminders", [])
  const [appointments, setAppointments] = useStoredState<Appointment[]>("appointments", [])
  const notify = (dogId: string, title: string, kind: Notice["kind"], id: string = crypto.randomUUID()) => {
    setNotices(items => items.some(n => n.id === id) ? items : [{ id, dogId, title, kind, read: false, date: new Date().toISOString() }, ...items])
  }
  return { notices, setNotices, reminders, setReminders, appointments, setAppointments, notify }
}
export type CareState = ReturnType<typeof useCare>
