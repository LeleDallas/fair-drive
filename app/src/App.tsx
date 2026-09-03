import { useEffect, useMemo, useState } from "react";
import { DashboardPage } from "./features/dashboard";
import { PlayersPage } from "./features/players/PlayersPage";
import { useTrips } from "./features/trips/hooks/useTrips";
import { TripsPage } from "./features/trips/section/TripsPage";
import { StatCard } from "./shared/components/StatCard";
import { formatDate } from "./shared/dates";
import { STORAGE_KEY, defaultPlayers, loadData } from "./shared/storage";
import { sortTrips } from "./shared/trips";
import type { Injury, Tab, Trip } from "./shared/types";
import { adminLogin, isAdmin, logout, saveData } from "./api";

const App: React.FC = () => {
  const [players, setPlayers] = useState<string[]>(defaultPlayers);

  const [trips, setTrips] = useState<Trip[]>([]);

  const [injuries, setInjuries] = useState<Injury[]>([]);

  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<Tab>("piano");

  const [admin, setAdmin] = useState<boolean>(isAdmin());

  const [showLogin, setShowLogin] = useState(false);

  const [password, setPassword] = useState("");

  const [loggingIn, setLoggingIn] = useState(false);
  const [saving, setSaving] = useState(false);

  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    const loadInitialData = async (): Promise<void> => {
      const data = await loadData();

      setPlayers(data.players);
      setTrips(data.trips);
      setInjuries(data.injuries);

      setLoading(false);
    };

    void loadInitialData();
  }, []);

  const sortedTrips = useMemo<Trip[]>(() => sortTrips(trips), [trips]);

  const assignedTrips = useMemo<Trip[]>(
    () => trips.filter((trip) => trip.driver !== null),
    [trips],
  );

  const totals = useMemo<Record<string, number>>(() => {
    const result: Record<string, number> = {};

    players.forEach((player) => {
      result[player] = 0;
    });

    assignedTrips.forEach((trip) => {
      if (trip.driver && result[trip.driver] !== undefined) {
        result[trip.driver] += trip.totalKm;
      }
    });

    return result;
  }, [players, assignedTrips]);

  const totalKm: number = Object.values(totals).reduce((sum, km) => sum + km, 0);

  const idealKm: number = players.length > 0 ? totalKm / players.length : 0;

  const maxKm: number = Math.max(...Object.values(totals), 0);

  const minKm: number = Math.min(...Object.values(totals), 0);

  const difference: number = maxKm - minKm;

  const tripsApi = useTrips(trips, setTrips, setActiveTab);

  const resetAll = (): void => {
    const confirmed = window.confirm("ATTENZIONE: vuoi cancellare giocatori, trasferte e turni?");

    if (!confirmed) {
      return;
    }

    localStorage.removeItem(STORAGE_KEY);

    setPlayers([...defaultPlayers]);
    setTrips([]);
    setInjuries([]);
    tripsApi.resetTripForm();
  };

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // oxlint-disable-next-line react/set-state-in-effect
    setTrips((current) =>
      current.map((trip) => {
        const tripDate = new Date(`${trip.date}T00:00:00`);

        if (tripDate < today && !trip.completed) {
          return {
            ...trip,
            completed: true,
          };
        }

        return trip;
      }),
    );
  }, []);

  const handleLogin = async () => {
    if (!password.trim()) {
      return;
    }

    try {
      setLoggingIn(true);
      setSaveMessage("");

      await adminLogin(password);

      setAdmin(true);
      setPassword("");
      setShowLogin(false);
      setSaveMessage("");
    } catch (error) {
      setSaveMessage(error instanceof Error ? error.message : "Login fallito");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    logout();

    setAdmin(false);
    setSaveMessage("");
  };

  const handleSave = async () => {
    if (!admin) {
      setSaveMessage("Devi essere autenticato come admin");
      return;
    }

    try {
      setSaving(true);
      setSaveMessage("");

      await saveData({
        players,
        trips,
        injuries,
      });

      setSaveMessage("✅ Modifiche pubblicate correttamente");
    } catch (error) {
      setSaveMessage(error instanceof Error ? error.message : "Errore durante la pubblicazione");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading-screen">Caricamento dati...</div>;
  }

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-content">
          <div>
            <div className="eyebrow">🚗Car Mercato Season 2⚽</div>

            <h1>
              Turni in macchina
              <span> equilibrati.</span>
            </h1>

            <p>Bilancia i chilometri tra i giocatori.</p>
          </div>

          <div className="hero-badge">
            <strong>{players.length}</strong>
            <span>giocatori</span>
          </div>
        </div>
      </header>

      <main className="container">
        <section className="stats-grid">
          <StatCard label="Trasferte" value={trips.length} suffix="" icon="🚗" />

          <StatCard label="Km totali" value={Math.round(totalKm)} suffix=" km" icon="📍" />

          <StatCard label="Media ideale" value={Math.round(idealKm)} suffix=" km" icon="⚖️" />

          <StatCard label="Differenza" value={Math.round(difference)} suffix=" km" icon="📊" />
        </section>

        <nav className="tabs">
          <button
            className={activeTab === "piano" ? "active" : ""}
            onClick={() => setActiveTab("piano")}
          >
            📅 Piano
          </button>

          <button
            className={activeTab === "trasferte" ? "active" : ""}
            onClick={() => setActiveTab("trasferte")}
          >
            🚗 Trasferte
          </button>

          <button
            className={activeTab === "giocatori" ? "active" : ""}
            onClick={() => setActiveTab("giocatori")}
          >
            👥 Giocatori
          </button>
        </nav>

        {activeTab === "piano" && (
          <DashboardPage
            trips={sortedTrips}
            players={players}
            injuries={injuries}
            totals={totals}
            idealKm={idealKm}
            formatDate={formatDate}
            setTrips={setTrips}
            setActiveTab={setActiveTab}
            editTrip={tripsApi.editTrip}
            deleteTrip={tripsApi.deleteTrip}
          />
        )}

        {activeTab === "trasferte" && (
          <TripsPage
            trips={trips}
            sortedTrips={sortedTrips}
            formatDate={formatDate}
            tripForm={tripsApi.tripForm}
            setTripForm={tripsApi.setTripForm}
            editingTripId={tripsApi.editingTripId}
            generatorForm={tripsApi.generatorForm}
            setGeneratorForm={tripsApi.setGeneratorForm}
            resetTripForm={tripsApi.resetTripForm}
            handleTripSubmit={tripsApi.handleTripSubmit}
            editTrip={tripsApi.editTrip}
            deleteTrip={tripsApi.deleteTrip}
            generateAutomaticTrainings={tripsApi.generateAutomaticTrainings}
            players={players}
          />
        )}

        {activeTab === "giocatori" && (
          <PlayersPage
            players={players}
            setPlayers={setPlayers}
            setTrips={setTrips}
            injuries={injuries}
            setInjuries={setInjuries}
            totals={totals}
            formatDate={formatDate}
            onResetAll={resetAll}
          />
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <span className="footer-brand">Fair Drive · LeleDallas</span>

          <div className="footer-actions">
            {admin && (
              <>
                <span className="admin-status">
                  <span className="admin-status-dot" />
                  Admin
                </span>

                <button
                  className="publish-button"
                  onClick={() => void handleSave()}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="publish-spinner" />
                      Pubblicazione...
                    </>
                  ) : (
                    <>
                      <span>💾</span>
                      Pubblica modifiche
                    </>
                  )}
                </button>

                <button className="logout-button" onClick={handleLogout}>
                  Esci
                </button>
              </>
            )}

            {!admin && (
              <button className="admin-button" onClick={() => setShowLogin(true)}>
                <span>🔒</span>
                Accesso admin
              </button>
            )}
          </div>
        </div>
      </footer>

      {showLogin && (
        <div className="admin-modal-backdrop" onClick={() => setShowLogin(false)}>
          <div className="admin-modal" onClick={(event) => event.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="admin-modal-icon">🔐</div>

              <div>
                <h2>Accesso admin</h2>

                <p>Inserisci la password per modificare e pubblicare i dati.</p>
              </div>
            </div>

            <input
              className="admin-password-input"
              type="password"
              placeholder="Password"
              value={password}
              autoFocus
              onChange={(event) => setPassword(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  void handleLogin();
                }
              }}
            />

            {saveMessage && !admin && <div className="admin-login-error">{saveMessage}</div>}

            <div className="admin-modal-actions">
              <button
                className="admin-cancel-button"
                onClick={() => {
                  setShowLogin(false);
                  setPassword("");
                  setSaveMessage("");
                }}
              >
                Annulla
              </button>

              <button
                className="admin-login-button"
                onClick={() => void handleLogin()}
                disabled={!password || loggingIn}
              >
                {loggingIn ? "Accesso..." : "Accedi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
