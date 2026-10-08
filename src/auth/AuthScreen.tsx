import { useState, type ReactNode } from "react"
import type { Account } from "./accounts"
import { validEmail } from "./accounts"
import Icon from "../components/Icon"
import PawriseMark from "../components/PawriseMark"

type Mode = "welcome" | "login" | "signup"

type SignupInput = {
  name: string
  email: string
  phone: string
  password: string
}

export default function AuthScreen({
  accounts,
  onLogin,
  onSignup,
}: {
  accounts: Account[]
  onLogin: (email: string, password: string) => string | null
  onSignup: (input: SignupInput) => string | null
}) {
  const [mode, setMode] = useState<Mode>("welcome")

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-background">
      {mode === "welcome" && (
        <Welcome
          onLogin={() => setMode("login")}
          onSignup={() => setMode("signup")}
        />
      )}
      {mode === "login" && (
        <LoginForm
          onBack={() => setMode("welcome")}
          onSignup={() => setMode("signup")}
          onSubmit={(email, password) => onLogin(email, password)}
        />
      )}
      {mode === "signup" && (
        <SignupForm
          accounts={accounts}
          onBack={() => setMode("welcome")}
          onLogin={() => setMode("login")}
          onSubmit={onSignup}
        />
      )}
    </div>
  )
}

function Welcome({
  onLogin,
  onSignup,
}: {
  onLogin: () => void
  onSignup: () => void
}) {
  return (
    <div
      className="flex flex-1 flex-col px-6"
      style={{
        paddingTop: "calc(var(--pw-safe-top) + 48px)",
        paddingBottom: "calc(var(--pw-safe-bottom) + 24px)",
      }}
    >
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <span className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-elevated text-primary">
          <PawriseMark size={48} />
        </span>
        <h1 className="text-[32px] font-bold tracking-tight">Pawrise</h1>
        <p className="mt-3 max-w-[18rem] text-[15px] leading-snug text-muted-foreground">
          Le collier connecté qui suit la santé et la position de votre chien.
        </p>
      </div>
      <div className="space-y-3">
        <button
          onClick={onLogin}
          className="w-full rounded-2xl bg-primary py-4 text-[16px] font-bold text-primary-foreground active:scale-[0.99]"
        >
          Se connecter
        </button>
        <button
          onClick={onSignup}
          className="w-full rounded-2xl border border-hairline bg-card py-4 text-[16px] font-bold active:scale-[0.99]"
        >
          Créer un compte
        </button>
      </div>
    </div>
  )
}

function LoginForm({
  onBack,
  onSignup,
  onSubmit,
}: {
  onBack: () => void
  onSignup: () => void
  onSubmit: (email: string, password: string) => string | null
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const submit = () => {
    const message = onSubmit(email, password)
    setError(message ?? "")
  }

  return (
    <FormShell
      title="Connexion"
      hint="Retrouvez vos chiens et leur suivi."
      onBack={onBack}
    >
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault()
          submit()
        }}
      >
        <Field
          label="E-mail"
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
        />
        <Field
          label="Mot de passe"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
        />
        {error && (
          <p role="alert" className="px-1 text-sm text-alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="mt-2 w-full rounded-2xl bg-primary py-4 text-[16px] font-bold text-primary-foreground active:scale-[0.99]"
        >
          Se connecter
        </button>
      </form>
      <button
        onClick={onSignup}
        className="mt-4 w-full text-center text-[14px] font-semibold text-primary"
      >
        Créer un compte
      </button>
    </FormShell>
  )
}

function SignupForm({
  accounts,
  onBack,
  onLogin,
  onSubmit,
}: {
  accounts: Account[]
  onBack: () => void
  onLogin: () => void
  onSubmit: (input: SignupInput) => string | null
}) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const submit = () => {
    if (!name.trim()) return setError("Indiquez votre nom.")
    if (!validEmail(email)) return setError("Indiquez un e-mail valide.")
    if (
      accounts.some(
        (account) => account.email.toLowerCase() === email.trim().toLowerCase(),
      )
    ) {
      return setError("Un compte existe déjà avec cet e-mail.")
    }
    if (password.length < 6)
      return setError("Choisissez un mot de passe d'au moins 6 caractères.")
    const message = onSubmit({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
    })
    setError(message ?? "")
  }

  return (
    <FormShell
      title="Créer un compte"
      hint="Quelques informations, puis on vous montre Pawrise."
      onBack={onBack}
    >
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault()
          submit()
        }}
      >
        <Field
          label="Nom"
          autoComplete="name"
          value={name}
          onChange={setName}
        />
        <Field
          label="E-mail"
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
        />
        <Field
          label="Téléphone"
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={setPhone}
        />
        <Field
          label="Mot de passe"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
        />
        {error && (
          <p role="alert" className="px-1 text-sm text-alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="mt-2 w-full rounded-2xl bg-primary py-4 text-[16px] font-bold text-primary-foreground active:scale-[0.99]"
        >
          Continuer
        </button>
      </form>
      <button
        onClick={onLogin}
        className="mt-4 w-full text-center text-[14px] font-semibold text-primary"
      >
        J'ai déjà un compte
      </button>
    </FormShell>
  )
}

function FormShell({
  title,
  hint,
  onBack,
  children,
}: {
  title: string
  hint: string
  onBack: () => void
  children: ReactNode
}) {
  return (
    <div className="flex flex-1 flex-col">
      <header
        className="px-4"
        style={{ paddingTop: "calc(var(--pw-safe-top) + 14px)" }}
      >
        <button
          onClick={onBack}
          aria-label="Retour"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-foreground active:scale-95"
        >
          <Icon
            name="chevron-right"
            size={18}
            strokeWidth={2.4}
            className="rotate-180"
          />
        </button>
      </header>
      <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-8">
        <h1 className="mt-4 text-[26px] font-bold leading-tight">{title}</h1>
        <p className="mt-2 mb-6 text-[13.5px] leading-snug text-muted-foreground">
          {hint}
        </p>
        {children}
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  autoComplete?: string
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block px-1 text-[12px] font-semibold text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-hairline bg-card px-4 py-3.5 text-[16px] outline-none focus:border-primary/60"
      />
    </label>
  )
}
