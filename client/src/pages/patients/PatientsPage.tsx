import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPatients } from '@/api/patients';
import type { IPatient } from '@/interfaces/patients/IPatient';
import { PatientsList } from '@/components';

export const PatientsPage = () => {
    const [inputValue, setInputValue] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(inputValue);
        }, 500);

        return () => clearTimeout(timer);
    }, [inputValue]);

    const { data, isLoading, error } = useQuery<{ patients: IPatient[] }>({
        queryKey: ['patients', searchTerm],
        queryFn: () => getPatients(searchTerm || null),
    });

    return (
        <>
            <h1 className="text-3xl font-bold text-blue-600 mb-8">Patients List</h1>
            <PatientsList 
                patients={data?.patients || []} 
                searchValue={inputValue}
                onSearchChange={setInputValue}
                isLoading={isLoading}
                error={error}
            />
        </>
    );
};