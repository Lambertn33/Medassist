import { useState } from "react";
import { PatientDetails, Loader, PatientForm, Toast } from "@/components";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router";
import { getPatient, updatePatient } from "@/api/patients";
import { createEncounter } from "@/api/encounters";
import type { IPatientDetails, IPatientFormData } from "@/interfaces/patients/IPatient";

export const PatientDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery<{ patient: IPatientDetails }>({
        queryKey: ['patient', id],
        queryFn: () => getPatient(Number(id)),
    });

    const updatePatientMutation = useMutation({
        mutationFn: (formData: IPatientFormData) => updatePatient(Number(id!), formData),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['patient', id] });
            queryClient.invalidateQueries({ queryKey: ['patients'] });
            setIsEditModalOpen(false);
            const message = data?.message as string;
            setToastMessage(message);
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 3000);
        },
    });

    const createEncounterMutation = useMutation({
        mutationFn: (patientId: number) => createEncounter(patientId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['patient', id] });
            queryClient.invalidateQueries({ queryKey: ['encounters'] });
            
            const message = data?.message as string || 'Encounter created successfully';
            setToastMessage(message);
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 3000);

            const encounterId = data?.encounter?.id;
            if (encounterId) {
                setTimeout(() => {
                    navigate(`/dashboard/encounters/${encounterId}`);
                }, 1500);
            }
        },
        onError: (error) => {
            setToastMessage(error.message);
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 3000);
        },
    });

    const handleEdit = () => {
        setIsEditModalOpen(true);
    };

    const handleClose = () => {
        updatePatientMutation.reset();
        setIsEditModalOpen(false);
    };

    const handleSubmit = (formData: IPatientFormData) => {
        updatePatientMutation.mutate(formData);
    };

    const handleCreateEncounter = () => {
        if (id) {
            createEncounterMutation.mutate(Number(id));
        }
    };

    if (isLoading) return <Loader />;
    if (error) return <div>Error: {error.message}</div>;
    
    return (
        <div>
            {showToast && (
                <div className="fixed top-20 right-4 z-50 transition-all duration-300 ease-in-out">
                    <Toast
                        message={toastMessage}
                        type="success"
                    />
                </div>
            )}
            <PatientDetails 
                patientDetails={data?.patient as IPatientDetails}
                onEdit={handleEdit}
                onCreateEncounter={handleCreateEncounter}
                isCreatingEncounter={createEncounterMutation.isPending}
            />
            <PatientForm
                isOpen={isEditModalOpen}
                onClose={handleClose}
                onSubmit={handleSubmit}
                error={updatePatientMutation.error as Error | null}
                isLoading={updatePatientMutation.isPending}
                isEditing={true}
                patientData={data?.patient as IPatientDetails}
            />
        </div>
    );
};