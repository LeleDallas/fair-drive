import type { Trip } from "../../shared/types";

interface TripRowProps {
  trip: Trip;
  formatDate: (date: string) => string;
  onEdit: () => void;
  onDelete: () => void;
}

export const TripRow: React.FC<TripRowProps> = ({
  trip,
  formatDate,
  onEdit,
  onDelete,
}: TripRowProps) => {
  return (
    <div className="trip-row">
      <div className="trip-date">
        <strong>{formatDate(trip.date)}</strong>

        <span>
          {trip.type}
          {trip.automatic ? " · AUTOMATICO" : ""}
        </span>
      </div>

      <div className="trip-main">
        <strong>{trip.name}</strong>

        <span>
          {trip.km} km andata → <b>{trip.totalKm} km totali</b>
        </span>
      </div>

      <div className="trip-driver">
        {trip.driver ? (
          <>
            <span>🚗</span>
            {trip.driver}
          </>
        ) : (
          <span className="not-assigned">Da assegnare</span>
        )}
      </div>

      <div className="row-actions">
        <button onClick={onEdit}>Modifica</button>

        <button className="delete" onClick={onDelete}>
          Elimina
        </button>
      </div>
    </div>
  );
};
