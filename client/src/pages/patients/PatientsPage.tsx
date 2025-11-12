import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPatients, createPatient } from '@/api/patients';
import type { IPatient } from '@/interfaces/patients/IPatient';
import { Button, PatientsList, PatientForm } from '@/components';
import type { PatientFormData } from '@/components/patients/PatientForm';

export const PatientsPage = () => {
    const [inputValue, setInputValue] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const queryClient = useQueryClient();

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(inputValue);
        }, 500);

        return () => clearTimeout(timer);
    }, [inputValue]);

    // Get patients list
    const { data, isLoading, error } = useQuery<{ patients: IPatient[] }>({
        queryKey: ['patients', searchTerm],
        queryFn: () => getPatients(searchTerm || null),
    });

    // Create patient mutation
    const createPatientMutation = useMutation({
        mutationFn: createPatient,
        onSuccess: () => {
            // Invalidate and refetch patients list
            queryClient.invalidateQueries({ queryKey: ['patients'] });
            setIsModalOpen(false);
        },
    });

    // Handle form submission
    const handleSubmit = (formData: PatientFormData) => {
        createPatientMutation.mutate(formData);
    };

    // Handle modal close - reset errors
    const handleClose = () => {
        createPatientMutation.reset();
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-blue-600">Patients List</h1>
                <Button 
                    disabled={false}
                    type="button" 
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium" 
                    loading={false}
                    onClick={() => setIsModalOpen(true)}
                >
                    Add Patient
                </Button>
            </div>
            <PatientsList 
                patients={data?.patients || []} 
                searchValue={inputValue}
                onSearchChange={setInputValue}
                isLoading={isLoading}
                error={error}
            />
            <PatientForm
                isOpen={isModalOpen}
                onClose={handleClose}
                onSubmit={handleSubmit}
                error={createPatientMutation.error as Error | null}
                isLoading={createPatientMutation.isPending}
            />
        </>
    );
};