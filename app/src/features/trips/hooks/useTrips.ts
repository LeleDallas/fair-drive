import { useState, type Dispatch, type FormEvent, type SetStateAction } from "react";
import type { Tab, Trip } from "../../../shared/types";
import { createId } from "../../../shared/storage";
import { formatInputDate, getDayOfWeek } from "../../../shared/dates";
import { emptyGeneratorForm, emptyTripForm, type GeneratorForm, type TripForm } from "../types";

export const useTrips = (
  trips: Trip[],
  setTrips: Dispatch<SetStateAction<Trip[]>>,
  setActiveTab: Dispatch<SetStateAction<Tab>>,
) => {
  const [tripForm, setTripForm] = useState<TripForm>(emptyTripForm);

  const [editingTripId, setEditingTripId] = useState<string | null>(null);

  const [generatorForm, setGeneratorForm] = useState<GeneratorForm>(emptyGeneratorForm);

  const resetTripForm = (): void => {
    setTripForm({
      ...emptyTripForm,
    });

    setEditingTripId(null);
  };

  const handleTripSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!tripForm.date || !tripForm.km) {
      alert("Inserisci almeno data e chilometri.");
      return;
    }

    const oneWayKm: number = Number(tripForm.km);

    if (!Number.isFinite(oneWayKm) || oneWayKm <= 0) {
      alert("I chilometri devono essere maggiori di zero.");
      return;
    }

    const existingTrip: Trip | undefined = editingTripId
      ? trips.find((trip) => trip.id === editingTripId)
      : undefined;

      const selectedDriverId: string | null = tripForm.driverId || null;

    const trip: Trip = {
      id: editingTripId ?? createId(),
      date: tripForm.date,
      type: tripForm.type,
      name:
        tripForm.name.trim() ||
        (tripForm.type === "Partita"
          ? "Partita"
          : tripForm.type === "Allenamento"
            ? "Allenamento"
            : "Trasferta"),
      km: oneWayKm,
      totalKm: oneWayKm * 2,
      driver: selectedDriverId ?? existingTrip?.driver ?? null,
      automatic: existingTrip?.automatic ?? tripForm.type === "Allenamento",
      completed: existingTrip?.completed ?? false,
    };

    if (editingTripId) {
      setTrips((current) => current.map((item) => (item.id === editingTripId ? trip : item)));
    } else {
      setTrips((current) => [...current, trip]);
    }

    resetTripForm();
  };

  const editTrip = (trip: Trip): void => {
    setEditingTripId(trip.id);

    setTripForm({
      date: trip.date,
      type: trip.type,
      name: trip.name,
      km: String(trip.km),
      driverId: trip.driver ?? "",
    });

    setActiveTab("trasferte");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteTrip = (id: string): void => {
    const confirmed = window.confirm("Vuoi eliminare questa trasferta?");

    if (!confirmed) {
      return;
    }

    setTrips((current) => current.filter((trip) => trip.id !== id));

    if (editingTripId === id) {
      resetTripForm();
    }
  };

  const generateAutomaticTrainings = (): void => {
    if (!generatorForm.from || !generatorForm.to) {
      alert("Inserisci la data di inizio e quella di fine.");
      return;
    }

    if (generatorForm.from > generatorForm.to) {
      alert("La data di inizio deve essere precedente alla data di fine.");
      return;
    }

    const selectedDays: number[] = [];

    if (generatorForm.tuesday) {
      selectedDays.push(2);
    }

    if (generatorForm.wednesday) {
      selectedDays.push(3);
    }

    if (generatorForm.friday) {
      selectedDays.push(5);
    }

    if (selectedDays.length === 0) {
      alert("Seleziona almeno un giorno della settimana.");
      return;
    }

    const existingDates = new Set(trips.map((trip) => trip.date));

    const newTrips: Trip[] = [];

    const start = new Date(`${generatorForm.from}T12:00:00`);

    const end = new Date(`${generatorForm.to}T12:00:00`);

    const current = new Date(start);

    while (current <= end) {
      const dateString = formatInputDate(current);

      const dayOfWeek = getDayOfWeek(dateString);

      const isSelectedDay = selectedDays.includes(dayOfWeek);

      const alreadyExists = existingDates.has(dateString);

      if (isSelectedDay && !alreadyExists) {
        newTrips.push({
          id: createId(),
          date: dateString,
          type: "Allenamento",
          name: "Allenamento",
          km: 20,
          totalKm: 40,
          driver: null,
          automatic: true,
          completed: false,
        });
        existingDates.add(dateString);
      }

      current.setDate(current.getDate() + 1);
    }

    if (newTrips.length === 0) {
      alert(
        "Non sono stati creati nuovi allenamenti. Le date selezionate esistono già oppure non ci sono giorni compatibili.",
      );
      return;
    }

    setTrips((current) => [...current, ...newTrips]);

    alert(`Creati ${newTrips.length} nuovi allenamenti.`);

    setActiveTab("trasferte");
  };

  return {
    tripForm,
    setTripForm,
    editingTripId,
    generatorForm,
    setGeneratorForm,
    resetTripForm,
    handleTripSubmit,
    editTrip,
    deleteTrip,
    generateAutomaticTrainings,
  };
};
