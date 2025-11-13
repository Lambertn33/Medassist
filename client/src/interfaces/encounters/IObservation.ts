export interface IObservation {
  id: number;
  encounter_id: number;
  type: ObservationType;
  value: string;
  unit: string;
  recorded_at: string;
}


export interface ICreateObservation {
  type: ObservationType;
  value: string;
  unit: string;
}

type ObservationType = 'TEMPERATURE' | 'BLOOD_PRESSURE' | 'HEART_RATE' | 'OXYGEN_SATURATION';
