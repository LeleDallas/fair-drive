import { useState, type Dispatch, type FormEvent, type SetStateAction } from "react";
import type { Injury, Trip } from "../../../shared/types";
import { createId } from "../../../shared/storage";
import { isPlayerInjuredOnDate, isPlayerCurrentlyInjured } from "../../../shared/injuries";
import { emptyInjuryForm, type InjuryForm } from "../types";

export const usePlayers = (
  players: string[],
  setPlayers: Dispatch<SetStateAction<string[]>>,
  setTrips: Dispatch<SetStateAction<Trip[]>>,
  injuries: Injury[],
  setInjuries: Dispatch<SetStateAction<Injury[]>>,
) => {
  const [injuryForm, setInjuryForm] = useState<InjuryForm>(emptyInjuryForm);

  const sortedInjuries = [...injuries].sort(
    (a, b) => new Date(a.from).getTime() - new Date(b.from).getTime(),
  );

  const updatePlayer = (index: number, value: string): void => {
    const oldName: string = players[index];

    const trimmed = value.trim();

    if (!trimmed) {
      return;
    }

    const duplicate = players.some(
      (player, playerIndex) =>
        playerIndex !== index && player.toLowerCase() === trimmed.toLowerCase(),
    );

    if (duplicate) {
      alert("Non puoi avere due giocatori con lo stesso nome.");
      return;
    }

    setPlayers((current) => {
      const next = [...current];
      next[index] = trimmed;
      return next;
    });

    setTrips((current) =>
      current.map((trip) =>
        trip.driver === oldName
          ? {
              ...trip,
              driver: trimmed,
            }
          : trip,
      ),
    );

    setInjuries((current) =>
      current.map((injury) =>
        injury.player === oldName
          ? {
              ...injury,
              player: trimmed,
            }
          : injury,
      ),
    );
  };

  const resetInjuryForm = (): void => {
    setInjuryForm({
      ...emptyInjuryForm,
    });
  };

  const handleInjurySubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!injuryForm.player || !injuryForm.from || !injuryForm.to) {
      alert("Seleziona giocatore e periodo dell'infortunio.");
      return;
    }

    if (injuryForm.to < injuryForm.from) {
      alert("La data di fine non può precedere la data di inizio.");
      return;
    }

    const injury: Injury = {
      id: createId(),
      player: injuryForm.player,
      from: injuryForm.from,
      to: injuryForm.to,
    };

    setInjuries((current) => [...current, injury]);

    resetInjuryForm();
  };

  const deleteInjury = (id: string): void => {
    setInjuries((current) => current.filter((injury) => injury.id !== id));
  };

  return {
    sortedInjuries,
    injuryForm,
    setInjuryForm,
    updatePlayer,
    handleInjurySubmit,
    deleteInjury,
    isPlayerCurrentlyInjured: (player: string) => isPlayerCurrentlyInjured(injuries, player),
    isPlayerInjuredOnDate: (player: string, date: string) =>
      isPlayerInjuredOnDate(injuries, player, date),
  };
};
