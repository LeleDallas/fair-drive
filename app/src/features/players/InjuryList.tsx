import type { Injury } from "../../shared/types";

interface InjuryListProps {
  injuries: Injury[];
  formatDate: (date: string) => string;
  onDelete: (id: string) => void;
}

export const InjuryList: React.FC<InjuryListProps> = ({
  injuries,
  formatDate,
  onDelete,
}: InjuryListProps) => {
  if (injuries.length === 0) {
    return null;
  }

  return (
    <div className="card injury-list">
      {injuries.map((injury) => (
        <div className="injury-row" key={injury.id}>
          <div className="injury-info">
            <strong>{injury.player}</strong>

            <span>
              {formatDate(injury.from)} → {formatDate(injury.to)}
            </span>
          </div>

          <button className="button primary" onClick={() => onDelete(injury.id)}>
            Elimina
          </button>
        </div>
      ))}
    </div>
  );
};
