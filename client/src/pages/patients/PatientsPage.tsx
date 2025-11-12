import { useQuery } from '@tanstack/react-query';
import { getPatients } from '@/api/patients';
import type { IPatient } from '@/interfaces/patients/IPatient';
import { Loader, PatientsList } from '@/components';

export const PatientsPage = () => {
    const { data, isLoading, error } = useQuery<{ patients: IPatient[] }>({
        queryKey: ['patients'],
        queryFn: () => getPatients(),
    });

    if (isLoading) {
        return <Loader />;
    }
    if (error) {
        return <div className="text-red-500 font-bold text-center"> {error instanceof Error ? error.message : 'An unexpected error occurred'}</div>;
    }


    return (
        <>
            <h1 className="text-3xl font-bold text-blue-600 mb-8">Patients List</h1>
            <PatientsList patients={data?.patients || []} />
        </>
    );
};