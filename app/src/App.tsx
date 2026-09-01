import { useEffect, useMemo, useState } from "react";
import { DashboardPage } from "./features/dashboard";
import { PlayersPage } from "./features/players/PlayersPage";
import { useTrips } from "./features/trips/hooks/useTrips";
import { TripsPage } from "./features/trips/section/TripsPage";
import { StatCard } from "./shared/components/StatCard";
import { formatDate } from "./shared/dates";
import { STORAGE_KEY, defaultPlayers, loadData, saveData } from "./shared/storage";
import { sortTrips } from "./shared/trips";
import type { Injury, Tab, Trip } from "./shared/types";

const App: React.FC = () => {
  const [players, setPlayers] = useState<string[]>(defaultPlayers);

  const [trips, setTrips] = useState<Trip[]>([]);

  const [injuries, setInjuries] = useState<Injury[]>([]);

  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<Tab>("piano");

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

  useEffect(() => {
    saveData({ players, trips, injuries });
  }, [players, trips, injuries]);

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

      <footer>I dati vengono salvati automaticamente su questo dispositivo.</footer>
    </div>
  );
};

export default App;
