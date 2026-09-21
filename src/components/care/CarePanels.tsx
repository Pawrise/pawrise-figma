import { useEffect, useState } from "react"
import { useApp } from "../../app-context"
import Sheet from "../Sheet"
import Alerts from "./Alerts"
import Reminders from "./Reminders"
export default function CarePanels({ panel, onClose }: { panel: "alerts" | "reminders" | null; onClose: () => void }) {
  const { care } = useApp()
  const [now, setNow] = useState(Date.now())
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 60000); return () => clearInterval(timer) }, [])
  useEffect(() => {
    care.reminders.filter(r => !r.done && new Date(r.date).getTime() <= now + 86400000).forEach(r => {
      care.notify(r.dogId, `Soin à prévoir : ${r.title}`, "reminder", `reminder:${r.id}:${r.date}`)
    })
  }, [care.reminders, now])
  return <Sheet open={!!panel} onClose={onClose} title={panel === "alerts" ? "Notifications & alertes" : "Rappels de soins"}>
    {panel === "alerts" && <Alerts onClose={onClose} />}
    {panel === "reminders" && <Reminders />}
  </Sheet>
}
