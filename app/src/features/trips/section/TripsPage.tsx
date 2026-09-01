import type { FormEvent } from "react";
import { EmptyState } from "../../../shared/components/EmptyState";
import { TrainingGenerator } from "../TrainingGenerator";
import { TripForm } from "../TripForm";
import { TripRow } from "../TripRow";
import type { Trip } from "../../../shared/types";
import type { GeneratorForm, TripForm as TripFormState } from "../types";

interface TripsPageProps {
  trips: Trip[];
  sortedTrips: Trip[];
  formatDate: (date: string) => string;
  tripForm: TripFormState;
  setTripForm: (form: TripFormState) => void;
  editingTripId: string | null;
  generatorForm: GeneratorForm;
  setGeneratorForm: (form: GeneratorForm) => void;
  resetTripForm: () => void;
  handleTripSubmit: (event: FormEvent<HTMLFormElement>) => void;
  editTrip: (trip: Trip) => void;
  deleteTrip: (id: string) => void;
  generateAutomaticTrainings: () => void;
}

export const TripsPage = ({
  trips,
  sortedTrips,
  formatDate,
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
}: TripsPageProps) => {
  return (
    <section>
      <div className="section-title">
        <div>
          <span className="section-kicker">STAGIONE</span>

          <h2>{editingTripId ? "Modifica trasferta" : "Gestione trasferte"}</h2>
        </div>

        {editingTripId && (
          <button className="button secondary" onClick={resetTripForm}>
            Annulla modifica
          </button>
        )}
      </div>

      {!editingTripId && (
        <TrainingGenerator
          generatorForm={generatorForm}
          setGeneratorForm={setGeneratorForm}
          onGenerate={generateAutomaticTrainings}
        />
      )}

      <TripForm
        tripForm={tripForm}
        setTripForm={setTripForm}
        editingTripId={editingTripId}
        onSubmit={handleTripSubmit}
        onCancel={resetTripForm}
      />

      <div className="section-title trips-heading">
        <div>
          <span className="section-kicker">CALENDARIO</span>

          <h2>Tutte le trasferte</h2>
        </div>

        <span className="counter">{trips.length} eventi</span>
      </div>

      {sortedTrips.length === 0 ? (
        <EmptyState
          icon="🗓️"
          title="Nessuna trasferta"
          text="Genera automaticamente gli allenamenti oppure aggiungi una partita."
        />
      ) : (
        <div className="trip-list">
          {sortedTrips.map((trip) => (
            <TripRow
              key={trip.id}
              trip={trip}
              formatDate={formatDate}
              onEdit={() => editTrip(trip)}
              onDelete={() => deleteTrip(trip.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
};
