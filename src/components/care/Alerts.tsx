import { useState } from "react"
import { useApp } from "../../app-context"
import { field, button } from "./styles"
export default function Alerts({ onClose }: { onClose: () => void }) {
  const { care, dogs, setCurrentDogId, setTab, openPanel } = useApp()
  const [filter, setFilter] = useState("all")
  const notices = care.notices.filter(n => filter === "all" || !n.read)
  return <div className="space-y-3">
    <div className="flex gap-2"><button className={button} onClick={() => setFilter(filter === "all" ? "unread" : "all")}>{filter === "all" ? "Afficher les non lues" : "Tout afficher"}</button><button onClick={() => care.setNotices(ns => ns.map(n => ({ ...n, read: true })))}>Tout marquer comme lu</button></div>
    {!notices.length && <p className="py-6 text-muted-foreground">Aucune notification à afficher.</p>}
    {notices.map(n => <button key={n.id} className="block w-full rounded-2xl border border-hairline bg-background/40 p-4 text-left" onClick={() => {
      setCurrentDogId(n.dogId)
      care.setNotices(ns => ns.map(x => x.id === n.id ? { ...x, read: true } : x))
      if (n.kind === "reminder") openPanel("reminders")
      else { setTab(n.kind === "map" ? "map" : n.kind === "vet" ? "vet" : "health"); onClose() }
    }}><span className="text-xs text-primary">{dogs.find(d => d.id === n.dogId)?.name} · {n.read ? "Lue" : "Non lue"}</span><strong className="block">{n.title}</strong><time className="text-xs text-muted-foreground">{new Date(n.date).toLocaleString("fr-FR")}</time></button>)}
  </div>
}
