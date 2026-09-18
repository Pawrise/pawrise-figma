import Icon from "../Icon"

export default function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Icon name="paw" size={15} />
      </span>
      <div className="flex items-center gap-1 rounded-[20px] rounded-bl-md border border-hairline bg-card px-4 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
            style={{ animation: `pw-blink 1s ${i * 0.18}s infinite` }}
          />
        ))}
      </div>
    </div>
  )
}
