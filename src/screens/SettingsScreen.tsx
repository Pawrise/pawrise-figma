import { useStoredState, resetDemo } from "../state/storage"
import { useState } from "react"
import { useApp } from "../app-context"
import Icon, { type IconName } from "../components/Icon"
import Sheet from "../components/Sheet"

export default function SettingsScreen() {
  const { user } = useApp()
  const [resetOpen, setResetOpen] = useState(false)
  const [editUser, setEditUser] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)

  const [locShare, setLocShare] = useStoredState("locShare", true)
  const [healthNotif, setHealthNotif] = useStoredState("healthNotif", true)
  const [anonData, setAnonData] = useStoredState("anonData", false)

  return (
    <div
      className="no-scrollbar h-full overflow-y-auto px-4 pb-6"
      style={{ paddingTop: "calc(env(safe-area-inset-top) + 14px)" }}
    >
      <h1 className="mb-5 text-[26px] font-bold">Paramètres</h1>

      {/* user profile */}
      <button
        onClick={() => setEditUser(true)}
        className="mb-6 flex w-full items-center gap-3 rounded-3xl border border-hairline bg-card p-4 text-left active:scale-[0.99]"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-[19px] font-bold text-primary-foreground">
          {initials(user.name)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[16px] font-bold">{user.name}</p>
          <p className="truncate text-[12.5px] text-muted-foreground">{user.email}</p>
        </div>
        <Icon name="pencil" size={17} strokeWidth={2} className="shrink-0 text-muted-foreground" />
      </button>

      {/* co-owners / sharing */}
      <SectionTitle>Propriétaires &amp; partage</SectionTitle>
      <SharingSection onInvite={() => setInviteOpen(true)} />

      {/* privacy */}
      <SectionTitle>Confidentialité</SectionTitle>
      <div className="mb-6 divide-y divide-[var(--color-border)] overflow-hidden rounded-3xl border border-hairline bg-card">
        <ToggleRow icon="map" label="Partage de localisation" hint="Partager la position en temps réel" value={locShare} onChange={setLocShare} />
        <ToggleRow icon="heart" label="Notifications santé" hint="Alertes en cas d'anomalie détectée" value={healthNotif} onChange={setHealthNotif} />
        <ToggleRow icon="lock" label="Données anonymisées" hint="Contribuer à la recherche vétérinaire" value={anonData} onChange={setAnonData} />
      </div>

      {/* legal */}
      <SectionTitle>Légal</SectionTitle>
      <div className="mb-6 divide-y divide-[var(--color-border)] overflow-hidden rounded-3xl border border-hairline bg-card">
        <LinkRow icon="doc" label="Conditions d'utilisation" />
        <LinkRow icon="shield" label="Politique de confidentialité" />
        <LinkRow icon="doc" label="Licences open source" />
      </div>

      <p className="text-center text-[12px] text-muted-foreground/70">Pawrise · Version 1.0.0</p>

      <button className="my-4 w-full rounded-2xl border border-hairline p-3 text-sm" onClick={() => setResetOpen(true)}>Réinitialiser la démonstration</button>
      <Sheet open={resetOpen} onClose={() => setResetOpen(false)} title="Réinitialiser la démonstration"><p>Les chiens, messages, rappels et rendez-vous enregistrés sur cet appareil seront effacés.</p><button className="mt-4 rounded-2xl bg-primary p-3 text-primary-foreground" onClick={resetDemo}>Effacer les données de démonstration</button><button className="ml-3" onClick={() => setResetOpen(false)}>Annuler</button></Sheet>
      {editUser && <UserEditSheet open onClose={() => setEditUser(false)} />}
      <InviteSheet open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </div>
  )
}

/* ---------- sharing / co-owners ---------- */

