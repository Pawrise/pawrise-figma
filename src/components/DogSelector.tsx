import { useState } from "react"
import { useApp } from "../app-context"
import type { Dog } from "../data/mock"
import Icon from "./Icon"
import Sheet from "./Sheet"
import DogEditSheet from "./DogEditSheet"

type Props = {
  open: boolean
  onClose: () => void
}

export default function DogSelector({ open, onClose }: Props) {
  const { dogs, currentDog, setCurrentDogId, setAddingDog } = useApp()
  const [editing, setEditing] = useState<Dog | null>(null)

  const close = () => {
    setEditing(null)
    onClose()
  }

  return (
    <>
      <Sheet open={open} onClose={close} title="Mes chiens">
        <div className="space-y-2.5">
          {dogs.map((d) => {
            const active = d.id === currentDog.id
            return (
              <div
                key={d.id}
                className={`flex items-center gap-2 rounded-3xl border p-2.5 ${
                  active
                    ? "border-primary/60 bg-elevated"
                    : "border-hairline bg-background/40"
                }`}
              >
                <button
                  onClick={() => {
                    setCurrentDogId(d.id)
                    close()
                  }}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left active:scale-[0.99]"
                >
                  <img
                    src={d.photo}
                    alt={`Photo de ${d.name}`}
                    className="h-12 w-12 rounded-2xl object-cover"
                    style={{
                      backgroundColor: "var(--pw-color-avatar-backdrop)",
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[15.5px] font-semibold">{d.name}</p>
                    <p className="text-[12px] text-muted-foreground">
                      {d.breed}
                    </p>
                  </div>
                  {active ? (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Icon name="check" size={16} strokeWidth={2.6} />
                    </span>
                  ) : (
                    <Icon
                      name="chevron-right"
                      size={18}
                      strokeWidth={2.2}
                      className="text-muted-foreground"
                    />
                  )}
                </button>
                <button
                  onClick={() => setEditing(d)}
                  aria-label={`Modifier les infos de ${d.name}`}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-hairline bg-card text-muted-foreground active:scale-95"
                >
                  <Icon name="pencil" size={17} strokeWidth={2} />
                </button>
              </div>
            )
          })}
        </div>

        <button
          onClick={() => {
            close()
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
      {editing && (
        <div className="absolute inset-0 z-50">
          <DogEditSheet dog={editing} onClose={() => setEditing(null)} />
        </div>
      )}
    </>
  )
}
