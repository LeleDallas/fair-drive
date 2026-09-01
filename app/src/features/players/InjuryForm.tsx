import type { FormEvent } from "react";
import type { InjuryForm as InjuryFormState } from "./types";

interface InjuryFormProps {
  players: string[];
  injuryForm: InjuryFormState;
  setInjuryForm: (form: InjuryFormState) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export const InjuryForm: React.FC<InjuryFormProps> = ({
  players,
  injuryForm,
  setInjuryForm,
  onSubmit,
}: InjuryFormProps) => {
  return (
    <form className="card form-card" onSubmit={onSubmit}>
      <div className="form-card-title">
        <h3>Segnala un'assenza</h3>

        <p>
          I turni nel periodo indicato verranno assegnati agli altri giocatori e ribilanciati
          automaticamente al rientro.
        </p>
      </div>

      <div className="form-grid">
        <label>
          Giocatore
          <select
            value={injuryForm.player}
            onChange={(event) =>
              setInjuryForm({
                ...injuryForm,
                player: event.target.value,
              })
            }
          >
            <option value="">Seleziona...</option>

            {players.map((player) => (
              <option key={player} value={player}>
                {player}
              </option>
            ))}
          </select>
        </label>

        <label>
          Dal
          <input
            type="date"
            value={injuryForm.from}
            onChange={(event) =>
              setInjuryForm({
                ...injuryForm,
                from: event.target.value,
              })
            }
          />
        </label>

        <label>
          Al
          <input
            type="date"
            value={injuryForm.to}
            onChange={(event) =>
              setInjuryForm({
                ...injuryForm,
                to: event.target.value,
              })
            }
          />
        </label>
      </div>
      <br />
      <div className="form-actions">
        <button className="button primary" type="submit">
          ＋ Aggiungi assenza
        </button>
      </div>
    </form>
  );
};
