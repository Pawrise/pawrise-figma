// Shared Pawrise seed data — one source of truth for dogs across all features.

export type Dog = {
  id: string;
  name: string;
  breed: string;
  age: string;
  dob?: string; // ISO date
  sex?: "male" | "female";
  weight?: number; // kg
  height?: number; // cm
  medical?: string;
  coOwners?: string[]; // emails of invited co-owners (pending/accepted)
  photo: string;
  collarId: string;
  connected: boolean;
  battery: number;
};

export const initialDogs: Dog[] = [
  {
    id: "nala",
    name: "Nala",
    breed: "Golden Retriever",
    age: "3 ans",
    dob: "2023-04-12",
    sex: "female",
    weight: 28,
    height: 55,
    photo:
      "https://images.unsplash.com/photo-1693615775129-f2004d6e3e0b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=320&h=320&q=80",
    collarId: "PW-C2 · 8A4F",
    connected: true,
    battery: 72,
  },
];

// A few sample photos offered by the onboarding photo picker.
export const samplePhotos = [
  "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=320&h=320&q=80",
  "https://images.unsplash.com/photo-1602241628512-459cdd3234fe?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=320&h=320&q=80",
  "https://images.unsplash.com/photo-1568572933382-74d440642117?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=320&h=320&q=80",
  "https://images.unsplash.com/photo-1587300003388-59208cc962cb?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=320&h=320&q=80",
];

// Legacy default dog (Nala) — used by the GPS & Chat features.
export const dog = initialDogs[0];

export const collar = {
  connected: true,
  battery: 72,
  signal: "strong" as "strong" | "weak",
};

// Map coordinates are in an abstract 0..1000 map-space (see MapCanvas).
export const dogPosition = { x: 512, y: 470 };

export type SafeZone = {
  id: string;
  label: string;
  emoji: string;
  x: number;
  y: number;
  radius: number;
  alertsOn: boolean;
};

export const initialSafeZones: SafeZone[] = [
  { id: "home", label: "Maison", emoji: "🏡", x: 512, y: 470, radius: 150, alertsOn: true },
  { id: "park", label: "Parc à chiens", emoji: "🌳", x: 300, y: 250, radius: 120, alertsOn: true },
];

// A short breadcrumb trail of recent positions, in map-space.
export const trail = [
  { x: 300, y: 250 },
  { x: 360, y: 300 },
  { x: 420, y: 360 },
  { x: 470, y: 420 },
  { x: 512, y: 470 },
];

// Breed list — ordered for the prototype: unknown, mixed, then alphabetical.
// Designed to scale to a much larger database.
export const breeds = [
  "Je ne sais pas",
  "Croisé",
  "Akita Inu",
  "Beagle",
  "Berger Allemand",
  "Berger Australien",
  "Border Collie",
  "Bouledogue Français",
  "Caniche",
  "Chihuahua",
  "Golden Retriever",
  "Husky Sibérien",
];
