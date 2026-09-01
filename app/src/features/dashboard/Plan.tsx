import { EmptyState } from "../../shared/components/EmptyState";
import type { Trip } from "../../shared/types";

interface PlanProps {
  trips: Trip[];
  players: string[];
  totals: Record<string, number>;
  idealKm: number;
  getPlayerTrips: (player: string) => Trip[];
  formatDate: (date: string) => string;
  generatePlan: () => void;
  clearAssignments: () => void;
  editTrip: (trip: Trip) => void;
  setTripCompleted: (id: string, completed: boolean) => void;
  deleteTrip: (id: string) => void;
}

export const Plan: React.FC<PlanProps> = ({
  trips,
  players,
  totals,
  idealKm,
  getPlayerTrips,
  formatDate,
  generatePlan,
  clearAssignments,
  setTripCompleted,
  editTrip,
  deleteTrip,
}: PlanProps) => {
  const hasPlan: boolean = trips.some((trip) => trip.driver !== null);
  const completedTrips: Trip[] = trips.filter((trip) => trip.completed);
  const pendingTrips: Trip[] = trips.filter((trip) => !trip.completed);

  return (
    <section>
      <div className="section-title">
        <div>
          <span className="section-kicker">DISTRIBUZIONE AUTOMATICA</span>

          <h2>Il piano dei turni</h2>
        </div>

        <div className="actions">
          <button className="button secondary" onClick={clearAssignments} disabled={!hasPlan}>
            ↻ Azzera
          </button>

          <button className="button primary" onClick={generatePlan}>
            ✨ Genera turni
          </button>
        </div>
      </div>

      {!hasPlan ? (
        <EmptyState
          icon="🚘"
          title="Il piano non è ancora stato generato"
          text="Inserisci o genera tutte le trasferte, completa i chilometri e premi «Genera turni»."
          action={generatePlan}
        />
      ) : (
        <>
          <div className="balance-card">
            <div>
              <span className="balance-label">OBIETTIVO DI EQUILIBRIO</span>

              <h3>
                {Math.round(idealKm)} km
                <span> a giocatore</span>
              </h3>

              <p>La distribuzione considera tutte le trasferte presenti nel calendario.</p>
            </div>

            <div className="balance-icon">⚖️</div>
          </div>

          <div className="leaderboard">
            {players
              .map((player) => ({
                player,
                km: totals[player] || 0,
                trips: getPlayerTrips(player).length,
              }))
              .sort((a, b) => b.km - a.km)
              .map((item, index) => {
                const percentage: number =
                  idealKm > 0 ? Math.min((item.km / idealKm) * 100, 100) : 0;

                return (
                  <div className="leader-row" key={item.player}>
                    <div className="rank">{index + 1}</div>

                    <div className="leader-info">
                      <strong>{item.player}</strong>

                      <div className="progress">
                        <div
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="leader-value">
                      <strong>{Math.round(item.km)} km</strong>

                      <span>{item.trips} turni</span>
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="section-title small-title">
            <div>
              <span className="section-kicker">CALENDARIO</span>

              <h2>Chi guida</h2>
            </div>
          </div>

          <div className="schedule">
            {pendingTrips.map((trip) => (
              <div className="schedule-row" key={trip.id}>
                <div className="schedule-date">
                  <strong>{formatDate(trip.date)}</strong>

                  <span>{trip.type}</span>
                </div>

                <div className="schedule-name">
                  <strong>{trip.name}</strong>

                  <span>
                    {trip.km} km andata · {trip.totalKm} km totali
                  </span>
                </div>

                <div className="driver">
                  <span>🚗</span>

                  <strong>{trip.driver || "Non assegnato"}</strong>
                </div>

                <div className="row-actions">
                  <button className="complete" onClick={() => setTripCompleted(trip.id, true)}>
                    ✓ Fatto
                  </button>
                  <button onClick={() => editTrip(trip)}>Modifica</button>

                  <button className="delete" onClick={() => deleteTrip(trip.id)}>
                    Elimina
                  </button>
                </div>
              </div>
            ))}
            {completedTrips.length > 0 && (
              <>
                <div className="section-title small-title completed-title">
                  <div>
                    <span className="section-kicker"> COMPLETATI </span>
                    <h2> Eventi fatti </h2>
                  </div>
                  <span className="counter"> ✓ {completedTrips.length} </span>
                </div>
                <div className="schedule completed-schedule">
                  {completedTrips.map((trip) => (
                    <div className="schedule-row completed-row" key={trip.id}>
                      <div className="schedule-date">
                        <strong> {formatDate(trip.date)} </strong> <span> {trip.type} </span>
                      </div>
                      <div className="schedule-name">
                        <strong> ✓ {trip.name} </strong>
                        <span>
                          {trip.km} km andata · {trip.totalKm} km totali
                        </span>
                      </div>
                      <div className="driver">
                        <span>🚗</span> <strong> {trip.driver || "Non assegnato"} </strong>
                      </div>
                      <div className="row-actions">
                        <button className="reopen" onClick={() => setTripCompleted(trip.id, false)}>
                          ↩ Ripristina
                        </button>
                        <button onClick={() => editTrip(trip)}> Modifica </button>
                        <button className="delete" onClick={() => deleteTrip(trip.id)}>
                          Elimina
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </section>
  );
};
