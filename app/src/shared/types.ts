export type Tab = "piano" | "trasferte" | "giocatori";

export type TripType = "Allenamento" | "Partita" | "Altro";

export interface Trip {
  id: string;
  date: string;
  type: TripType;
  name: string;
  km: number;
  totalKm: number;
  driver: string | null;
  automatic: boolean;
  completed: boolean;
}

export interface Injury {
  id: string;
  player: string;
  from: string;
  to: string;
}

export interface AppData {
  players: string[];
  trips: Trip[];
  injuries: Injury[];
}
