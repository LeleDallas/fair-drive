import type { AppData, Injury, Trip, TripType } from "./types";

export const STORAGE_KEY = "calcio-turni-v2";

export const defaultPlayers: string[] = ["Dallas", "Lion", "Giorna", "Mateo", "Simo", "Sinto"];

export const createId = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const isTripType = (value: unknown): value is TripType => {
  return value === "Allenamento" || value === "Partita" || value === "Altro";
};

const normalizeTrip = (value: unknown): Trip | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const trip = value as Record<string, unknown>;

  if (
    typeof trip.id !== "string" ||
    typeof trip.date !== "string" ||
    typeof trip.name !== "string" ||
    typeof trip.km !== "number" ||
    typeof trip.totalKm !== "number"
  ) {
    return null;
  }

  if (!isTripType(trip.type)) {
    return null;
  }

  const driver = typeof trip.driver === "string" ? trip.driver : null;

  const automatic =
    typeof trip.automatic === "boolean" ? trip.automatic : trip.type === "Allenamento";

  const completed = typeof trip.completed === "boolean" ? trip.completed : false;
  return {
    id: trip.id,
    date: trip.date,
    type: trip.type,
    name: trip.name,
    km: trip.km,
    totalKm: trip.totalKm,
    driver,
    automatic,
    completed,
  };
};

const normalizeInjury = (value: unknown): Injury | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const injury = value as Record<string, unknown>;

  if (
    typeof injury.id !== "string" ||
    typeof injury.player !== "string" ||
    typeof injury.from !== "string" ||
    typeof injury.to !== "string"
  ) {
    return null;
  }

  return {
    id: injury.id,
    player: injury.player,
    from: injury.from,
    to: injury.to,
  };
};

export const loadData = async (): Promise<AppData> => {
  const DATA_URL =
    "https://raw.githubusercontent.com/LeleDallas/fair-drive/refs/heads/main/cdn/data.json";

  const fallbackData: AppData = {
    players: defaultPlayers,
    trips: [],
    injuries: [],
  };

  try {
    const response = await fetch(DATA_URL, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Errore CDN: ${response.status}`);
    }

    const parsed: unknown = await response.json();

    if (!parsed || typeof parsed !== "object") {
      throw new Error("Formato JSON non valido");
    }

    const data = parsed as Record<string, unknown>;

    const players: string[] =
      Array.isArray(data.players) &&
      data.players.every((player): player is string => typeof player === "string")
        ? data.players
        : defaultPlayers;

    const trips: Trip[] = Array.isArray(data.trips)
      ? data.trips.map(normalizeTrip).filter((trip): trip is Trip => trip !== null)
      : [];

    const injuries: Injury[] = Array.isArray(data.injuries)
      ? data.injuries.map(normalizeInjury).filter((injury): injury is Injury => injury !== null)
      : [];

    const appData: AppData = {
      players: players.length === 7 ? players : defaultPlayers,
      trips,
      injuries,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));

    return appData;
  } catch (error) {
    console.error("Errore nel caricamento dalla CDN:", error);

    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        return fallbackData;
      }

      const parsed: unknown = JSON.parse(saved);

      if (!parsed || typeof parsed !== "object") {
        return fallbackData;
      }

      const data = parsed as Record<string, unknown>;

      const players: string[] =
        Array.isArray(data.players) &&
        data.players.every((player): player is string => typeof player === "string")
          ? data.players
          : defaultPlayers;

      const trips: Trip[] = Array.isArray(data.trips)
        ? data.trips.map(normalizeTrip).filter((trip): trip is Trip => trip !== null)
        : [];

      const injuries: Injury[] = Array.isArray(data.injuries)
        ? data.injuries.map(normalizeInjury).filter((injury): injury is Injury => injury !== null)
        : [];

      return {
        players: players.length === 7 ? players : defaultPlayers,
        trips,
        injuries,
      };
    } catch (localError) {
      console.error("Errore nel caricamento locale:", localError);

      return fallbackData;
    }
  }
};

export const saveData = (data: AppData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
