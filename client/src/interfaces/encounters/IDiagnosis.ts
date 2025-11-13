export interface IDiagnosis {
  id: number;
  encounter_id: number;
  code: string | null;
  label: string;
  is_primary: boolean;
}

export interface ICreateDiagnosis {
  code: string | null;
  label: string;
  is_primary: boolean;
}