import { useState } from "react"
import { useApp } from "../../app-context"
import { field, button } from "./styles"
import type { Reminder } from "../../state/care"
export default function Reminders() {
  const { currentDog, care } = useApp()
  const [editing, setEditing] = useState<Reminder | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [kind, setKind] = useState("Vaccin")
  const [date, setDate] = useState("")
  const [error, setError] = useState("")
  const list = care.reminders.filter(r => r.dogId === currentDog.id).sort((a,b) => a.date.localeCompare(b.date))
  const save = () => {
    if (!title.trim() || !date || !Number.isFinite(new Date(date).getTime())) { setError("Renseignez le soin et son échéance."); return }
    const reminder: Reminder = { id: editing?.id ?? crypto.randomUUID(), dogId: currentDog.id, title: title.trim(), kind, date, done: editing?.done ?? false }
    care.setReminders(rs => editing ? rs.map(r => r.id === editing.id ? reminder : r) : [...rs, reminder])
    setFormOpen(false); setEditing(null)
  }
  return <div className="space-y-3"><p className="text-sm text-muted-foreground">Les soins de {currentDog.name}. Les échéances à moins de 24 h apparaissent dans les alertes à l'ouverture de l'application.</p>
    <button className={button} onClick={() => { setEditing(null); setTitle(""); setDate(""); setError(""); setFormOpen(true) }}>Ajouter un rappel</button>
    {formOpen && <form className="space-y-3 rounded-2xl bg-background/40 p-3" onSubmit={e => { e.preventDefault(); save() }}>
      <label className="block">Type de soin<select className={field} value={kind} onChange={e => setKind(e.target.value)}><option>Vaccin</option><option>Traitement</option><option>Autre soin</option></select></label>
      <label className="block">Nom du soin<input className={field} required value={title} onChange={e => setTitle(e.target.value)} /></label>
      <label className="block">Échéance<input className={field} type="datetime-local" required value={date} onChange={e => setDate(e.target.value)} /></label>
      {error && <p role="alert">{error}</p>}<button className={button}>Enregistrer le rappel</button><button type="button" className="ml-3" onClick={() => setFormOpen(false)}>Annuler</button>
    </form>}
    {!list.length && <p className="py-5 text-muted-foreground">Aucun rappel pour {currentDog.name}.</p>}
    {list.map(r => <article key={r.id} className="space-y-2 rounded-2xl border border-hairline p-3"><p className="text-xs text-primary">{r.kind} · {r.done ? "Effectué" : new Date(r.date).getTime() < Date.now() ? "En retard" : "À venir"}</p><h3 className="font-bold">{r.title}</h3><p className="text-sm">{new Date(r.date).toLocaleString("fr-FR")}</p><div className="flex flex-wrap gap-3 text-sm">
      <button onClick={() => care.setReminders(rs => rs.map(x => x.id === r.id ? { ...x, done: !x.done } : x))}>{r.done ? "Rouvrir" : "Marquer effectué"}</button>
      <button onClick={() => { setEditing(r); setTitle(r.title); setDate(r.date); setKind(r.kind); setFormOpen(true); setError("") }}>Modifier</button>
      <button onClick={() => { care.setReminders(rs => rs.filter(x => x.id !== r.id)); care.setNotices(ns => ns.filter(n => !n.id.startsWith(`reminder:${r.id}:`))) }}>Supprimer</button>
    </div></article>)}
  </div>
}
