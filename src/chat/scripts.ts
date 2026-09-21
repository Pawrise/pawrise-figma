import type { Dog } from "../data/mock"
import { indicators } from "../data/health"
export type QuickReply = { label: string; key: string }
export type ChatMessage = { id: string; role: "user" | "pawrise"; text: string; quickReplies?: QuickReply[] }
export const uid = () => crypto.randomUUID()
export const greeting = (dog: Dog): ChatMessage => ({
  id: uid(), role: "pawrise", text: `Bonjour 👋 Je suis Pawrise, l'assistant de ${dog.name}. Que souhaitez-vous consulter ?`,
  quickReplies: [{ label: `Comment va ${dog.name} aujourd'hui ?`, key: "summary" }, { label: "Et son sommeil ?", key: "sleep" }, { label: "Voir les indicateurs", key: "summary" }],
})
export const alertSeed = (dog: Dog): ChatMessage => ({ id: uid(), role: "pawrise", text: `Une variation inhabituelle est affichée pour ${dog.name}. Consultez les indicateurs ou préparez un rendez-vous vétérinaire.`, quickReplies: [{ label: "Voir les données", key: "summary" }, { label: "Que dois-je faire ?", key: "vet" }] })
export function pawriseReply(key: string, dog: Dog, anomaly: boolean): ChatMessage {
  const summary = indicators.map(i => `${i.label} : ${(anomaly ? i.alerte : i.normal).headline}`).join(" · ")
  let text = `${dog.name} — score de bien-être : ${anomaly ? 64 : 87}/100. ${summary}. Batterie : ${dog.battery} %.`
  if (/vét|vet|faire|inqui|serious/.test(key)) text = `Ces indicateurs ne remplacent pas un diagnostic vétérinaire. Vous pouvez préparer un rendez-vous pour ${dog.name} avec « Contacter un vétérinaire ».`
  else if (/sommeil|sleep|slept/.test(key)) text = `${dog.name} — ${ (anomaly ? indicators[3].alerte : indicators[3].normal).headline }.`
  else if (/activit/.test(key)) text = `${dog.name} — ${(anomaly ? indicators[2].alerte : indicators[2].normal).headline}.`
  if (!dog.connected) text = `Le collier de ${dog.name} est déconnecté. Les valeurs affichées correspondent aux dernières mesures reçues.`
  return { id: uid(), role: "pawrise", text }
}
