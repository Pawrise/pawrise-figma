import { validMeasurement, validBirthDate, ageFromDate } from "../data/validation"
import { useState } from "react"
import { useApp } from "../app-context"
import type { Dog } from "../data/mock"
import Sheet from "./Sheet"

export default function DogEditSheet({ dog, onClose }: { dog: Dog | null; onClose: () => void }) {
  const { updateDog } = useApp()
  const [form, setForm] = useState<Dog | null>(dog)

  // Re-sync when a different dog is opened.
  if (dog && (!form || form.id !== dog.id)) setForm(dog)
  if (!dog || !form)
    return (
      <Sheet open={false} onClose={onClose}>
        {null}
      </Sheet>
    )

  const set = <K extends keyof Dog>(k: K, v: Dog[K]) => setForm((f) => (f ? { ...f, [k]: v } : f))

  const fieldCls =
    "w-full rounded-2xl border border-hairline bg-background/40 px-4 py-3 text-[15px] outline-none focus:border-primary/60"

  const valid = !!form.name.trim() && validBirthDate(form.dob ?? "") && validMeasurement(form.weight) && validMeasurement(form.height)
  const save = () => {
    if (!valid) return
    updateDog(dog.id, {
      name: form.name.trim() || dog.name,
      breed: form.breed,
      dob: form.dob,
      age: form.dob ? ageFromDate(form.dob) : dog.age,
      sex: form.sex,
      weight: form.weight,
      height: form.height,
      medical: form.medical?.trim() || undefined,
    })
    onClose()
  }

  return (
    <Sheet open={!!dog} onClose={onClose} title={`Modifier ${dog.name}`}>
      <div className="mb-4 flex justify-center">
        <img
          src={form.photo}
          alt={`Photo de ${form.name}`}
          className="h-20 w-20 rounded-3xl object-cover"
          style={{ backgroundColor: "var(--pw-color-avatar-backdrop)" }}
        />
      </div>
      <div className="space-y-3">
        <label className="block">
          <span className="mb-1.5 block px-1 text-[12px] font-semibold text-muted-foreground">Nom</span>
          <input value={form.name} onChange={(e) => set("name", e.target.value)} className={fieldCls} />
        </label>
        <label className="block">
          <span className="mb-1.5 block px-1 text-[12px] font-semibold text-muted-foreground">Race</span>
          <input value={form.breed} onChange={(e) => set("breed", e.target.value)} className={fieldCls} />
        </label>
        <label className="block">Date de naissance<input className={fieldCls} type="date" max={new Date().toISOString().slice(0,10)} value={form.dob ?? ""} onChange={e => set("dob", e.target.value)} /></label>
        <label className="block">Sexe<select className={fieldCls} value={form.sex ?? ""} onChange={e => set("sex", e.target.value as Dog["sex"])}><option value="">Non renseigné</option><option value="male">Mâle</option><option value="female">Femelle</option></select></label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1.5 block px-1 text-[12px] font-semibold text-muted-foreground">Poids (kg)</span>
            <input
              type="number"
              value={form.weight != null ? String(form.weight) : ""}
              onChange={(e) => set("weight", e.target.value === "" ? undefined : Number(e.target.value))}
              className={fieldCls}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block px-1 text-[12px] font-semibold text-muted-foreground">Taille (cm)</span>
            <input
              type="number"
              value={form.height != null ? String(form.height) : ""}
              onChange={(e) => set("height", e.target.value === "" ? undefined : Number(e.target.value))}
              className={fieldCls}
            />
          </label>
        </div>
        <label className="block">
          <span className="mb-1.5 block px-1 text-[12px] font-semibold text-muted-foreground">Infos santé</span>
          <textarea
            value={form.medical ?? ""}
            onChange={(e) => set("medical", e.target.value)}
            rows={4}
            placeholder="Conditions, traitements, allergies… (facultatif)"
            className="w-full resize-none rounded-2xl border border-hairline bg-background/40 px-4 py-3 text-[14px] outline-none focus:border-primary/60"
          />
        </label>
      </div>
      <button
        disabled={!valid}
        onClick={save}
        className="mt-5 w-full rounded-2xl bg-primary py-4 text-[16px] font-bold text-primary-foreground active:scale-[0.99]"
      >
        Enregistrer
      </button>
    </Sheet>
  )
}
