import type { IPatientEncounterDetails } from "@/interfaces/patients/IPatient";
import { formatDateTime } from "@/utils";

export const PatientDetailsEncounters = ({ encounters }: { encounters: IPatientEncounterDetails[] }) => {
    const getStatusBadge = (status: string) => {
        const statusColors: Record<string, string> = {
          INITIALIZED: 'bg-gray-100 text-gray-800',
          IN_PROGRESS: 'bg-blue-100 text-blue-800',
          COMPLETED: 'bg-green-100 text-green-800',
          CANCELED: 'bg-red-100 text-red-800',
        };
    
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              statusColors[status] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {status.replace(/_/g, ' ')}
          </span>
        );
      };
    return (
        <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold">
                Healthcare Provider
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
                Summary
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {encounters.map((encounter) => (
              <tr
                key={encounter.id}
                className="bg-white hover:bg-blue-50 transition-colors"
              >
                <td className="px-6 py-4 text-gray-700">
                  {encounter.user?.name || 'N/A'}
                </td>
                <td className="px-6 py-4">{getStatusBadge(encounter.status)}</td>
                <td className="px-6 py-4 text-gray-700">
                  {formatDateTime(encounter.started_at)}
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {formatDateTime(encounter.ended_at)}
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {encounter.summary || (
                    <span className="text-gray-400 italic">No summary</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
};