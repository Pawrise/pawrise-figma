import { useApp } from "../app-context"
import Icon from "./Icon"
import Sheet from "./Sheet"

type Props = { open: boolean; onClose: () => void }

export default function DogSelector({ open, onClose }: Props) {
  const { dogs, currentDog, setCurrentDogId, setAddingDog } = useApp()

  return (
    <Sheet open={open} onClose={onClose} title="Mes chiens">
      <div className="space-y-2.5">
        {dogs.map((d) => {
          const active = d.id === currentDog.id
          return (
            <button
              key={d.id}
              onClick={() => {
                setCurrentDogId(d.id)
                onClose()
              }}
              className={`flex w-full items-center gap-3 rounded-3xl border p-3 text-left transition-colors active:scale-[0.99] ${
                active ? "border-primary/60 bg-elevated" : "border-hairline bg-background/40"
              }`}
            >
              <img
                src={d.photo}
                alt={`Photo de ${d.name}`}
                className="h-12 w-12 rounded-2xl object-cover"
                style={{ backgroundColor: "var(--pw-color-avatar-backdrop)" }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-[15.5px] font-semibold">{d.name}</p>
                <p className="text-[12px] text-muted-foreground">{d.breed}</p>
              </div>
              {active ? (
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Icon name="check" size={16} strokeWidth={2.6} />
                </span>
              ) : (
                <Icon name="chevron-right" size={18} strokeWidth={2.2} className="text-muted-foreground" />
              )}
            </button>
          )
        })}
      </div>

      <button
        onClick={() => {
          onClose()
          setAddingDog(true)
        }}
        className="mt-3 flex w-full items-center gap-3 rounded-3xl border border-dashed border-hairline p-3 text-left active:scale-[0.99]"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <Icon name="plus" size={24} strokeWidth={2.4} />
        </span>
        <span className="text-[15.5px] font-semibold">Ajouter un chien</span>
      </button>
    </Sheet>
  )
}
