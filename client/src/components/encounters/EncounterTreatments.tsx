import { Button } from "../ui/Button";
import type { ITreatment } from '@/interfaces/encounters/ITreatment';
import { Loader } from '@/components';
import { FaPills, FaHospital, FaComments } from 'react-icons/fa';

interface IEncounterTreatments {
  treatments: ITreatment[];
  isLoadingTreatments: boolean;
  treatmentsError: Error | null;
  isEncounterConsultationStarted: boolean;
}



export const EncounterTreatments = ({ treatments, isLoadingTreatments, treatmentsError, isEncounterConsultationStarted }: IEncounterTreatments) => {
    
    const getTreatmentIcon = (type: string) => {
        const icons: Record<string, React.ReactNode> = {
          MEDICATION: <FaPills className="text-purple-500" />,
          PROCEDURE: <FaHospital className="text-blue-500" />,
          COUNSELING: <FaComments className="text-green-500" />,
        };
        return icons[type] || null;
      };
      const getTreatmentType = (type: string) => {
        const types: Record<string, string> = {
          MEDICATION: 'Medication',
          PROCEDURE: 'Procedure',
          COUNSELING: 'Counseling',
        };
        return types[type] || null;
      };
  return (
    <div className="space-y-4">
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900">Treatments</h3>
      {
        isEncounterConsultationStarted && (
          <Button
        type="button"
        disabled={false}
        loading={false}
        onClick={() => {}}
        className="bg-purple-600 text-white px-3 sm:px-4 py-2 text-sm sm:text-base rounded-md hover:bg-purple-700 transition-colors font-medium w-full sm:w-auto"
          >
            + Add Treatment
          </Button>
        )
      }
    </div>

        {isLoadingTreatments ? (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <Loader message="Loading treatments..." />
      </div>
    ) : treatmentsError ? (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-red-500 font-medium">
          {treatmentsError instanceof Error ? treatmentsError.message : 'Failed to load treatments'}
        </p>
      </div>
    ) : treatments.length === 0 ? (
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
                    {getTreatmentType(treatment.type)}
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
  );
};