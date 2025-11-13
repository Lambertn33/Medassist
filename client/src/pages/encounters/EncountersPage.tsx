import { useState } from 'react';
import { getEncounters } from "@/api/encounters";
import { getPatients } from "@/api/patients";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { IEncounter } from "@/interfaces/encounters/IEncounter";
import type { IPatientBase } from "@/interfaces/patients/IPatient";
import { EncountersList } from "@/components";

export const EncountersPage = () => {
    const [selectedPatientId, setSelectedPatientId] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const queryClient = useQueryClient();

    const getCachedPatients = (): { patients: IPatientBase[] } | undefined => {
        return queryClient.getQueryData<{ patients: IPatientBase[] }>(['patients', '']) ||
               queryClient.getQueryData<{ patients: IPatientBase[] }>(['patients', null]) ||
               queryClient.getQueryData<{ patients: IPatientBase[] }>(['patients']);
    };

    const cachedPatients = getCachedPatients();
    
    const { data: patientsData } = useQuery<{ patients: IPatientBase[] }>({
        queryKey: ['patients', ''],
        queryFn: () => getPatients(null),
        initialData: cachedPatients, 
        staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    });

    // Fetch encounters with filters
    const { data, isLoading, error } = useQuery<{ encounters: IEncounter[] }>({
        queryKey: ['encounters', selectedPatientId, selectedStatus],
        queryFn: () => getEncounters(
            selectedPatientId ? parseInt(selectedPatientId) : null,
            selectedStatus || null
        ),
    });

    const handlePatientChange = (patientId: string) => {
        setSelectedPatientId(patientId);
    };

    const handleStatusChange = (status: string) => {
        setSelectedStatus(status);
    };

    return (
        <>
            <h1 className="text-3xl font-bold text-blue-600 mb-8">Encounters</h1>
            <EncountersList 
                encounters={data?.encounters || []}
                patients={patientsData?.patients}
                selectedPatientId={selectedPatientId}
                selectedStatus={selectedStatus}
                onPatientChange={handlePatientChange}
                onStatusChange={handleStatusChange}
                isLoading={isLoading}
                error={error}
            />
        </>
    );
}