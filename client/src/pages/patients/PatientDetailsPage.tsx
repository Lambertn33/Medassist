import { PatientDetails, Loader } from "@/components";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { getPatient } from "@/api/patients";
import type { IPatientDetails } from "@/interfaces/patients/IPatient";

export const PatientDetailsPage = () => {
    const { id } = useParams();
    const { data, isLoading, error } = useQuery<{ patient: IPatientDetails }>({
        queryKey: ['patient', id],
        queryFn: () => getPatient(Number(id)),
    });
    if (isLoading) return <Loader />;
    if (error) return <div>Error: {error.message}</div>;
    return (
        <div>
            <PatientDetails patientDetails={data?.patient as IPatientDetails} />
        </div>
    );
};