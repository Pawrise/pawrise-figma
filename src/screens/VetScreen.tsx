import Vet from "../components/care/Vet"

export default function VetScreen() {
  return (
    <div
      className="no-scrollbar h-full overflow-y-auto px-4 pb-6"
      style={{ paddingTop: "calc(var(--pw-safe-top) + 14px)" }}
    >
      <Vet />
    </div>
  )
}
