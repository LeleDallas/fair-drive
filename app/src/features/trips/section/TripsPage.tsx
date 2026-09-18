import type { FormEvent } from "react";
import { EmptyState } from "../../../shared/components/EmptyState";
import { TrainingGenerator } from "../TrainingGenerator";
import { TripForm } from "../TripForm";
import { TripRow } from "../TripRow";
import type { Trip } from "../../../shared/types";
import type { GeneratorForm, TripForm as TripFormState } from "../types";

export interface Driver {
  id: string;
  name: string;
}

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
  players: string[];
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
  players,
}: TripsPageProps) => {
  const pendingTrips = sortedTrips.filter((trip) => !trip.completed);
  const completedTrips = sortedTrips.filter((trip) => trip.completed);
  const completedByMonth = completedTrips.reduce<Map<string, Trip[]>>((groups, trip) => {
    const monthKey = trip.date.slice(0, 7);
    const monthTrips = groups.get(monthKey) ?? [];

    monthTrips.push(trip);
    groups.set(monthKey, monthTrips);

    return groups;
  }, new Map());

  const renderTrip = (trip: Trip) => (
    <TripRow
      key={trip.id}
      trip={trip}
      formatDate={formatDate}
      onEdit={() => editTrip(trip)}
      onDelete={() => deleteTrip(trip.id)}
    />
  );

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
        players={players}
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
        <>
          {pendingTrips.length > 0 && (
            <div className="trip-list">
              {pendingTrips.map(renderTrip)}
            </div>
          )}

          {completedTrips.length > 0 && (
            <div className="completed-trips">
              <div className="section-title small-title">
                <div>
                  <span className="section-kicker">ARCHIVIO</span>

                  <h2>Trasferte effettuate</h2>
                </div>

                <span className="counter">{completedTrips.length} eventi</span>
              </div>

              <div className="trip-months">
                {[...completedByMonth.entries()].map(([monthKey, monthTrips], index) => (
                  <details className="trip-month" key={monthKey} open={index === 0}>
                    <summary>
                      <span>
                        {new Intl.DateTimeFormat("it-IT", {
                          month: "long",
                          year: "numeric",
                        }).format(new Date(`${monthKey}-01T12:00:00`))}
                      </span>

                      <span className="counter">{monthTrips.length} eventi</span>
                    </summary>

                    <div className="trip-list">{monthTrips.map(renderTrip)}</div>
                  </details>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};
