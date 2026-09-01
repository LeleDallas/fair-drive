import type { FormEvent } from "react";
import type { TripType } from "../../shared/types";
import type { TripForm as TripFormState } from "./types";

interface TripFormProps {
  tripForm: TripFormState;
  setTripForm: (form: TripFormState) => void;
  editingTripId: string | null;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

export const TripForm = ({
  tripForm,
  setTripForm,
  editingTripId,
  onSubmit,
  onCancel,
}: TripFormProps) => {
  return (
    <form className="card form-card" onSubmit={onSubmit}>
      <div className="form-card-title">
        <h3>{editingTripId ? "Modifica evento" : "Aggiungi evento manualmente"}</h3>
      </div>

      <div className="form-grid">
        <label>
          Data
          <input
            type="date"
            value={tripForm.date}
            onChange={(event) =>
              setTripForm({
                ...tripForm,
                date: event.target.value,
              })
            }
          />
        </label>

        <label>
          Tipo
          <select
            value={tripForm.type}
            onChange={(event) =>
              setTripForm({
                ...tripForm,
                type: event.target.value as TripType,
              })
            }
          >
            <option value="Allenamento">Allenamento</option>

            <option value="Partita">Partita</option>

            <option value="Altro">Altro</option>
          </select>
        </label>

        <label className="wide">
          Nome / destinazione
          <input
            type="text"
            placeholder="Es. Partita a ..."
            value={tripForm.name}
            onChange={(event) =>
              setTripForm({
                ...tripForm,
                name: event.target.value,
              })
            }
          />
        </label>

        <label>
          Km di andata
          <div className="km-input">
            <input
              type="number"
              min="0"
              step="0.1"
              placeholder="25"
              value={tripForm.km}
              onChange={(event) =>
                setTripForm({
                  ...tripForm,
                  km: event.target.value,
                })
              }
            />

            <span>km</span>
          </div>
        </label>
      </div>

      <div className="form-info">
        ↔️ Verranno conteggiati automaticamente{" "}
        <strong>{tripForm.km ? `${Number(tripForm.km) * 2} km` : "0 km"}</strong> tra andata e
        ritorno.
      </div>

      <div className="form-actions">
        <button className="button primary" type="submit">
          {editingTripId ? "💾 Salva modifica" : "＋ Aggiungi evento"}
        </button>

        {editingTripId && (
          <button type="button" className="button secondary" onClick={onCancel}>
            Annulla
          </button>
        )}
      </div>
    </form>
  );
};
