import { useCallback, useEffect, useMemo, useState } from "react"
import { AppContext, type Panel, type Tab, type UserProfile } from "./app-context"
import { useChat } from "./chat/useChat"
import { initialDogs, type Dog } from "./data/mock"
import TabBar from "./components/TabBar"
import HealthScreen from "./screens/HealthScreen"
import GpsScreen from "./screens/GpsScreen"
import ChatScreen from "./screens/ChatScreen"
import SettingsScreen from "./screens/SettingsScreen"
import VetScreen from "./screens/VetScreen"
import { readStored, useStoredState } from "./state/storage"
import { useCare } from "./state/care"
import CarePanels from "./components/care/CarePanels"
import AddDogFlow from "./dogs/AddDogFlow"
import AuthScreen from "./auth/AuthScreen"
import LearnFlow from "./auth/LearnFlow"
import { asSetup, findAccount, seedAccount, type Account, type Setup } from "./auth/accounts"

export default function App() {
  const [tab, setTab] = useState<Tab>("health")
  const [storageError, setStorageError] = useState(false)
  useEffect(() => { const show = () => setStorageError(true); window.addEventListener("pawrise-storage-error", show); return () => window.removeEventListener("pawrise-storage-error", show) }, [])
  const care = useCare()
  const [panel, openPanel] = useState<Panel>(null)
  const [anomalies, setAnomalies] = useStoredState<Record<string, boolean>>("anomalies", {})

  const [dogs, setDogs] = useStoredState<Dog[]>("dogs", initialDogs)
  const [currentDogId, setCurrentDogId] = useStoredState("active-dog", initialDogs[0].id)
  const [addingDog, setAddingDog] = useState(false)
  const [accounts, setAccounts] = useStoredState<Account[]>("accounts", [seedAccount])
  const [sessionId, setSessionId] = useStoredState("session", seedAccount.id)
  const [setup, setSetup] = useStoredState<Setup>("setup", "done")

  const currentDog = dogs.find((d) => d.id === currentDogId) ?? dogs[0] ?? pendingDog
  const loggedIn = sessionId !== ""
  const showLearn = loggedIn && setup === "learn"
  const showDogFlow = loggedIn && setup !== "learn" && (setup === "collar" || addingDog || dogs.length === 0)
  const showApp = loggedIn && setup === "done" && dogs.length > 0
  const anomaly = anomalies[currentDog.id] ?? false
  const setAnomaly = (value: boolean) => {
    setAnomalies(items => ({ ...items, [currentDog.id]: value }))
    if (value && readStored("healthNotif", true)) care.notify(currentDog.id, `Indicateurs inhabituels chez ${currentDog.name}`, "health")
  }
  const chat = useChat(currentDog, anomaly)

  const addDog = useCallback((dog: Dog) => {
    setDogs((ds) => [...ds, dog])
    setCurrentDogId(dog.id)
  }, [])

  const updateDog = useCallback((id: string, patch: Partial<Dog>) => {
    setDogs((ds) => ds.map((d) => (d.id === id ? { ...d, ...patch } : d)))
  }, [])

  const [userState, setUserState] = useStoredState<UserProfile>("user", {
    name: "Camille Laurent",
    email: "camille.laurent@email.com",
    phone: "+33 6 12 34 56 78",
  })
  const setUser = useCallback((patch: Partial<UserProfile>) => {
    setUserState((u) => ({ ...u, ...patch }))
  }, [])

  useEffect(() => {
    if (!sessionId) return
    const activeSetup = asSetup(setup)
    setAccounts((list) => {
      const current = list.find((account) => account.id === sessionId)
      if (!current) return list
      const sameProfile = current.name === userState.name && current.email === userState.email && current.phone === userState.phone
      const sameDogs = JSON.stringify(current.dogs) === JSON.stringify(dogs) && current.activeDogId === currentDogId && current.setup === activeSetup
      if (sameProfile && sameDogs) return list
      return list.map((account) => account.id === sessionId ? { ...account, name: userState.name, email: userState.email, phone: userState.phone, dogs, activeDogId: currentDogId, setup: activeSetup } : account)
    })
  }, [sessionId, userState, dogs, currentDogId, setup])

  const logout = useCallback(() => {
    const activeSetup = asSetup(setup)
    setAccounts((list) => list.map((account) => account.id === sessionId ? { ...account, name: userState.name, email: userState.email, phone: userState.phone, dogs, activeDogId: currentDogId, setup: activeSetup } : account))
    setSessionId("")
    setAddingDog(false)
    setTab("health")
  }, [sessionId, userState, dogs, currentDogId, setup])

  const destroyAccount = useCallback(() => {
    const id = sessionId
    setSessionId("")
    setAccounts((list) => list.filter((account) => account.id !== id))
    setAddingDog(false)
    setTab("health")
  }, [sessionId])

  const login = useCallback((email: string, password: string) => {
    const account = findAccount(accounts, email, password)
    if (!account) return "E-mail ou mot de passe incorrect."
    setUserState({ name: account.name, email: account.email, phone: account.phone })
    setDogs(account.dogs)
    setCurrentDogId(account.activeDogId || account.dogs[0]?.id || "")
    setSetup(account.setup)
    setSessionId(account.id)
    setAddingDog(false)
    setTab("health")
    return null
  }, [accounts])

  const signup = useCallback((input: { name: string; email: string; phone: string; password: string }) => {
    const account: Account = {
      id: `user_${Date.now()}`,
      name: input.name,
      email: input.email,
      phone: input.phone,
      password: input.password,
      dogs: [],
      activeDogId: "",
      setup: "learn",
    }
    setAccounts((list) => [...list, account])
    setUserState({ name: input.name, email: input.email, phone: input.phone })
    setDogs([])
    setCurrentDogId("")
    setSetup("learn")
    setSessionId(account.id)
    setAddingDog(false)
    setTab("health")
    return null
  }, [])

  const askPawriseAboutAlert = useCallback(() => {
    chat.seedAlert()
    setTab("chat")
  }, [chat])

  const value = useMemo(
    () => ({
      care,
      panel,
      openPanel,
      tab,
      setTab,
      anomaly,
      setAnomaly,
      chat,
      askPawriseAboutAlert,
      dogs,
      currentDog,
      setCurrentDogId,
      addDog,
      updateDog,
      addingDog,
      setAddingDog,
      user: userState,
      setUser,
      logout,
      destroyAccount,
    }),
    [
      care,
      panel,
      tab,
      anomaly,
      chat,
      askPawriseAboutAlert,
      dogs,
      currentDog,
      addDog,
      updateDog,
      addingDog,
      userState,
      setUser,
      logout,
      destroyAccount,
    ],
  )

  return (
    <AppContext.Provider value={value}>
      {/* Phone-shaped app shell, centered on larger canvases but full-bleed on phones. */}
      <div className="flex h-full w-full justify-center bg-background">
        <div id="pawrise-shell" className="relative flex h-full w-full max-w-[440px] flex-col overflow-hidden bg-background">
          {storageError && <p role="alert" className="bg-watch-soft p-2 text-xs">La sauvegarde locale est indisponible ou pleine. Vos modifications restent dans cette session.</p>}
          <main className="relative min-h-0 flex-1">
            {showApp && tab === "health" && <HealthScreen key={currentDog.id} />}
            {showApp && tab === "map" && <GpsScreen key={currentDog.id} />}
            {showApp && tab === "chat" && <ChatScreen />}
            {showApp && tab === "vet" && <VetScreen />}
            {showApp && tab === "profile" && <SettingsScreen />}
          </main>
          {showApp && <TabBar />}
          {showApp && <CarePanels panel={panel} onClose={() => openPanel(null)} />}
          {!loggedIn && <AuthScreen accounts={accounts} onLogin={login} onSignup={signup} />}
          {showLearn && <LearnFlow onDone={() => setSetup("collar")} />}
          {showDogFlow && (
            <AddDogFlow
              onLeave={dogs.length === 0 ? () => { setSetup("learn"); setAddingDog(false) } : undefined}
              onComplete={setup === "collar" ? () => setSetup("done") : undefined}
            />
          )}
        </div>
      </div>
    </AppContext.Provider>
  )
}

const pendingDog: Dog = {
  id: "pending",
  name: "votre chien",
  breed: "",
  age: "",
  photo: "",
  collarId: "",
  connected: false,
  battery: 0,
}
