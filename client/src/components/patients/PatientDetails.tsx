import { FaUser, FaStethoscope, FaPhone, FaUserFriends } from 'react-icons/fa';
import { Card } from '@/components/dashboard/Card';
import { formatDate } from '@/utils';
import type { IPatientDetails } from '@/interfaces/patients/IPatient';

export const PatientDetails = ({ patientDetails }: { patientDetails: IPatientDetails }) => {

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

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-600 mb-2">
              {patientDetails.first_name} {patientDetails.last_name}
            </h1>
            <p className="text-gray-600">
              Patient ID: #{patientDetails.id.toString().padStart(6, '0')}
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium">
              Back
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
              Edit
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mb-6">
          <Card
            title="Total Encounters"
            value={patientDetails.encounters?.length || 0}
            icon={<FaStethoscope />}
            bgColor="bg-blue-50"
            iconBgColor="bg-blue-500"
          />
        </div>

        {/* Information Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaUser className="text-blue-600" />
              Personal Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Gender
                </p>
                <p className="text-sm text-gray-900">{patientDetails.gender}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Date of Birth
                </p>
                <p className="text-sm text-gray-900">{formatDate(patientDetails.date_of_birth)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  National ID
                </p>
                <p className="text-sm text-gray-900">{patientDetails.national_id}</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaPhone className="text-blue-600" />
              Contact Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Phone
                </p>
                <p className="text-sm text-gray-900">{patientDetails.phone}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Address
                </p>
                <p className="text-sm text-gray-900">{patientDetails.address}</p>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaUserFriends className="text-blue-600" />
              Emergency Contact
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Name
                </p>
                <p className="text-sm text-gray-900">{patientDetails.emergency_contact_name}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Phone
                </p>
                <p className="text-sm text-gray-900">{patientDetails.emergency_contact_phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Encounters Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Encounters</h2>
          </div>
          {patientDetails.encounters.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 text-lg">No encounters found</p>
            </div>
          ) : (
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
                  {patientDetails.encounters.map((encounter) => (
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
          )}
        </div>
      </div>
    </div>
  );
};
