export interface InjuryForm {
  player: string;
  from: string;
  to: string;
}

export const emptyInjuryForm: InjuryForm = {
  player: "",
  from: "",
  to: "",
};
