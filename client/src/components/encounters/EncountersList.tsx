import { Link } from 'react-router';
import type { IEncounter } from '@/interfaces/encounters/IEncounter';
import { Loader, Button, EncountersFilter } from '@/components';
import type { IPatientBase } from '@/interfaces/patients/IPatient';
import { formatDateTime } from '@/utils';

interface EncountersListProps {
  encounters: IEncounter[];
  patients?: IPatientBase[];
  selectedPatientId?: string;
  selectedStatus?: string;
  onPatientChange?: (patientId: string) => void;
  onStatusChange?: (status: string) => void;
  isLoading?: boolean;
  error?: Error | null;
  onDelete?: (id: number) => void;
  isDeleting?: boolean;
}

export const EncountersList = ({ 
  encounters,
  patients,
  selectedPatientId,
  selectedStatus,
  onPatientChange,
  onStatusChange,
  isLoading = false,
  error,
  onDelete,
  isDeleting = false
}: EncountersListProps) => {

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {patients && onPatientChange && onStatusChange && (
        <EncountersFilter
          patients={patients}
          selectedPatientId={selectedPatientId || ''}
          selectedStatus={selectedStatus || ''}
          onPatientChange={onPatientChange}
          onStatusChange={onStatusChange}
        />
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold">
                Patient Name
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Status
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Started At
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Ended At
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Provider
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8">
                  <Loader message="Loading encounters..." />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center">
                  <p className="text-red-500 font-medium">
                    {error instanceof Error ? error.message : 'An unexpected error occurred'}
                  </p>
                </td>
              </tr>
            ) : encounters.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center">
                  <p className="text-gray-500 text-lg">No encounters found</p>
                </td>
              </tr>
            ) : (
              encounters.map((encounter) => (
                <tr
                  key={encounter.id}
                  className="bg-white hover:bg-blue-50 transition-colors"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {encounter.patient?.first_name} {encounter.patient?.last_name}
                  </th>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      encounter.status === 'COMPLETED' 
                        ? 'bg-green-100 text-green-800' 
                        : encounter.status === 'IN_PROGRESS'
                        ? 'bg-blue-100 text-blue-800'
                        : encounter.status === 'CANCELED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {encounter.status === 'IN_PROGRESS' ? 'In Progress' : 
                       encounter.status === 'COMPLETED' ? 'Completed' :
                       encounter.status === 'INITIALIZED' ? 'Initialized' :
                       encounter.status === 'CANCELED' ? 'Canceled' :
                       encounter.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {formatDateTime(encounter.started_at)}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {formatDateTime(encounter.ended_at)}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {encounter.user?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <Link
                      to={`/dashboard/patients/${encounter.patient_id}`}
                      className="inline-block px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                    >
                      View
                    </Link>
                    {onDelete && (
                      <Button
                        disabled={isDeleting}
                        type="button"
                        loading={isDeleting}
                        onClick={() => onDelete?.(encounter.id)}
                        className={`inline-block px-4 py-2 cursor-pointer ${isDeleting ? 'bg-red-200' : 'bg-red-600'} text-white rounded-md hover:bg-red-700 transition-colors font-medium`}
                      >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

