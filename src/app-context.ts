import { createContext, useContext } from "react";
import type { ChatController } from "./chat/useChat";
import type { CareState } from "./state/care";
import type { Dog } from "./data/mock";

export type Tab = "health" | "map" | "chat" | "vet" | "profile";
export type Panel = "alerts" | "reminders" | null;

export type AppState = {
  care: CareState;
  panel: Panel;
  openPanel: (panel: Panel) => void;
  tab: Tab;
  setTab: (t: Tab) => void;
  anomaly: boolean;
  setAnomaly: (v: boolean) => void;
  chat: ChatController;
  // Seed the contextual alert conversation and jump to the Chat tab.
  askPawriseAboutAlert: () => void;

  // Multi-dog support.
  dogs: Dog[];
  currentDog: Dog;
  setCurrentDogId: (id: string) => void;
  addDog: (dog: Dog) => void;
  updateDog: (id: string, patch: Partial<Dog>) => void;
  addingDog: boolean;
  setAddingDog: (v: boolean) => void;

  // App owner profile.
  user: UserProfile;
  setUser: (patch: Partial<UserProfile>) => void;
};

export type UserProfile = {
  name: string;
  email: string;
  phone: string;
};

export const AppContext = createContext<AppState | null>(null);

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppContext");
  return ctx;
}
