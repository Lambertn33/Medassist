import { Select } from "@/components";
import type { IPatientBase } from "@/interfaces/patients/IPatient";

interface EncountersFilterProps {
    patients: IPatientBase[];
    selectedPatientId: string;
    selectedStatus: string;
    onPatientChange: (patientId: string) => void;
    onStatusChange: (status: string) => void;
}

const STATUS_OPTIONS = [
    { value: '', label: 'All Statuses' },
    { value: 'INITIALIZED', label: 'Initialized' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELED', label: 'Canceled' },
];

export const EncountersFilter = ({ 
    patients, 
    selectedPatientId, 
    selectedStatus,
    onPatientChange,
    onStatusChange 
}: EncountersFilterProps) => {
    const patientOptions = [
        { value: '', label: 'All Patients' },
        ...patients.map((patient) => ({
            value: patient.id.toString(),
            label: `${patient.first_name} ${patient.last_name}`,
        })),
    ];

    return (
        <div className="my-4 mx-6 flex gap-4 justify-end">
            <div className="w-full md:w-1/3 lg:w-1/4">
                <Select
                    name="patient"
                    id="patient-filter"
                    value={selectedPatientId}
                    onChange={(e) => onPatientChange(e.target.value)}
                    disabled={false}
                    label="Filter by Patient"
                    additionalClasses="w-full"
                    options={patientOptions}
                />
            </div>
            <div className="w-full md:w-1/3 lg:w-1/4">
                <Select
                    name="status"
                    id="status-filter"
                    value={selectedStatus}
                    onChange={(e) => onStatusChange(e.target.value)}
                    disabled={false}
                    label="Filter by Status"
                    additionalClasses="w-full"
                    options={STATUS_OPTIONS}
                />
            </div>
        </div>
    );
};

