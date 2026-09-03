import type { TripType } from "../../shared/types";

export interface TripForm {
  date: string;
  type: TripType;
  name: string;
  km: string;
  driverId: string | null;
}

export interface GeneratorForm {
  from: string;
  to: string;
  tuesday: boolean;
  wednesday: boolean;
  friday: boolean;
}

export const emptyTripForm: TripForm = {
  date: "",
  type: "Allenamento",
  name: "",
  km: "",
  driverId: null,
};

export const emptyGeneratorForm: GeneratorForm = {
  from: "",
  to: "",
  tuesday: true,
  wednesday: true,
  friday: true,
};
