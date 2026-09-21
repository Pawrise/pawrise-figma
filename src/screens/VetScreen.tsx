import Vet from "../components/care/Vet"

export default function VetScreen() {
  return (
    <div
      className="no-scrollbar h-full overflow-y-auto px-4 pb-6"
      style={{ paddingTop: "calc(env(safe-area-inset-top) + 14px)" }}
    >
      <Vet />
    </div>
  )
}
