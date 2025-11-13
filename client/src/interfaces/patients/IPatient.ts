export interface IPatientBase {
    id: number;
    first_name: string;
    last_name: string;
    gender: string;
    date_of_birth: string;
    encounters_count: number;
}

export interface IPatientFormData {
    first_name: string;
    last_name: string;
    gender: string;
    date_of_birth: string;
    phone: string;
    national_id: string;
    address: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
}

export interface IPatientDetails extends IPatientBase {
    phone: string;
    national_id: string;
    address: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
    encounters_count: number;
    encounters: IPatientEncounterDetails[];
}

export interface IPatientEncounterDetails {
    id: number;
    patient_id: number;
    user_id: number;
    status: string;
    started_at: string;
    ended_at: string;
    summary: string;
    user?: {
        id: number;
        name: string;
    };
}


