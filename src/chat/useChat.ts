import { useEffect, useRef, useState } from "react"
import { alertSeed, greeting, pawriseReply, uid, type ChatMessage, type QuickReply } from "./scripts"
import type { Dog } from "../data/mock"
import { useStoredState } from "../state/storage"
export function useChat(dog: Dog, anomaly: boolean) {
  const [threads, setThreads] = useStoredState<Record<string, ChatMessage[]>>("chats", {})
  const [pending, setPending] = useState<Record<string, number>>({})
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>())
  useEffect(() => () => { timers.current.forEach(clearTimeout) }, [])
  const append = (message: ChatMessage) => setThreads(all => ({ ...all, [dog.id]: [...(all[dog.id] ?? [greeting(dog)]).map(m => ({ ...m, quickReplies: undefined })), message] }))
  const respond = (text: string, key: string) => {
    if (!text.trim()) return
    append({ id: uid(), role: "user", text: text.trim() })
    setPending(p => ({ ...p, [dog.id]: (p[dog.id] ?? 0) + 1 }))
    const timer = setTimeout(() => {
      append(pawriseReply(key, dog, anomaly))
      setPending(p => ({ ...p, [dog.id]: Math.max(0, (p[dog.id] ?? 1) - 1) }))
      timers.current.delete(timer)
    }, 950)
    timers.current.add(timer)
  }
  return {
    messages: threads[dog.id] ?? [greeting(dog)], isTyping: (pending[dog.id] ?? 0) > 0,
    selectQuick: (reply: QuickReply) => respond(reply.label, reply.key),
    sendText: (text: string) => respond(text, text.toLowerCase()),
    seedAlert: () => append(alertSeed(dog)),
  }
}
export type ChatController = ReturnType<typeof useChat>
