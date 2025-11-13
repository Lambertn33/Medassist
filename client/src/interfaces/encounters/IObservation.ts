export interface IObservation {
  id: number;
  encounter_id: number;
  type: 'TEMPERATURE' | 'BLOOD_PRESSURE' | 'HEART_RATE' | 'OXYGEN_SATURATION';
  value: string;
  unit: string;
  recorded_at: string;
}