function SharingSection({ onInvite }: { onInvite: () => void }) {
  const { dogs, user } = useApp()
  return (
    <div className="mb-6">
      <div className="space-y-2">
        {dogs.map((d) => {
          const coOwners = d.coOwners ?? []
          return (
            <div key={d.id} className="rounded-3xl border border-hairline bg-card p-3">
              <div className="flex items-center gap-3">
                <img
                  src={d.photo}
                  alt={`Photo de ${d.name}`}
                  className="h-11 w-11 rounded-2xl object-cover"
                  style={{ backgroundColor: "var(--pw-color-avatar-backdrop)" }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-semibold">{d.name}</p>
                  <p className="truncate text-[12px] text-muted-foreground">
                    {coOwners.length + 1} propriétaire{coOwners.length + 1 > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="mt-2.5 space-y-1.5">
                <OwnerRow label={user.name} sub="Vous · propriétaire" />
                {coOwners.map((email) => (
                  <OwnerRow key={email} label={email} sub="Invité · en attente" pending />
                ))}
              </div>
            </div>
          )
        })}
      </div>
      <button
        onClick={onInvite}
        className="mt-2 flex w-full items-center gap-3 rounded-3xl border border-dashed border-hairline p-3 text-left active:scale-[0.99]"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <Icon name="user-plus" size={22} strokeWidth={2} />
        </span>
        <span>
          <span className="block text-[15px] font-semibold">Inviter un propriétaire</span>
          <span className="block text-[12px] text-muted-foreground">Partager l'accès à l'un de vos chiens</span>
        </span>
      </button>
    </div>
  )
}

function OwnerRow({ label, sub, pending }: { label: string; sub: string; pending?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl bg-background/40 px-3 py-2">
      <span
        className="flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold"
        style={
          pending
            ? { background: "var(--color-watch-soft)", color: "var(--color-watch)" }
            : { background: "var(--color-primary)", color: "var(--color-primary-foreground)" }
        }
      >
        {pending ? <Icon name="user" size={15} strokeWidth={2} /> : initials(label)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] font-medium">{label}</p>
        <p className="truncate text-[11px] text-muted-foreground">{sub}</p>
      </div>
    </div>
  )
}

function InviteSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { dogs, updateDog, user } = useApp()
  const [dogId, setDogId] = useState(dogs[0]?.id ?? "")
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

  const normalized = email.trim().toLowerCase()
  const duplicate = normalized === user.email.toLowerCase() || dogs.find(d => d.id === dogId)?.coOwners?.some(e => e.toLowerCase() === normalized)
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) && !duplicate

  const send = () => {
    const dog = dogs.find((d) => d.id === dogId)
    if (!dog || !valid) return
    updateDog(dog.id, { coOwners: [...(dog.coOwners ?? []), normalized] })
    setSent(true)
  }

  const close = () => {
    setSent(false)
    setEmail("")
    onClose()
  }

  return (
    <Sheet open={open} onClose={close} title="Inviter un propriétaire">
      {sent ? (
        <div className="flex flex-col items-center py-6 text-center">
          <span
            className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
            style={{ background: "var(--color-good-soft)", color: "var(--color-good)" }}
          >
            <Icon name="check" size={30} strokeWidth={2.6} />
          </span>
          <h3 className="text-[18px] font-bold">Invitation envoyée</h3>
          <p className="mt-2 max-w-[16rem] text-[13.5px] leading-snug text-muted-foreground">
            {email.trim()} a été ajouté aux invitations de {dogs.find((d) => d.id === dogId)?.name}.
          </p>
          <button
            onClick={close}
            className="mt-6 w-full rounded-2xl bg-primary py-4 text-[16px] font-bold text-primary-foreground active:scale-[0.99]"
          >
            Terminé
          </button>
        </div>
      ) : (
        <>
          <p className="mb-4 text-[13.5px] leading-snug text-muted-foreground">
            Un chien peut avoir plusieurs propriétaires. La personne invitée aura accès à la localisation et à la santé
            du chien sélectionné.
          </p>

          <span className="mb-2 block px-1 text-[12px] font-semibold text-muted-foreground">Chien à partager</span>
          <div className="mb-4 space-y-2">
            {dogs.map((d) => {
              const active = d.id === dogId
              return (
                <button
                  key={d.id}
                  onClick={() => setDogId(d.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-2.5 text-left transition-colors ${
                    active ? "border-primary/60 bg-elevated" : "border-hairline bg-background/40"
                  }`}
                >
                  <img
                    src={d.photo}
                    alt={`Photo de ${d.name}`}
                    className="h-10 w-10 rounded-xl object-cover"
                    style={{ backgroundColor: "var(--pw-color-avatar-backdrop)" }}
                  />
                  <span className="flex-1 text-[14.5px] font-semibold">{d.name}</span>
                  {active && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Icon name="check" size={14} strokeWidth={2.6} />
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <label className="block">
            <span className="mb-1.5 block px-1 text-[12px] font-semibold text-muted-foreground">E-mail du propriétaire</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="prenom@email.com"
              className="w-full rounded-2xl border border-hairline bg-background/40 px-4 py-3 text-[15px] outline-none focus:border-primary/60"
            />
          </label>

          {duplicate && <p role="alert" className="mt-2 text-sm text-watch">Ce propriétaire est déjà associé ou invité.</p>}
          <button
            onClick={send}
            disabled={!valid || !dogId}
            className="mt-5 w-full rounded-2xl bg-primary py-4 text-[16px] font-bold text-primary-foreground active:scale-[0.99] disabled:opacity-40"
          >
            Envoyer l'invitation
          </button>
        </>
      )}
    </Sheet>
  )
}

/* ---------- small building blocks ---------- */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-2 px-1 text-[12px] font-bold uppercase tracking-wider text-muted-foreground">{children}</h2>
}

function ToggleRow({
  icon,
  label,
  hint,
  value,
  onChange,
}: {
  icon: IconName
  label: string
  hint: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-elevated text-muted-foreground">
        <Icon name={icon} size={18} strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-medium">{label}</p>
        <p className="text-[11.5px] text-muted-foreground">{hint}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        role="switch"
        aria-checked={value}
        aria-label={label}
        className="relative h-6 w-11 shrink-0 rounded-full transition-colors"
        style={{ background: value ? "var(--color-primary)" : "var(--pw-color-subtle-strong)" }}
      >
        <span
          className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all"
          style={{ left: value ? "22px" : "2px" }}
        />
      </button>
    </div>
  )
}

function LinkRow({ icon, label }: { icon: IconName; label: string }) {
  const [open, setOpen] = useState(false)
  return (
    <><button onClick={() => setOpen(true)} className="flex w-full items-center gap-3 px-4 py-3.5 text-left active:bg-elevated">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-elevated text-muted-foreground">
        <Icon name={icon} size={18} strokeWidth={2} />
      </span>
      <span className="flex-1 text-[14px]">{label}</span>
      <Icon name="chevron-right" size={17} strokeWidth={2.2} className="text-muted-foreground" />
    </button><Sheet open={open} onClose={() => setOpen(false)} title={label}><p className="text-sm leading-relaxed">{label === "Licences open source" ? "React, Vite et Tailwind CSS : licences MIT. Les dépendances et leurs notices sont conservées dans le projet. Photos : Unsplash. Polices : Google Fonts." : "Pawrise accompagne le suivi de votre chien : santé, localisation, collier et rendez-vous. Les données de cet appareil restent sur cet appareil. Les photos et polices en ligne proviennent d’Unsplash et Google Fonts."}</p></Sheet></>
  )
}

function UserEditSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, setUser } = useApp()
  const [form, setForm] = useState(user)

  const fieldCls =
    "w-full rounded-2xl border border-hairline bg-background/40 px-4 py-3 text-[15px] outline-none focus:border-primary/60"

  const save = () => {
    if (!form.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return
    setUser({ ...form, name: form.name.trim(), email: form.email.trim() })
    onClose()
  }

  return (
    <Sheet open={open} onClose={onClose} title="Mon profil">
      <div className="mb-4 flex justify-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary text-2xl font-bold text-primary-foreground">
          {initials(form.name)}
        </span>
      </div>
      <div className="space-y-3">
        <label className="block">
          <span className="mb-1.5 block px-1 text-[12px] font-semibold text-muted-foreground">Nom</span>
          <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={fieldCls} />
        </label>
        <label className="block">
          <span className="mb-1.5 block px-1 text-[12px] font-semibold text-muted-foreground">E-mail</span>
          <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className={fieldCls} />
        </label>
        <label className="block">
          <span className="mb-1.5 block px-1 text-[12px] font-semibold text-muted-foreground">Téléphone</span>
          <input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className={fieldCls} />
        </label>
      </div>
      <button
        onClick={save}
        disabled={!form.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())}
        className="mt-5 w-full rounded-2xl bg-primary py-4 text-[16px] font-bold text-primary-foreground active:scale-[0.99]"
      >
        Enregistrer
      </button>
    </Sheet>
  )
}

function initials(name: string) {
  return name
    .split(/[ @.]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
}
