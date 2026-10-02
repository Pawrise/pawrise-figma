import { initialDogs, type Dog } from "../data/mock"

export type Setup = "learn" | "collar" | "done"

export type Account = {
  id: string
  name: string
  email: string
  phone: string
  password: string
  dogs: Dog[]
  activeDogId: string
  setup: Setup
}

export const seedAccount: Account = {
  id: "camille",
  name: "Camille Laurent",
  email: "camille.laurent@email.com",
  phone: "+33 6 12 34 56 78",
  password: "pawrise",
  dogs: initialDogs,
  activeDogId: initialDogs[0].id,
  setup: "done",
}

export function asSetup(value: string): Setup {
  return value === "learn" || value === "collar" ? value : "done"
}

export function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export function findAccount(accounts: Account[], email: string, password: string) {
  const normalized = email.trim().toLowerCase()
  return accounts.find((account) => account.email.toLowerCase() === normalized && account.password === password) ?? null
}
