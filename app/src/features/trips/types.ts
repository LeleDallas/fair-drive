import type { TripType } from "../../shared/types";

export interface TripForm {
  date: string;
  type: TripType;
  name: string;
  km: string;
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
};

export const emptyGeneratorForm: GeneratorForm = {
  from: "",
  to: "",
  tuesday: true,
  wednesday: true,
  friday: true,
};
