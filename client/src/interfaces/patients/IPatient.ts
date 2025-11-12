export interface IPatient {
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

