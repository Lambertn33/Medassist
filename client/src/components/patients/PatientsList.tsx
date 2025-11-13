import { Link } from 'react-router';
import type { IPatientBase } from '@/interfaces/patients/IPatient';
import { TableSearch, Loader, Button } from '@/components';
import { formatDate } from '@/utils';
import { useAuth } from '@/hooks/useAuth';

interface PatientsListProps {
  patients: IPatientBase[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  isLoading?: boolean;
  error?: Error | null;
  onDelete?: (id: number) => void;
  isDeleting?: boolean;
}

export const PatientsList = ({ 
  patients, 
  searchValue, 
  onSearchChange, 
  isLoading = false,
  error,
  onDelete,
  isDeleting = false
}: PatientsListProps) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <div className="my-4 mx-6 flex justify-end">
          <TableSearch value={searchValue} onChange={onSearchChange} />
        </div>
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold">
                Name
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Gender
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Date of Birth
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Number of Encounters
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8">
                  <Loader message="Loading patients..." />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center">
                  <p className="text-red-500 font-medium">
                    {error instanceof Error ? error.message : 'An unexpected error occurred'}
                  </p>
                </td>
              </tr>
            ) : patients.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center">
                  <p className="text-gray-500 text-lg">No patients found</p>
                </td>
              </tr>
            ) : (
              patients.map((patient) => (
                <tr
                  key={patient.id}
                  className="bg-white hover:bg-blue-50 transition-colors"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {patient.first_name} {patient.last_name}
                  </th>
                  <td className="px-6 py-4 text-gray-700">{patient.gender}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {formatDate(patient.date_of_birth)}
                  </td>
                  <td className="px-6 py-4 text-gray-700 text-center">
                    {patient.encounters_count || 0}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <Link
                      to={`/dashboard/patients/${patient.id}`}
                      className="inline-block px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                    >
                      View
                    </Link>
                    {isAdmin && (
                      <Button
                        disabled={isDeleting}
                        type="button"
                        loading={isDeleting}
                        onClick={() => onDelete?.(patient.id)}
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