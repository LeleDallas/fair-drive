import type { GeneratorForm as GeneratorFormState } from "./types";

interface TrainingGeneratorProps {
  generatorForm: GeneratorFormState;
  setGeneratorForm: (form: GeneratorFormState) => void;
  onGenerate: () => void;
}

export const TrainingGenerator: React.FC<TrainingGeneratorProps> = ({
  generatorForm,
  setGeneratorForm,
  onGenerate,
}: TrainingGeneratorProps) => {
  return (
    <div className="card generator-card">
      <div className="generator-header">
        <div>
          <span className="section-kicker">GENERAZIONE AUTOMATICA</span>

          <h3>Crea gli allenamenti</h3>

          <p>Scegli il periodo e i giorni fissi. Le date già presenti non verranno duplicate.</p>
        </div>

        <div className="generator-icon">🗓️</div>
      </div>

      <div className="generator-grid">
        <label>
          Dal
          <input
            type="date"
            value={generatorForm.from}
            onChange={(event) =>
              setGeneratorForm({
                ...generatorForm,
                from: event.target.value,
              })
            }
          />
        </label>

        <label>
          Al
          <input
            type="date"
            value={generatorForm.to}
            onChange={(event) =>
              setGeneratorForm({
                ...generatorForm,
                to: event.target.value,
              })
            }
          />
        </label>
      </div>

      <div className="weekday-selection">
        <label className="day-option">
          <input
            type="checkbox"
            checked={generatorForm.tuesday}
            onChange={(event) =>
              setGeneratorForm({
                ...generatorForm,
                tuesday: event.target.checked,
              })
            }
          />

          <span>
            <b>Martedì</b>
            <small>Allenamento</small>
          </span>
        </label>

        <label className="day-option">
          <input
            type="checkbox"
            checked={generatorForm.wednesday}
            onChange={(event) =>
              setGeneratorForm({
                ...generatorForm,
                wednesday: event.target.checked,
              })
            }
          />

          <span>
            <b>Mercoledì</b>
            <small>Allenamento</small>
          </span>
        </label>

        <label className="day-option">
          <input
            type="checkbox"
            checked={generatorForm.friday}
            onChange={(event) =>
              setGeneratorForm({
                ...generatorForm,
                friday: event.target.checked,
              })
            }
          />

          <span>
            <b>Venerdì</b>
            <small>Allenamento</small>
          </span>
        </label>
      </div>

      <button className="button primary" onClick={onGenerate}>
        ✨ Genera allenamenti
      </button>
    </div>
  );
};
