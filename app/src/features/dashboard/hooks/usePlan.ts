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

    const pendingTrips = trips.filter((trip) => !trip.completed);

    if (pendingTrips.length === 0) {
      alert("Tutte le trasferte sono già state completate.");
      return;
    }

    const tripsWithoutKm = pendingTrips.filter((trip) => trip.totalKm <= 0);
    if (tripsWithoutKm.length > 0) {
      alert(
        `Ci sono ${tripsWithoutKm.length} trasferte da completare senza chilometri. Inserisci i km prima di generare i turni.`,
      );
      return;
    }

    const km: Record<string, number> = {};
    const turns: Record<string, number> = {};
    const assignments: Record<string, string> = {};

    players.forEach((player) => {
      km[player] = 0;
      turns[player] = 0;
    });

    trips.forEach((trip) => {
      if (trip.completed && trip.driver) {
        km[trip.driver] = (km[trip.driver] || 0) + trip.totalKm;
        turns[trip.driver] = (turns[trip.driver] || 0) + 1;
      }
    });

    const sortedPending: Trip[] = [...pendingTrips].sort((a, b) => {
      if (b.totalKm !== a.totalKm) {
        return b.totalKm - a.totalKm;
      }
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    sortedPending.forEach((trip) => {
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
        driver: trip.completed ? trip.driver : (assignments[trip.id] ?? null),
      })),
    );

    setActiveTab("piano");
  };

  const clearAssignments = (): void => {
    const confirmed = window.confirm("Vuoi cancellare i turni non ancora completati?");

    if (!confirmed) {
      return;
    }

    setTrips((current) =>
      current.map((trip) => ({
        ...trip,
        driver: trip.completed ? trip.driver : null,
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
