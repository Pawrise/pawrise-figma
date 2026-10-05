import type { ReactNode } from "react"
import { useApp } from "../app-context"
import InfoPage from "../components/InfoPage"
import { myRole, resolveOwners } from "../data/owners"
import { formatSlotDay, formatSlotTime } from "../data/vets"

const LOREM = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida.",
  "Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.",
]

export function TermsPage({ onBack }: { onBack: () => void }) {
  return (
    <InfoPage title="Conditions d'utilisation" onBack={onBack}>
      <Lorem />
    </InfoPage>
  )
}

export function PrivacyPage({ onBack }: { onBack: () => void }) {
  return (
    <InfoPage title="Politique de confidentialité" onBack={onBack}>
      <Lorem />
    </InfoPage>
  )
}

function Lorem() {
  return (
    <div className="space-y-4 text-[15px] leading-relaxed">
      {LOREM.map((paragraph) => (
        <p key={paragraph.slice(0, 24)}>{paragraph}</p>
      ))}
    </div>
  )
}

export function RgpdPage({ onBack }: { onBack: () => void }) {
  return (
    <InfoPage title="Données vétérinaires" onBack={onBack}>
      <p className="text-[15px] leading-relaxed">
        Au titre du RGPD, un dossier ne part vers une clinique que si vous l'activez, au moment de confirmer le rendez-vous. Voici ce qui est exporté, qui le reçoit, et ce qui reste archivé.
      </p>

      <Block title="Ce que vous pouvez exporter">
        <p>
          Le réglage « Transmettre le dossier » est désactivé tant que vous ne l'activez pas. S'il reste désactivé, la clinique ne reçoit que le motif du rendez-vous.
        </p>
        <p>S'il est activé, la clinique partenaire reçoit :</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>le profil du chien : nom, race, âge, poids</li>
          <li>les informations médicales que vous avez renseignées</li>
          <li>les dernières mesures du collier : rythme cardiaque, activité, sommeil, température</li>
          <li>le motif du rendez-vous</li>
        </ul>
      </Block>

      <Block title="Qui reçoit ces données">
        <p>
          Uniquement la clinique partenaire Pawrise choisie pour ce rendez-vous. Personne d'autre dans l'application n'a accès à cet envoi.
        </p>
        <p>
          Une clinique hors réseau ne peut pas recevoir les mesures du collier. Pawrise affiche son adresse et son téléphone pour que vous preniez rendez-vous vous-même.
        </p>
      </Block>

      <Block title="Archivage chez le vétérinaire">
        <p>
          Le rendez-vous confirmé est archivé. Si un dossier a été transmis, la clinique en conserve une copie le temps du suivi des soins.
        </p>
        <p>
          Cet archivage ne suit pas votre compte. Détruire le compte retire votre accès dans Pawrise. La copie déjà reçue par la clinique reste archivée chez elle.
        </p>
        <p>
          Les mesures qui n'ont jamais été transmises restent dans Pawrise. Le propriétaire chef les détruit avec le compte, en même temps que la réinitialisation du collier.
        </p>
      </Block>

      <Block title="Ce que vous décidez">
        <p>Chaque rendez-vous a son propre choix de transmission. Vous pouvez confirmer un créneau sans envoyer le dossier.</p>
        <p>
          Le partage de localisation, les notifications santé et les données anonymisées se règlent à part, dans Confidentialité. Ils ne déclenchent pas d'envoi vers un vétérinaire.
        </p>
      </Block>
    </InfoPage>
  )
}

function joinNames(names: string[]) {
  if (names.length <= 1) return names[0] ?? ""
  return `${names.slice(0, -1).join(", ")} et ${names[names.length - 1]}`
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-4 rounded-3xl border border-hairline bg-card p-4">
      <h2 className="text-[15px] font-bold">{title}</h2>
      <div className="mt-2 space-y-2 text-[14px] leading-relaxed text-muted-foreground">{children}</div>
    </section>
  )
}

