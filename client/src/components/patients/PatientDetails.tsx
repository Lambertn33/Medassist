import { FaStethoscope } from 'react-icons/fa';
import type { IPatientDetails } from '@/interfaces/patients/IPatient';
import { PatientDetailsInfo, PatientDetailsEncounters, Card, Button } from '@/components';

import { Link } from 'react-router';

interface PatientDetailsProps {
  patientDetails: IPatientDetails;
  onEdit?: () => void;
}

export const PatientDetails = ({ patientDetails, onEdit }: PatientDetailsProps) => {

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
            <Link to="/dashboard/patients" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium">
              Back
            </Link>
            <Button 
              disabled={false}
              type="button"
              loading={false}
              onClick={onEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Edit
            </Button>
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
        <PatientDetailsInfo patientDetails={patientDetails} />  

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
            <PatientDetailsEncounters encounters={patientDetails.encounters} />
          )}
        </div>
      </div>
    </div>
  );
};
