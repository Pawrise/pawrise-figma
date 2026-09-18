// Health dashboard data — 5 MVP indicators, each with a normal and an "alerte"
// variant, plus time series per period. Nala stays consistent with the seed dogs.

export type HealthState = "good" | "watch" | "alert";

export type Period = "today" | "7d" | "30d";

export const periodLabels: Record<Period, string> = {
  today: "Aujourd'hui",
  "7d": "7 jours",
  "30d": "30 jours",
};

export type Point = { label: string; value: number };

export type IndicatorVariant = {
  state: HealthState;
  status: string; // "Tout va bien" | "À surveiller" | "Alerte"
  message: string; // plain-language, no medical knowledge needed
  detail: string; // slightly more info for the advanced view
  headline: string; // the current headline value, e.g. "72 bpm"
  series: Record<Period, Point[]>;
  normalBand?: [number, number]; // typical range for reference on the chart
};

export type Indicator = {
  id: string;
  label: string;
  icon: string;
  unit: string;
  chart: "line" | "afib" | "activity" | "sleep" | "temperature";
  hasPeriods: boolean;
  normalBand?: [number, number]; // typical range for reference on the chart
  normal: IndicatorVariant;
  alerte: IndicatorVariant;
};

// ---- helpers to synthesize believable series -------------------------------

const hours = (from: number, count: number, step = 1) =>
  Array.from({ length: count }, (_, i) => `${(from + i * step) % 24}h`);

const days7 = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const days30 = Array.from({ length: 30 }, (_, i) => `${i + 1}`);

function wave(base: number, amp: number, n: number, seed = 1, drift = 0) {
  return Array.from({ length: n }, (_, i) => {
    const v =
      base +
      Math.sin((i + seed) * 0.7) * amp +
      Math.cos((i + seed) * 0.31) * amp * 0.5 +
      drift * i;
    return Math.round(v);
  });
}

const toPoints = (labels: string[], values: number[]): Point[] =>
  labels.map((label, i) => ({ label, value: values[i] ?? values[values.length - 1] }));

// ---- indicators ------------------------------------------------------------

