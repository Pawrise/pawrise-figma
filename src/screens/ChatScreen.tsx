import { useEffect, useRef } from "react"
import { useApp } from "../app-context"

import Icon from "../components/Icon"
import MessageBubble from "../components/chat/MessageBubble"
import QuickReplies from "../components/chat/QuickReplies"
import TypingIndicator from "../components/chat/TypingIndicator"
import Composer from "../components/chat/Composer"

export default function ChatScreen() {
  const { chat, currentDog: dog, setTab } = useApp()
  const { messages, isTyping, selectQuick, sendText } = chat
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, isTyping])

  return (
    <div className="flex h-full flex-col">
      {/* header */}
      <header
        className="z-10 flex items-center gap-3 border-b border-hairline bg-background/90 px-4 pb-3 backdrop-blur-xl"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 14px)" }}
      >
        <img
          src={dog.photo}
          alt={`Photo de ${dog.name}`}
          className="h-11 w-11 rounded-2xl object-cover"
          style={{ backgroundColor: "var(--pw-color-avatar-backdrop)" }}
        />
        <div className="min-w-0 flex-1">
          <h1 className="flex items-center gap-1.5 text-[17px] font-bold leading-none">
            Pawrise
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Icon name="paw" size={10} />
            </span>
          </h1>
          <p className="mt-1 flex items-center gap-1 text-[12px] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--color-good)" }} />
            Assistant de {dog.name} · {dog.connected ? "collier connecté" : "collier déconnecté"}
          </p>
        </div>
      </header>

      {/* messages */}
      <div ref={scrollRef} className="no-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-5">
        {messages.map((m) => (
          <div key={m.id} className="space-y-2.5">
            <MessageBubble msg={m} />
            {m.quickReplies && m.quickReplies.length > 0 && (
              <QuickReplies replies={m.quickReplies} onSelect={selectQuick} />
            )}
          </div>
        ))}
        {isTyping && <TypingIndicator />}
      </div>

      <button className="py-2 text-sm text-primary" onClick={() => setTab("vet")}>Contacter un vétérinaire</button>
      <Composer onSend={sendText} />
    </div>
  )
}
