import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, Loader } from '@/components';
import { formatDateTime } from '@/utils';
import { 
  FaThermometerHalf, 
  FaHeartbeat, 
  FaHeart, 
  FaLungs,
  FaPills,
  FaHospital,
  FaComments,
  FaStar
} from 'react-icons/fa';
import type { IEncounter } from '@/interfaces/encounters/IEncounter';
import type { IObservation } from '@/interfaces/encounters/IObservation';
import { getEncounterObservations } from '@/api/encounters';

import { EncounterOverview } from './EncounterOverview';
import { EncounterObservations } from './EncounterObservations';

// Temporary interfaces for hardcoded data (will be replaced with API calls)
interface IDiagnosis {
  id: number;
  code: string | null;
  label: string;
  is_primary: boolean;
}

interface ITreatment {
  id: number;
  type: 'MEDICATION' | 'PROCEDURE' | 'COUNSELING';
  description: string;
  dosage?: string;
  duration?: string;
  notes?: string;
}

type TabType = 'overview' | 'observations' | 'diagnoses' | 'treatments';

export const EncounterDetails = ({ encounter }: { encounter: IEncounter }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const { data: observationsData, isLoading: isLoadingObservations, error: observationsError } = useQuery<{ observations: IObservation[] }>({
    queryKey: ['encounter', encounter.id, 'observations'],
    queryFn: () => getEncounterObservations(encounter.id),
    enabled: activeTab === 'observations', // Only fetch when observations tab is active
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
  });

  const observations = observationsData?.observations || [];

  // Hardcoded diagnoses
  const diagnoses: IDiagnosis[] = [
    {
      id: 1,
      code: 'B54',
      label: 'Malaria, unspecified',
      is_primary: true,
    },
    {
      id: 2,
      code: 'D64.9',
      label: 'Anemia, unspecified',
      is_primary: false,
    },
  ];

  // Hardcoded treatments
  const treatments: ITreatment[] = [
    {
      id: 1,
      type: 'MEDICATION',
      description: 'Paracetamol 500mg',
      dosage: '2 tablets, 3x daily',
      duration: '5 days',
      notes: 'Take with food',
    },
    {
      id: 2,
      type: 'PROCEDURE',
      description: 'Blood test',
      notes: 'CBC and malaria test',
    },
    {
      id: 3,
      type: 'COUNSELING',
      description: 'Rest and hydration',
      notes: 'Drink plenty of water, avoid strenuous activities',
    },
  ];

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

  const getTreatmentIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      MEDICATION: <FaPills className="text-purple-500" />,
      PROCEDURE: <FaHospital className="text-blue-500" />,
      COUNSELING: <FaComments className="text-green-500" />,
    };
    return icons[type] || null;
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'observations', label: 'Observations' },
    { id: 'diagnoses', label: 'Diagnoses' },
    { id: 'treatments', label: 'Treatments' },
  ];

  const calculateDuration = () => {
    if (!encounter.started_at) return 'Not started';
    const start = new Date(encounter.started_at);
    const end = encounter.ended_at ? new Date(encounter.ended_at) : new Date();
    const diff = Math.floor((end.getTime() - start.getTime()) / 1000 / 60);
    return `${diff} min`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 break-words">
              Encounter #{encounter.id} - {encounter.patient.first_name}{' '}
              {encounter.patient.last_name}
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="font-medium">Status:</span>
                {getStatusBadge(encounter.status)}
              </div>
              <div className="truncate">
                <span className="font-medium">Provider:</span> {encounter.user.name}
              </div>
              <div>
                <span className="font-medium">Started:</span>{' '}
                {formatDateTime(encounter.started_at)}
              </div>
              <div>
                <span className="font-medium">Duration:</span> {calculateDuration()}
              </div>
            </div>
          </div>
          {encounter.status === 'IN_PROGRESS' && (
            <div className="flex gap-2 sm:flex-shrink-0">
              <Button
                type="button"
                disabled={false}
                loading={false}
                onClick={() => {}}
                className="bg-green-600 text-white px-3 sm:px-4 py-2 text-sm sm:text-base rounded-md hover:bg-green-700 transition-colors font-medium w-full sm:w-auto"
              >
                End Consultation
              </Button>
            </div>
          )}
          {encounter.status === 'INITIALIZED' && (
            <div className="flex gap-2 sm:flex-shrink-0">
              <Button
                type="button"
                disabled={false}
                loading={false}
                onClick={() => {}}
                className="bg-blue-600 text-white px-3 sm:px-4 py-2 text-sm sm:text-base rounded-md hover:bg-blue-700 transition-colors font-medium w-full sm:w-auto"
              >
                Start Consultation
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="flex -mb-px min-w-max sm:min-w-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-4 sm:p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <EncounterOverview encounter={encounter} />
        )}

        {/* Observations Tab */}
        {activeTab === 'observations' && (
          <EncounterObservations
           observations={observations}
           isLoadingObservations={isLoadingObservations}
           observationsError={observationsError as Error | null}
          />
        )}

        {/* Diagnoses Tab */}
        {activeTab === 'diagnoses' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Diagnoses</h3>
              <Button
                type="button"
                disabled={false}
                loading={false}
                onClick={() => {}}
                className="bg-green-600 text-white px-3 sm:px-4 py-2 text-sm sm:text-base rounded-md hover:bg-green-700 transition-colors font-medium w-full sm:w-auto"
              >
                + Add Diagnosis
              </Button>
            </div>

            {diagnoses.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No diagnoses recorded yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {diagnoses.map((diagnosis) => (
                  <div
                    key={diagnosis.id}
                    className={`bg-white border rounded-lg p-4 ${
                      diagnosis.is_primary
                        ? 'border-yellow-400 bg-yellow-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {diagnosis.is_primary && (
                          <div className="flex items-center gap-2 mb-2">
                            <FaStar className="text-yellow-600" />
                            <span className="text-xs font-semibold text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
                              PRIMARY DIAGNOSIS
                            </span>
                          </div>
                        )}
                        <div className="font-semibold text-gray-900 text-base sm:text-lg mb-1 break-words">
                          {diagnosis.label}
                        </div>
                        {diagnosis.code && (
                          <div className="text-sm text-gray-600">
                            ICD-10 Code: <span className="font-mono">{diagnosis.code}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Treatments Tab */}
        {activeTab === 'treatments' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Treatments</h3>
              <Button
                type="button"
                disabled={false}
                loading={false}
                onClick={() => {}}
                className="bg-purple-600 text-white px-3 sm:px-4 py-2 text-sm sm:text-base rounded-md hover:bg-purple-700 transition-colors font-medium w-full sm:w-auto"
              >
                + Add Treatment
              </Button>
            </div>

            {treatments.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No treatments prescribed yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {treatments.map((treatment) => (
                  <div
                    key={treatment.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="text-2xl sm:text-3xl flex items-center flex-shrink-0">
                        {getTreatmentIcon(treatment.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-semibold text-purple-700 bg-purple-100 px-2 py-1 rounded">
                            {treatment.type}
                          </span>
                        </div>
                        <div className="font-semibold text-gray-900 text-base sm:text-lg mb-2 break-words">
                          {treatment.description}
                        </div>
                        {treatment.dosage && (
                          <div className="text-sm text-gray-700 mb-1">
                            <span className="font-medium">Dosage:</span> {treatment.dosage}
                          </div>
                        )}
                        {treatment.duration && (
                          <div className="text-sm text-gray-700 mb-1">
                            <span className="font-medium">Duration:</span>{' '}
                            {treatment.duration}
                          </div>
                        )}
                        {treatment.notes && (
                          <div className="text-sm text-gray-600 mt-2 pt-2 border-t border-gray-200">
                            <span className="font-medium">Notes:</span> {treatment.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