export function DestroyAccountPage({ onBack, onConfirm }: { onBack: () => void; onConfirm: () => void }) {
  const { dogs, user, care } = useApp()
  const groups = dogs.map((dog) => ({
    dog,
    role: myRole(dog, user),
    owners: resolveOwners(dog, user),
  }))
  const chiefDogs = groups.filter((group) => group.role === "chief")
  const secondDogs = groups.filter((group) => group.role === "secondary")
  const isChief = chiefDogs.length > 0
  const kept = care.appointments.filter((item) => item.status === "confirmed")

  return (
    <InfoPage title="Détruire le compte" onBack={onBack}>
      <p className="text-[15px] leading-relaxed">
        {chiefDogs.length > 0 && secondDogs.length > 0
          ? "Selon les chiens, vous êtes propriétaire chef ou propriétaire second. Pour chaque collier, la destruction suit ce rôle : le chef efface les données et réinitialise le collier, le second retire seulement son accès."
          : isChief
            ? "Vous êtes propriétaire chef. Détruire le compte efface vos accès et les données des colliers dont vous avez la charge. Lisez ce qui est détruit, ce qui est réinitialisé, et ce qui reste archivé."
            : "Vous êtes propriétaire second. Détruire le compte retire votre accès. Les données du collier restent chez le propriétaire chef."}
      </p>

      <Block title="Destruction du compte">
        <p>Votre profil, votre mot de passe et votre session sont détruits. Ce compte ne peut plus être rouvert, et personne ne peut s'y reconnecter.</p>
      </Block>

      {chiefDogs.map(({ dog, owners }) => {
        const seconds = owners.filter((owner) => owner.role === "secondary" && !owner.pending)
        return (
          <Block key={dog.id} title={`Collier de ${dog.name}`}>
            <p>Vous êtes propriétaire chef. Les données de ce collier sont détruites : mesures, localisation, zones de sécurité et historique.</p>
            <p>
              Le collier {dog.collarId} est réinitialisé. Il n'est plus associé à un compte. Il faudra le configurer à nouveau pour recevoir des mesures.
            </p>
            {seconds.length > 0 && (
              <p>
                {joinNames(seconds.map((owner) => owner.name))} {seconds.length > 1 ? "perdent" : "perd"} l'accès à ces données, puisqu'elles sont détruites avec le collier.
              </p>
            )}
          </Block>
        )
      })}

      {secondDogs.map(({ dog, owners }) => {
        const chief = owners.find((owner) => owner.role === "chief")
        return (
          <Block key={dog.id} title={`Collier de ${dog.name}`}>
            <p>
              Vous êtes propriétaire second. {chief?.name ?? "Le propriétaire chef"} conserve les données du collier {dog.collarId}. Le collier n'est pas réinitialisé.
            </p>
            <p>Votre accès est retiré. Vous ne voyez plus la santé, la localisation ni les rendez-vous de {dog.name}.</p>
          </Block>
        )
      })}

      <Block title="Rendez-vous et données vétérinaires">
        <p>
          Les rendez-vous confirmés sont archivés. Un dossier déjà transmis à une clinique — mesures du collier, profil, informations médicales — reste archivé chez le vétérinaire pour le suivi des soins.
        </p>
        <p>Pawrise n'y donne plus accès après la destruction du compte. Cette copie n'est pas effacée avec votre profil.</p>
        <p>
          {isChief
            ? "Les mesures qui n'ont jamais été exportées sont détruites avec les données du collier."
            : "Les mesures qui n'ont jamais été exportées restent chez le propriétaire chef. Elles ne font pas partie de votre compte."}
        </p>
        {kept.length > 0 ? (
          <ul className="space-y-2 pt-1">
            {kept.map((item) => (
              <li key={item.id} className="rounded-2xl bg-background/60 px-3 py-2 text-[13px]">
                <span className="block font-semibold text-foreground">{item.clinic}</span>
                <span className="block">
                  {formatSlotDay(item.date)} · {formatSlotTime(item.date)}
                </span>
                <span className="block">{item.share ? "Dossier transmis — archivé chez la clinique" : "Sans transmission de dossier — rendez-vous archivé"}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun rendez-vous n'est enregistré pour le moment. S'il y en avait, ils suivraient cette règle d'archivage.</p>
        )}
      </Block>

      <button
        onClick={onConfirm}
        className="mt-6 w-full rounded-2xl bg-alert py-4 text-[16px] font-bold text-white active:scale-[0.99]"
      >
        {isChief ? "Détruire le compte et les données du collier" : "Détruire mon compte"}
      </button>
      <p className="mt-3 text-center text-[12px] leading-snug text-muted-foreground">Cette action est définitive. Retour annule et conserve le compte.</p>
    </InfoPage>
  )
}
