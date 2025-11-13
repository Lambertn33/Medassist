import type { IObservation } from '@/interfaces/encounters/IObservation';
import { formatDateTime } from '@/utils';
import { Button, Loader } from '@/components';
import { FaHeart, FaHeartbeat, FaLungs, FaQuestion, FaThermometerHalf } from 'react-icons/fa';

interface IEncounterObservations {
  observations: IObservation[];
  isLoadingObservations: boolean;
  observationsError: Error | null;
  isEncounterConsultationStarted: boolean;
}

export const EncounterObservations = ({ observations, isLoadingObservations, observationsError, isEncounterConsultationStarted }: IEncounterObservations) => {
  const getObservationIcon = (type: string) => {
    switch (type) {
      case 'TEMPERATURE':
        return <FaThermometerHalf />;
      case 'BLOOD_PRESSURE':
        return <FaHeartbeat />;
      case 'HEART_RATE':
        return <FaHeart />;
      case 'OXYGEN_SATURATION':
        return <FaLungs />;
      default:
        return <FaQuestion />;
    }
  };
  return (
    <div className="space-y-4">
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900">Vital Signs</h3>
      {
        isEncounterConsultationStarted && (
          <Button
            type="button"
            disabled={false}
            loading={false}
            onClick={() => {}}
            className="bg-blue-600 text-white px-3 sm:px-4 py-2 text-sm sm:text-base rounded-md hover:bg-blue-700 transition-colors font-medium w-full sm:w-auto"
          >
            + Add Observation
          </Button>
        )
      }
    </div>

    {isLoadingObservations ? (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <Loader message="Loading observations..." />
      </div>
    ) : observationsError ? (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-red-500 font-medium">
          {observationsError instanceof Error ? observationsError.message : 'Failed to load observations'}
        </p>
      </div>
    ) : observations.length === 0 ? (
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
  );
};