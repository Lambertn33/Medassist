import type { IDiagnosis } from '@/interfaces/encounters/IDiagnosis';
import { Button, Loader } from '@/components';
import { FaStar } from 'react-icons/fa';

interface IEncounterDiagnoses {
  diagnoses: IDiagnosis[];
  isLoadingDiagnoses: boolean;
  diagnosesError: Error | null;
  isEncounterConsultationStarted: boolean;
}

export const EncounterDiagnoses = ({ diagnoses, isLoadingDiagnoses, diagnosesError, isEncounterConsultationStarted }: IEncounterDiagnoses) => {
  return (
    <div className="space-y-4">
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900">Diagnoses</h3>
      {
        isEncounterConsultationStarted && (
          <Button
            type="button"
            disabled={false}
            loading={false}
            onClick={() => {}}
            className="bg-green-600 text-white px-3 sm:px-4 py-2 text-sm sm:text-base rounded-md hover:bg-green-700 transition-colors font-medium w-full sm:w-auto"
          >
            + Add Diagnosis
          </Button>
        )
      }
    </div>

    {isLoadingDiagnoses ? (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <Loader message="Loading diagnoses..." />
      </div>
    ) : diagnosesError ? (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-red-500 font-medium">
          {diagnosesError instanceof Error ? diagnosesError.message : 'Failed to load diagnoses'}
        </p>
      </div>
    ) : diagnoses.length === 0 ? (
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
  );
};