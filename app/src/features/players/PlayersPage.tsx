import type { Dispatch, SetStateAction } from "react";
import type { Injury, Trip } from "../../shared/types";
import { InjuryForm } from "./InjuryForm";
import { InjuryList } from "./InjuryList";
import { usePlayers } from "./hooks/usePlayers";

interface PlayersPageProps {
  players: string[];
  setPlayers: Dispatch<SetStateAction<string[]>>;
  setTrips: Dispatch<SetStateAction<Trip[]>>;
  injuries: Injury[];
  setInjuries: Dispatch<SetStateAction<Injury[]>>;
  totals: Record<string, number>;
  formatDate: (date: string) => string;
  onResetAll: () => void;
}

export const PlayersPage: React.FC<PlayersPageProps> = ({
  players,
  setPlayers,
  setTrips,
  injuries,
  setInjuries,
  totals,
  formatDate,
  onResetAll,
}: PlayersPageProps) => {
  const {
    sortedInjuries,
    injuryForm,
    setInjuryForm,
    updatePlayer,
    handleInjurySubmit,
    deleteInjury,
    isPlayerCurrentlyInjured,
  } = usePlayers(players, setPlayers, setTrips, injuries, setInjuries);

  return (
    <section>
      <div className="section-title">
        <div>
          <span className="section-kicker">SQUADRA</span>

          <h2>I {players.length} giocatori</h2>
        </div>
      </div>

      <div className="card players-card">
        {players.map((player, index) => (
          <div className="player-edit" key={`${index}-${player}`}>
            <div className="player-number">{index + 1}</div>

            <input value={player} onChange={(event) => updatePlayer(index, event.target.value)} />

            {isPlayerCurrentlyInjured(player) && (
              <span className="injury-badge">🤕 Infortunato</span>
            )}

            <div className="player-km">{Math.round(totals[player] || 0)} km</div>
          </div>
        ))}
      </div>

      <div className="section-title small-title">
        <div>
          <span className="section-kicker">INFORTUNI</span>

          <h2>Assenze e infortuni</h2>
        </div>
      </div>

      <InjuryForm
        players={players}
        injuryForm={injuryForm}
        setInjuryForm={setInjuryForm}
        onSubmit={handleInjurySubmit}
      />

      <InjuryList injuries={sortedInjuries} formatDate={formatDate} onDelete={deleteInjury} />

      <div className="danger-zone">
        <div>
          <strong>Reset completo</strong>

          <p>Cancella tutte le trasferte, assegnazioni e nomi dei giocatori.</p>
        </div>

        <button className="button danger" onClick={onResetAll}>
          Reset
        </button>
      </div>
    </section>
  );
};
