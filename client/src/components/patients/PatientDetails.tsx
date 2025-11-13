import { FaStethoscope, FaPlus, FaSpinner } from 'react-icons/fa';
import type { IPatientDetails } from '@/interfaces/patients/IPatient';
import { PatientDetailsInfo, PatientDetailsEncounters, Card, Button } from '@/components';

import { Link } from 'react-router';

interface PatientDetailsProps {
  patientDetails: IPatientDetails;
  onEdit?: () => void;
  onCreateEncounter?: () => void;
  isCreatingEncounter?: boolean;
}

export const PatientDetails = ({ 
  patientDetails, 
  onEdit, 
  onCreateEncounter,
  isCreatingEncounter = false 
}: PatientDetailsProps) => {

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
              {patientDetails.first_name} {patientDetails.last_name}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Patient ID: #{patientDetails.id.toString().padStart(6, '0')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
              <Link 
                to={!isCreatingEncounter ? `/dashboard/patients/${patientDetails.id}` : '#'} 
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium text-center sm:text-left"
              >
                Back
              </Link>
            <Button 
              disabled={isCreatingEncounter}
              type="button"
              loading={isCreatingEncounter}
              onClick={onCreateEncounter}
              className={`px-4 py-2 rounded-md transition-colors font-medium flex items-center justify-center gap-2 ${
                isCreatingEncounter
                  ? 'bg-green-400 text-white cursor-wait'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isCreatingEncounter ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Please wait...
                </>
              ) : (
                <>
                  <FaPlus />
                  Create Encounter
                </>
              )}
            </Button>
            <Button 
              disabled={isCreatingEncounter}
              type="button"
              loading={false}
              onClick={onEdit}
              className={`px-4 py-2 rounded-md transition-colors font-medium ${
                isCreatingEncounter
                  ? 'bg-blue-300 text-white cursor-not-allowed opacity-60'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
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
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Encounters</h2>
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
