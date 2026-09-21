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

  const currentDog = dogs.find((d) => d.id === currentDogId) ?? dogs[0] ?? initialDogs[0]
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
    ],
  )

  return (
    <AppContext.Provider value={value}>
      {/* Phone-shaped app shell, centered on larger canvases but full-bleed on phones. */}
      <div className="flex h-full w-full justify-center bg-background">
        <div className="relative flex h-full w-full max-w-[440px] flex-col overflow-hidden bg-background">
          {storageError && <p role="alert" className="bg-watch-soft p-2 text-xs">La sauvegarde locale est indisponible ou pleine. Vos modifications restent dans cette session.</p>}
          <main className="relative min-h-0 flex-1">
            {tab === "health" && <HealthScreen key={currentDog.id} />}
            {tab === "map" && <GpsScreen key={currentDog.id} />}
            {tab === "chat" && <ChatScreen />}
            {tab === "vet" && <VetScreen />}
            {tab === "profile" && <SettingsScreen />}
          </main>
          <TabBar />
          <CarePanels panel={panel} onClose={() => openPanel(null)} />
          {addingDog && <AddDogFlow />}
        </div>
      </div>
    </AppContext.Provider>
  )
}
