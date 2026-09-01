import type { Dispatch, SetStateAction } from "react";
import type { Injury, Tab, Trip } from "../../shared/types";
import { Plan } from "./Plan";
import { usePlan } from "./hooks/usePlan";

interface DashboardPageProps {
  trips: Trip[];
  players: string[];
  injuries: Injury[];
  totals: Record<string, number>;
  idealKm: number;
  formatDate: (date: string) => string;
  setTrips: Dispatch<SetStateAction<Trip[]>>;
  setActiveTab: Dispatch<SetStateAction<Tab>>;
  editTrip: (trip: Trip) => void;
  deleteTrip: (id: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  trips,
  players,
  injuries,
  totals,
  idealKm,
  formatDate,
  setTrips,
  setActiveTab,
  editTrip,
  deleteTrip,
}: DashboardPageProps) => {
  const { generatePlan, clearAssignments, setTripCompleted } = usePlan(
    trips,
    players,
    injuries,
    setTrips,
    setActiveTab,
  );

  const getPlayerTrips = (player: string): Trip[] => trips.filter((trip) => trip.driver === player);

  return (
    <Plan
      trips={trips}
      players={players}
      totals={totals}
      idealKm={idealKm}
      getPlayerTrips={getPlayerTrips}
      formatDate={formatDate}
      generatePlan={generatePlan}
      clearAssignments={clearAssignments}
      setTripCompleted={setTripCompleted}
      editTrip={editTrip}
      deleteTrip={deleteTrip}
    />
  );
};
