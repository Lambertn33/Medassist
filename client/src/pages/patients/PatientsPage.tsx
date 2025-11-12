import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPatients, createPatient, deletePatient } from '@/api/patients';
import type { IPatientBase } from '@/interfaces/patients/IPatient';
import { Button, PatientsList, PatientForm, Toast } from '@/components';
import type { IPatientFormData } from '@/interfaces/patients/IPatient';

export const PatientsPage = () => {
    const [inputValue, setInputValue] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const queryClient = useQueryClient();

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(inputValue);
        }, 500);

        return () => clearTimeout(timer);
    }, [inputValue]);

    // Get patients list
    const { data, isLoading, error } = useQuery<{ patients: IPatientBase[] }>({
        queryKey: ['patients', searchTerm],
        queryFn: () => getPatients(searchTerm || null),
    });

    // Create patient mutation
    const createPatientMutation = useMutation({
        mutationFn: createPatient,
        onSuccess: (data) => {
            // Invalidate and refetch patients list
            queryClient.invalidateQueries({ queryKey: ['patients'] });
            setIsModalOpen(false);

            // Show success toast with message from response
            const message = data?.message as string;
            setToastMessage(message);
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 3000);
        },
    });

    // Delete patient mutation
    const deletePatientMutation = useMutation({
        mutationFn: (id: number) => deletePatient(id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['patients'] });
            const message = data?.message as string || 'Patient deleted successfully';
            setToastMessage(message);
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 3000);
        },
        onError: (error) => {
            setToastMessage(error.message);
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 3000);
        },
    }); 

    // Handle form submission
    const handleSubmit = (formData: IPatientFormData) => {
        createPatientMutation.mutate(formData);
    };

    // Handle modal close - reset errors
    const handleClose = () => {
        createPatientMutation.reset();
        setIsModalOpen(false);
    };

    return (
        <>
            {showToast && (
                <div className="fixed top-20 right-4 z-50 transition-all duration-300 ease-in-out">
                    <Toast
                        message={toastMessage}
                        type="success"
                    />
                </div>
            )}
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
                onDelete={(id) => deletePatientMutation.mutate(id)}
                isDeleting={deletePatientMutation.isPending}
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