export interface IDashboardData {
    patients: number;
    encounters: number;
    inProgressEncounters: number;
    completedEncounters: number;
    cancelledEncounters: number;
    observations: number;
    diagnoses: number;
    treatments: number;
    todayEncounters: {
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
        };
        user: {
            id: number;
            name: string;
        };
    }[];
}

export interface ILatestEncounter {
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
    };
    user: {
        id: number;
        name: string;
    };
}