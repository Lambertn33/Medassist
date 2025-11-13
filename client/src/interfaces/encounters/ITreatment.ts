export interface ITreatment {
  id: number;
  encounter_id: number;
  type: 'MEDICATION' | 'PROCEDURE' | 'COUNSELING';
  description: string;
  dosage?: string;
  duration?: string;
  notes?: string;
}