import type { Dog, DogOwner, OwnerRole } from "./mock"

const SEED_SECONDARY: DogOwner = {
  name: "Léa Moreau",
  email: "lea.moreau@email.com",
  role: "secondary",
}

function sameEmail(a: string, b: string) {
  return a.trim().toLowerCase() === b.trim().toLowerCase()
}

export function resolveOwners(dog: Dog, user: { name: string; email: string }): DogOwner[] {
  const meEmail = user.email.trim().toLowerCase()
  let list: DogOwner[]

  if (dog.owners?.length) {
    list = dog.owners.map((owner) =>
      sameEmail(owner.email, user.email)
        ? { ...owner, name: user.name, email: user.email, pending: false }
        : owner,
    )
  } else {
    const invited = (dog.coOwners ?? [])
      .filter((email) => !sameEmail(email, user.email) && !sameEmail(email, SEED_SECONDARY.email))
      .map((email) => ({ name: email, email, role: "secondary" as const, pending: true }))
    list = [...(dog.id === "nala" ? [SEED_SECONDARY] : []), ...invited]
  }

  if (!list.some((owner) => sameEmail(owner.email, user.email))) {
    const chiefTaken = list.some((owner) => owner.role === "chief" && !owner.pending)
    list = [{ name: user.name, email: user.email, role: chiefTaken ? "secondary" : "chief" }, ...list]
  }

  let seenChief = false
  list = list.map((owner) => {
    if (owner.pending) return { ...owner, role: "secondary" }
    if (owner.role !== "chief") return owner
    if (seenChief) return { ...owner, role: "secondary" }
    seenChief = true
    return owner
  })

  if (!seenChief) {
    list = list.map((owner) =>
      sameEmail(owner.email, meEmail) ? { ...owner, role: "chief", pending: false } : owner,
    )
  }

  const rank = (owner: DogOwner) => (owner.pending ? 2 : owner.role === "chief" ? 0 : 1)
  return [...list].sort((a, b) => rank(a) - rank(b))
}

export function myRole(dog: Dog, user: { name: string; email: string }): OwnerRole {
  return resolveOwners(dog, user).find((owner) => sameEmail(owner.email, user.email))?.role ?? "chief"
}

export function withChief(owners: DogOwner[], email: string): DogOwner[] {
  return owners.map((owner) => {
    if (sameEmail(owner.email, email)) return { ...owner, role: "chief", pending: false }
    if (owner.role === "chief") return { ...owner, role: "secondary" }
    return owner
  })
}