export const indicators: Indicator[] = [
  {
    id: "heart",
    label: "Rythme cardiaque",
    icon: "heart",
    unit: "bpm",
    chart: "line",
    hasPeriods: true,
    normalBand: [60, 100],
    normal: {
      state: "good",
      status: "Tout va bien",
      message: "Le rythme cardiaque de Nala est dans ses valeurs habituelles.",
      detail:
        "Moyenne de 78 bpm sur la journée, avec des variations normales pendant le repos et l'activité.",
      headline: "78 bpm",
      series: {
        today: toPoints(hours(6, 18), wave(78, 9, 18, 2)),
        "7d": toPoints(days7, wave(78, 5, 7, 3)),
        "30d": toPoints(days30, wave(78, 6, 30, 1)),
      },
    },
    alerte: {
      state: "watch",
      status: "À surveiller",
      message: "Le rythme cardiaque de Nala est inhabituellement élevé depuis 45 minutes.",
      detail:
        "Pic soutenu autour de 128 bpm alors que Nala est au repos — au-dessus de sa plage habituelle (60–100 bpm).",
      headline: "128 bpm",
      series: {
        today: toPoints(hours(6, 18), [
          76, 78, 74, 80, 79, 77, 82, 81, 79, 84, 88, 96, 108, 118, 124, 128, 127, 126,
        ]),
        "7d": toPoints(days7, [77, 79, 78, 80, 82, 90, 112]),
        "30d": toPoints(days30, wave(80, 6, 30, 1, 0.9)),
      },
    },
  },
  {
    id: "afib",
    label: "Fibrillation atriale",
    icon: "pulse",
    unit: "",
    chart: "afib",
    hasPeriods: false,
    normal: {
      state: "good",
      status: "Tout va bien",
      message: "Aucun signe de rythme irrégulier détecté chez Nala.",
      detail:
        "Le collier analyse le rythme en continu. Les intervalles entre battements sont réguliers.",
      headline: "Rythme régulier",
      // value: 0 = normal beat, 1 = irregular beat marker
      series: {
        today: toPoints(
          Array.from({ length: 24 }, (_, i) => `${i}`),
          Array.from({ length: 24 }, () => 0),
        ),
        "7d": toPoints(days7, [0, 0, 0, 0, 0, 0, 0]),
        "30d": toPoints(days30, days30.map(() => 0)),
      },
    },
    alerte: {
      state: "alert",
      status: "Alerte",
      message: "Des battements irréguliers ont été détectés chez Nala.",
      detail:
        "Plusieurs intervalles irréguliers repérés sur la dernière heure. À faire vérifier par un vétérinaire.",
      headline: "Rythme irrégulier",
      series: {
        today: toPoints(
          Array.from({ length: 24 }, (_, i) => `${i}`),
          [0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
        ),
        "7d": toPoints(days7, [0, 0, 0, 0, 1, 0, 1]),
        "30d": toPoints(days30, days30.map((_, i) => (i > 24 ? 1 : 0))),
      },
    },
  },
  {
    id: "activity",
    label: "Activité",
    icon: "activity",
    unit: "min",
    chart: "activity",
    hasPeriods: true,
    normal: {
      state: "good",
      status: "Tout va bien",
      message: "Nala a bougé autant que d'habitude aujourd'hui.",
      detail: "94 minutes actives, réparties sur ses trois promenades.",
      headline: "94 min actives",
      series: {
        today: toPoints(hours(6, 12, 1.5), [4, 22, 12, 8, 6, 18, 10, 6, 4, 14, 20, 8]),
        "7d": toPoints(days7, [88, 102, 76, 94, 110, 130, 96]),
        "30d": toPoints(days30, wave(95, 20, 30, 5)),
      },
    },
    alerte: {
      state: "watch",
      status: "À surveiller",
      message: "Nala bouge nettement moins que d'habitude aujourd'hui.",
      detail: "Seulement 31 minutes actives, contre 95 min en moyenne. À surveiller.",
      headline: "31 min actives",
      series: {
        today: toPoints(hours(6, 12, 1.5), [2, 6, 4, 3, 2, 5, 3, 1, 1, 2, 1, 1]),
        "7d": toPoints(days7, [92, 98, 88, 96, 90, 70, 31]),
        "30d": toPoints(days30, wave(90, 18, 30, 5, -1.2)),
      },
    },
  },
  {
    id: "sleep",
    label: "Sommeil",
    icon: "moon",
    unit: "h",
    chart: "sleep",
    hasPeriods: true,
    normal: {
      state: "good",
      status: "Tout va bien",
      message: "Nala a bien dormi cette nuit.",
      detail: "11 h de sommeil, dont 6 h de sommeil profond. Peu de réveils.",
      headline: "11 h de sommeil",
      series: {
        today: toPoints(["Profond", "Léger", "Éveillé"], [6, 5, 1]),
        "7d": toPoints(days7, [11, 10, 12, 11, 10, 11, 11]),
        "30d": toPoints(days30, wave(11, 1, 30, 2)),
      },
    },
    alerte: {
      state: "watch",
      status: "À surveiller",
      message: "Le sommeil de Nala a été agité cette nuit.",
      detail: "Seulement 7 h de sommeil avec de nombreux réveils. Sommeil profond réduit.",
      headline: "7 h · agité",
      series: {
        today: toPoints(["Profond", "Léger", "Éveillé"], [3, 3, 4]),
        "7d": toPoints(days7, [11, 10, 11, 10, 9, 8, 7]),
        "30d": toPoints(days30, wave(10, 2, 30, 2, -0.05)),
      },
    },
  },
  {
    id: "temperature",
    label: "Température",
    icon: "thermometer",
    unit: "°C",
    chart: "temperature",
    hasPeriods: true,
    normalBand: [38, 39.2],
    normal: {
      state: "good",
      status: "Tout va bien",
      message: "La température de Nala est normale.",
      detail: "Stable autour de 38,5 °C sur la journée.",
      headline: "38,5 °C",
      series: {
        today: toPoints(hours(6, 12, 1.5), [385, 384, 386, 385, 387, 386, 385, 384, 386, 385, 387, 386].map((v) => v / 10)),
        "7d": toPoints(days7, [385, 386, 384, 385, 387, 386, 385].map((v) => v / 10)),
        "30d": toPoints(days30, wave(385, 3, 30, 1).map((v) => v / 10)),
      },
    },
    alerte: {
      state: "alert",
      status: "Alerte",
      message: "La température de Nala est plus élevée que la normale.",
      detail: "39,8 °C, au-dessus de sa plage habituelle (38–39,2 °C). À surveiller de près.",
      headline: "39,8 °C",
      series: {
        today: toPoints(
          hours(6, 12, 1.5),
          [385, 386, 387, 388, 389, 391, 393, 395, 396, 397, 398, 398].map((v) => v / 10),
        ),
        "7d": toPoints(days7, [385, 386, 385, 387, 388, 391, 398].map((v) => v / 10)),
        "30d": toPoints(days30, wave(386, 3, 30, 1, 0.3).map((v) => v / 10)),
      },
    },
  },
];

export const scoreNormal = 87;
export const scoreAnomaly = 64;

export function stateMeta(state: HealthState) {
  switch (state) {
    case "good":
      return { label: "Tout va bien", color: "var(--color-good)", soft: "var(--color-good-soft)" };
    case "watch":
      return { label: "À surveiller", color: "var(--color-watch)", soft: "var(--color-watch-soft)" };
    case "alert":
      return { label: "Alerte", color: "var(--color-alert)", soft: "var(--color-alert-soft)" };
  }
}

export function scoreState(score: number): HealthState {
  if (score >= 80) return "good";
  if (score >= 55) return "watch";
  return "alert";
}
