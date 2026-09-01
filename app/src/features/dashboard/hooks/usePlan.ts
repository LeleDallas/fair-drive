import type { Dispatch, SetStateAction } from "react";
import type { Injury, Tab, Trip } from "../../../shared/types";
import { isPlayerInjuredOnDate } from "../../../shared/injuries";

export const usePlan = (
  trips: Trip[],
  players: string[],
  injuries: Injury[],
  setTrips: Dispatch<SetStateAction<Trip[]>>,
  setActiveTab: Dispatch<SetStateAction<Tab>>,
) => {
  const generatePlan = (): void => {
    if (trips.length === 0) {
      alert("Prima inserisci almeno una trasferta.");
      return;
    }

    const tripsWithoutKm: Trip[] = trips.filter((trip) => trip.totalKm <= 0);

    if (tripsWithoutKm.length > 0) {
      alert(
        `Ci sono ${tripsWithoutKm.length} trasferte senza chilometri. Inserisci i km prima di generare i turni.`,
      );
      return;
    }

    const sorted: Trip[] = [...trips].sort((a, b) => {
      if (b.totalKm !== a.totalKm) {
        return b.totalKm - a.totalKm;
      }

      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    const km: Record<string, number> = {};
    const turns: Record<string, number> = {};
    const assignments: Record<string, string> = {};

    players.forEach((player) => {
      km[player] = 0;
      turns[player] = 0;
    });

    sorted.forEach((trip) => {
      const availablePlayers: string[] = players.filter(
        (player) => !isPlayerInjuredOnDate(injuries, player, trip.date),
      );

      const pool: string[] = availablePlayers.length > 0 ? availablePlayers : players;

      const candidates: string[] = [...pool].sort((a, b) => {
        if (km[a] !== km[b]) {
          return km[a] - km[b];
        }

        if (turns[a] !== turns[b]) {
          return turns[a] - turns[b];
        }

        return players.indexOf(a) - players.indexOf(b);
      });

      const driver: string = candidates[0];

      assignments[trip.id] = driver;

      km[driver] += trip.totalKm;
      turns[driver] += 1;
    });

    setTrips((current) =>
      current.map((trip) => ({
        ...trip,
        driver: assignments[trip.id] ?? null,
      })),
    );

    setActiveTab("piano");
  };

  const clearAssignments = (): void => {
    const confirmed = window.confirm("Vuoi cancellare tutti i turni assegnati?");

    if (!confirmed) {
      return;
    }

    setTrips((current) =>
      current.map((trip) => ({
        ...trip,
        driver: null,
      })),
    );
  };

  const setTripCompleted = (id: string, completed: boolean): void => {
    setTrips((current) =>
      current.map((trip) =>
        trip.id === id
          ? {
              ...trip,
              completed,
            }
          : trip,
      ),
    );
  };
  return { generatePlan, clearAssignments, setTripCompleted };
};
