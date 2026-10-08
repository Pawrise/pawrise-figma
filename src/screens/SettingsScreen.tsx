import { useStoredState, resetDemo } from "../state/storage"
import { useState, type ReactNode } from "react"
import { useApp } from "../app-context"
import Icon, { type IconName } from "../components/Icon"
import Sheet from "../components/Sheet"
import { myRole, resolveOwners, withChief } from "../data/owners"
import type { DogOwner } from "../data/mock"
import { DestroyAccountPage, PrivacyPage, RgpdPage, TermsPage } from "./SettingsPages"

type SettingsPage = "terms" | "privacy" | "rgpd" | "destroy"

export default function SettingsScreen() {
  const { user, logout, destroyAccount } = useApp()
  const [resetOpen, setResetOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [editUser, setEditUser] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [page, setPage] = useState<SettingsPage | null>(null)
  const closePage = () => setPage(null)

  const [locShare, setLocShare] = useStoredState("locShare", true)
  const [healthNotif, setHealthNotif] = useStoredState("healthNotif", true)
  const [anonData, setAnonData] = useStoredState("anonData", false)

  return (
    <div
      className="no-scrollbar h-full overflow-y-auto px-4 pb-6"
      style={{ paddingTop: "calc(var(--pw-safe-top) + 14px)" }}
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
        <LinkRow icon="doc" label="Conditions d'utilisation" onClick={() => setPage("terms")} />
        <LinkRow icon="shield" label="Politique de confidentialité" onClick={() => setPage("privacy")} />
        <LinkRow icon="lock" label="Données vétérinaires" hint="RGPD, export et archivage" onClick={() => setPage("rgpd")} />
      </div>

      <SectionTitle>Compte</SectionTitle>
      <div className="mb-6 space-y-2">
        <button className="w-full rounded-2xl border border-hairline bg-card p-3 text-sm font-semibold" onClick={() => setLogoutOpen(true)}>Se déconnecter</button>
        <button className="w-full rounded-2xl border border-alert/40 bg-card p-3 text-sm font-semibold text-alert" onClick={() => setPage("destroy")}>Détruire le compte</button>
      </div>

      <p className="text-center text-[12px] text-muted-foreground/70">Pawrise · Version 1.0.0</p>

      <button className="my-4 w-full rounded-2xl border border-hairline p-3 text-sm" onClick={() => setResetOpen(true)}>Réinitialiser la démonstration</button>
      <Sheet open={logoutOpen} onClose={() => setLogoutOpen(false)} title="Se déconnecter">
        <p>Votre session se ferme sur cet appareil. Vous pourrez vous reconnecter avec votre e-mail et votre mot de passe.</p>
        <button className="mt-4 rounded-2xl bg-primary p-3 text-primary-foreground" onClick={logout}>Se déconnecter</button>
        <button className="ml-3" onClick={() => setLogoutOpen(false)}>Annuler</button>
      </Sheet>
      <Sheet open={resetOpen} onClose={() => setResetOpen(false)} title="Réinitialiser la démonstration"><p>Les chiens, messages, rappels et rendez-vous enregistrés sur cet appareil seront effacés.</p><button className="mt-4 rounded-2xl bg-primary p-3 text-primary-foreground" onClick={resetDemo}>Effacer les données de démonstration</button><button className="ml-3" onClick={() => setResetOpen(false)}>Annuler</button></Sheet>
      {editUser && <UserEditSheet open onClose={() => setEditUser(false)} />}
      <InviteSheet open={inviteOpen} onClose={() => setInviteOpen(false)} />
      {page === "terms" && <TermsPage onBack={closePage} />}
      {page === "privacy" && <PrivacyPage onBack={closePage} />}
      {page === "rgpd" && <RgpdPage onBack={closePage} />}
      {page === "destroy" && <DestroyAccountPage onBack={closePage} onConfirm={destroyAccount} />}
    </div>
  )
}

/* ---------- sharing / co-owners ---------- */

function SharingSection({ onInvite }: { onInvite: () => void }) {
  const { dogs, user, updateDog } = useApp()
  const [transfer, setTransfer] = useState<{ dogId: string; email: string } | null>(null)
  const transferDog = dogs.find((dog) => dog.id === transfer?.dogId)
  const transferOwners = transferDog ? resolveOwners(transferDog, user) : []
  const transferTarget = transferOwners.find((owner) => owner.email.toLowerCase() === transfer?.email.toLowerCase())

  const giveChief = () => {
    if (!transferDog || !transferTarget || transferTarget.pending) return
    if (myRole(transferDog, user) !== "chief") return
    updateDog(transferDog.id, { owners: withChief(transferOwners, transferTarget.email) })
    setTransfer(null)
  }

  return (
    <div className="mb-6">
      <div className="space-y-2">
        {dogs.map((d) => {
          const owners = resolveOwners(d, user)
          const active = owners.filter((owner) => !owner.pending)
          const mine = owners.find((owner) => owner.email.toLowerCase() === user.email.toLowerCase())
          const iAmChief = mine?.role === "chief"
          const seconds = owners.filter((owner) => !owner.pending && owner.role === "secondary")
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
                    {active.length} propriétaire{active.length > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="mt-2.5 space-y-1.5">
                {owners.map((owner) => (
                  <OwnerRow
                    key={owner.email}
                    owner={owner}
                    you={owner.email.toLowerCase() === user.email.toLowerCase()}
                    action={
                      iAmChief && !owner.pending && owner.role === "secondary" ? (
                        <button
                          onClick={() => setTransfer({ dogId: d.id, email: owner.email })}
                          className="mt-2 text-[13px] font-semibold text-primary"
                        >
                          Donner le rôle de chef
                        </button>
                      ) : null
                    }
                  />
                ))}
              </div>
              {iAmChief && seconds.length > 0 && (
                <p className="mt-2 px-1 text-[12px] leading-snug text-muted-foreground">
                  Vous êtes propriétaire chef. Seul le chef peut donner ce rôle à un autre propriétaire.
                </p>
              )}
              {!iAmChief && (
                <p className="mt-2 px-1 text-[12px] leading-snug text-muted-foreground">
                  Seul le propriétaire chef peut donner ce rôle à un autre propriétaire.
                </p>
              )}
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
      <Sheet open={transfer !== null} onClose={() => setTransfer(null)} title="Rôle de chef">
        <p className="text-[14px] leading-relaxed">
          {transferTarget?.name} devient propriétaire chef de {transferDog?.name}. Vous devenez propriétaire second.
        </p>
        <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
          Seul le propriétaire chef peut détruire les données du collier et le réinitialiser. Un propriétaire second peut détruire son compte, sans toucher au collier.
        </p>
        <button
          onClick={giveChief}
          className="mt-5 w-full rounded-2xl bg-primary py-4 text-[16px] font-bold text-primary-foreground active:scale-[0.99]"
        >
          Donner le rôle de chef
        </button>
        <button onClick={() => setTransfer(null)} className="mt-2 w-full rounded-2xl py-3 text-sm font-semibold text-muted-foreground">
          Annuler
        </button>
      </Sheet>
    </div>
  )
}

function OwnerRow({ owner, you, action }: { owner: DogOwner; you: boolean; action?: ReactNode }) {
  const pending = owner.pending
  const badge = pending ? "En attente" : owner.role === "chief" ? "Chef" : "Second"
  const sameAsEmail = owner.name.trim().toLowerCase() === owner.email.trim().toLowerCase()
  const sub = pending ? "Invitation envoyée" : you ? "Vous" : sameAsEmail ? "" : owner.email
  return (
    <div className="rounded-2xl bg-background/40 px-3 py-2">
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold"
          style={
            pending
              ? { background: "var(--color-watch-soft)", color: "var(--color-watch)" }
              : owner.role === "chief"
                ? { background: "var(--color-primary)", color: "var(--color-primary-foreground)" }
                : { background: "var(--color-elevated)", color: "var(--color-foreground)" }
          }
        >
          {pending ? <Icon name="user" size={15} strokeWidth={2} /> : initials(owner.name)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] font-medium">{owner.name}</p>
          {sub && <p className="truncate text-[11px] text-muted-foreground">{sub}</p>}
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
            pending ? "bg-watch-soft text-watch" : owner.role === "chief" ? "bg-primary text-primary-foreground" : "bg-elevated text-foreground"
          }`}
        >
          {badge}
        </span>
      </div>
      {action}
    </div>
  )
}

function InviteSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { dogs, updateDog, user } = useApp()
  const [dogId, setDogId] = useState(dogs[0]?.id ?? "")
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

  const dog = dogs.find((item) => item.id === dogId)
  const owners = dog ? resolveOwners(dog, user) : []
  const normalized = email.trim().toLowerCase()
  const duplicate = owners.some((owner) => owner.email.toLowerCase() === normalized)
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) && !duplicate

  const send = () => {
    if (!dog || !valid) return
    updateDog(dog.id, {
      owners: [...owners, { name: normalized, email: normalized, role: "secondary" }],
    })
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
            {email.trim()} est propriétaire second de {dogs.find((d) => d.id === dogId)?.name}.
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
            La personne invitée aura accès à la localisation et à la santé, comme propriétaire second. Seul le propriétaire chef peut lui donner ce rôle.
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

function SectionTitle({ children }: { children: ReactNode }) {
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

function LinkRow({ icon, label, hint, onClick }: { icon: IconName; label: string; hint?: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 px-4 py-3.5 text-left active:bg-elevated">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-elevated text-muted-foreground">
        <Icon name={icon} size={18} strokeWidth={2} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px]">{label}</span>
        {hint && <span className="block text-[11.5px] text-muted-foreground">{hint}</span>}
      </span>
      <Icon name="chevron-right" size={17} strokeWidth={2.2} className="text-muted-foreground" />
    </button>
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
