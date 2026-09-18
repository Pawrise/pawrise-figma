import { useState } from "react"
import Icon from "../Icon"

export default function Composer({ onSend }: { onSend: (text: string) => void }) {
  const [text, setText] = useState("")

  const submit = () => {
    if (!text.trim()) return
    onSend(text)
    setText("")
  }

  return (
    <div
      className="shrink-0 border-t border-hairline bg-background/90 px-3 pt-3 backdrop-blur-xl"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 8px)" }}
    >
      <div className="flex items-center gap-2 rounded-full border border-hairline bg-card px-4 py-1.5">
        <input
          aria-label="Message à Pawrise"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Écrire un message…"
          className="min-w-0 flex-1 bg-transparent py-2 text-[15px] text-foreground outline-none placeholder:text-muted-foreground"
        />
        <button
          onClick={submit}
          disabled={!text.trim()}
          aria-label="Envoyer"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity active:scale-95 disabled:opacity-40"
        >
          <Icon name="send" size={17} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  )
}
