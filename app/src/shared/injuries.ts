import type { Injury } from "./types";
import { formatInputDate } from "./dates";

export const isPlayerInjuredOnDate = (
  injuries: Injury[],
  player: string,
  date: string,
): boolean => {
  return injuries.some(
    (injury) => injury.player === player && date >= injury.from && date <= injury.to,
  );
};

export const isPlayerCurrentlyInjured = (injuries: Injury[], player: string): boolean => {
  const today = formatInputDate(new Date());
  return isPlayerInjuredOnDate(injuries, player, today);
};
