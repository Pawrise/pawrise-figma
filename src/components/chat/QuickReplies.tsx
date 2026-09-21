import type { QuickReply } from "../../chat/scripts"

type Props = { replies: QuickReply[]; onSelect: (r: QuickReply) => void }

export default function QuickReplies({ replies, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2 pl-9" style={{ animation: "pw-rise 260ms ease-out" }}>
      {replies.map((r) => (
        <button
          key={r.key}
          onClick={() => onSelect(r)}
          className="rounded-full border border-primary/50 bg-primary/10 px-3.5 py-2 text-[13px] font-semibold text-primary transition-colors hover:bg-primary/20 active:scale-95"
        >
          {r.label}
        </button>
      ))}
    </div>
  )
}
