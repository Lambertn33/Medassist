export interface IEncounter {
    id: number;
    patient_id: number;
    user_id: number;
    status: string;
    started_at: string;
    ended_at: string;
    summary: string;
    patient: {
        id: number;
        first_name: string;
        last_name: string;
        gender: string;
        date_of_birth: string;
        phone: string;
        national_id: string;
        address: string;
        emergency_contact_name: string;
        emergency_contact_phone: string;
    };
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
    };
}