import Icon from "../Icon"
import type { ChatMessage } from "../../chat/scripts"

export default function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user"
  return (
    <div
      className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}
      style={{ animation: "pw-rise 260ms ease-out" }}
    >
      {!isUser && (
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Icon name="paw" size={15} />
        </span>
      )}
      <div
        className={`max-w-[78%] px-4 py-2.5 text-[14.5px] leading-relaxed shadow-md ${
          isUser
            ? "rounded-[20px] rounded-br-md bg-primary text-primary-foreground"
            : "rounded-[20px] rounded-bl-md border border-hairline bg-card text-card-foreground"
        }`}
      >
        {msg.text}
      </div>
    </div>
  )
}
