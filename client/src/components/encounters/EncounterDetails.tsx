import { useState } from 'react';
import { Button } from '@/components';
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

// Temporary interfaces for hardcoded data
interface IObservation {
  id: number;
  type: 'TEMPERATURE' | 'BLOOD_PRESSURE' | 'HEART_RATE' | 'OXYGEN_SATURATION';
  value: string;
  unit: string;
  recorded_at: string;
}

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

export const EncounterDetails = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Hardcoded encounter data
  const encounter = {
    id: 123,
    patient_id: 1,
    user_id: 1,
    status: 'IN_PROGRESS',
    started_at: '2025-01-15T14:30:00',
    ended_at: null,
    summary: '',
    patient: {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      gender: 'Male',
      date_of_birth: '1985-05-20',
    },
    user: {
      id: 1,
      name: 'Dr. Sarah Smith',
      email: 'sarah.smith@medassist.com',
      role: 'doctor',
    },
  };

  // Hardcoded observations
  const observations: IObservation[] = [
    {
      id: 1,
      type: 'TEMPERATURE',
      value: '37.5',
      unit: '°C',
      recorded_at: '2025-01-15T14:45:00',
    },
    {
      id: 2,
      type: 'BLOOD_PRESSURE',
      value: '120/80',
      unit: 'mmHg',
      recorded_at: '2025-01-15T14:46:00',
    },
    {
      id: 3,
      type: 'HEART_RATE',
      value: '72',
      unit: 'bpm',
      recorded_at: '2025-01-15T14:47:00',
    },
    {
      id: 4,
      type: 'OXYGEN_SATURATION',
      value: '98',
      unit: '%',
      recorded_at: '2025-01-15T14:48:00',
    },
  ];

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

  const getObservationIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      TEMPERATURE: <FaThermometerHalf className="text-red-500" />,
      BLOOD_PRESSURE: <FaHeartbeat className="text-red-500" />,
      HEART_RATE: <FaHeart className="text-red-500" />,
      OXYGEN_SATURATION: <FaLungs className="text-blue-500" />,
    };
    return icons[type] || null;
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
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Observations</div>
                <div className="text-2xl font-bold text-blue-600">
                  {observations.length}
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Diagnoses</div>
                <div className="text-2xl font-bold text-green-600">
                  {diagnoses.length}
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Treatments</div>
                <div className="text-2xl font-bold text-purple-600">
                  {treatments.length}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                Latest Vital Signs
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {observations.map((obs) => (
                    <div
                      key={obs.id}
                      className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200"
                    >
                    <div className="text-xl sm:text-2xl mb-2 flex items-center justify-center">
                      {getObservationIcon(obs.type)}
                    </div>
                    <div className="text-xs text-gray-600 mb-1 truncate">
                      {obs.type.replace(/_/g, ' ')}
                    </div>
                    <div className="text-base sm:text-lg font-bold text-gray-900">
                      {obs.value} {obs.unit}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 truncate">
                      {formatDateTime(obs.recorded_at)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {diagnoses.length > 0 && (
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                  Primary Diagnosis
                </h3>
                {diagnoses
                  .filter((d) => d.is_primary)
                  .map((diagnosis) => (
                    <div
                      key={diagnosis.id}
                      className="bg-yellow-50 border-l-4 border-yellow-400 rounded p-4"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <FaStar className="text-yellow-600" />
                        <span className="font-semibold text-gray-900">
                          {diagnosis.label}
                        </span>
                      </div>
                      {diagnosis.code && (
                        <div className="text-sm text-gray-600">
                          ICD-10: {diagnosis.code}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}

            {encounter.summary && (
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                  Summary
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-700">{encounter.summary}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Observations Tab */}
        {activeTab === 'observations' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Vital Signs</h3>
              <Button
                type="button"
                disabled={false}
                loading={false}
                onClick={() => {}}
                className="bg-blue-600 text-white px-3 sm:px-4 py-2 text-sm sm:text-base rounded-md hover:bg-blue-700 transition-colors font-medium w-full sm:w-auto"
              >
                + Add Observation
              </Button>
            </div>

            {observations.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No observations recorded yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {observations.map((obs) => (
                  <div
                    key={obs.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                        <div className="text-2xl sm:text-3xl flex items-center flex-shrink-0">
                          {getObservationIcon(obs.type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-gray-900 text-sm sm:text-base">
                            {obs.type.replace(/_/g, ' ')}
                          </div>
                          <div className="text-xl sm:text-2xl font-bold text-blue-600 mt-1">
                            {obs.value} {obs.unit}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500 mt-1">
                            Recorded: {formatDateTime(obs.recorded_at)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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

