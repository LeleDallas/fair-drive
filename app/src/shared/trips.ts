import type { Trip } from "./types";

export const sortTrips = (trips: Trip[]): Trip[] => {
  return [...trips].sort((a, b) => {
    const dateDifference = new Date(a.date).getTime() - new Date(b.date).getTime();

    if (dateDifference !== 0) {
      return dateDifference;
    }

    return a.name.localeCompare(b.name);
  });
};
