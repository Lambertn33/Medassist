import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router';
import type { ICreateObservation, IObservation } from '@/interfaces/encounters/IObservation';
import { formatDateTime } from '@/utils';
import { Button, Loader, Modal, Input, Select, Toast } from '@/components';
import { createEncounterObsevation } from '@/api/encounters';
import { FaHeart, FaHeartbeat, FaLungs, FaQuestion, FaThermometerHalf } from 'react-icons/fa';

interface IEncounterObservations {
  observations: IObservation[];
  isLoadingObservations: boolean;
  observationsError: Error | null;
  isEncounterConsultationStarted: boolean;
  encounterId: number;
}

const OBSERVATION_TYPES = [
  { value: 'TEMPERATURE', label: 'Temperature' },
  { value: 'BLOOD_PRESSURE', label: 'Blood Pressure' },
  { value: 'HEART_RATE', label: 'Heart Rate' },
  { value: 'OXYGEN_SATURATION', label: 'Oxygen Saturation' },
];

const getUnitForType = (type: string): string => {
  switch (type) {
    case 'TEMPERATURE':
      return '°C';
    case 'BLOOD_PRESSURE':
      return 'mmHg';
    case 'HEART_RATE':
      return 'bpm';
    case 'OXYGEN_SATURATION':
      return '%';
    default:
      return '';
  }
};

export const EncounterObservations = ({ observations, isLoadingObservations, observationsError, isEncounterConsultationStarted, encounterId }: IEncounterObservations) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const queryClient = useQueryClient();
  const { encounterId: encounterIdParam } = useParams();
  
  const [formData, setFormData] = useState({
    type: '',
    value: '',
    unit: '',
  });

  // Create observation mutation
  const createObservationMutation = useMutation({
    mutationFn: (observation: ICreateObservation) => 
      createEncounterObsevation(encounterId, observation),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['encounter', encounterId, 'observations'] });
      await queryClient.refetchQueries({ queryKey: ['encounter', encounterId, 'observations'] });
      
      if (encounterIdParam) {
        queryClient.invalidateQueries({ queryKey: ['encounter', encounterIdParam] });
      }
      queryClient.invalidateQueries({ queryKey: ['encounters'] });
      
      const message = data?.message as string || 'Observation created successfully';
      setToastMessage(message);
      setToastType('success');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
      
      handleCloseModal();
    },
    onError: (error) => {
      setToastMessage(error.message);
      setToastType('error');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    },
  });

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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ type: '', value: '', unit: '' });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = e.target.value;
    setFormData({ 
      ...formData, 
      type: selectedType,
      unit: getUnitForType(selectedType)
    });
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, value: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createObservationMutation.mutate({
      type: formData.type as 'TEMPERATURE' | 'BLOOD_PRESSURE' | 'HEART_RATE' | 'OXYGEN_SATURATION',
      value: formData.value,
      unit: formData.unit
    });
  };

  return (
    <>
      {showToast && (
        <div className="fixed top-20 right-4 z-50 transition-all duration-300 ease-in-out">
          <Toast
            message={toastMessage}
            type={toastType}
          />
        </div>
      )}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Vital Signs</h3>
          {
            isEncounterConsultationStarted && (
              <Button
                type="button"
                disabled={false}
                loading={false}
                onClick={handleOpenModal}
                className="bg-blue-600 cursor-pointer text-white px-3 sm:px-4 py-2 text-sm sm:text-base rounded-md hover:bg-blue-700 transition-colors font-medium w-full sm:w-auto"
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

      {/* Add Observation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add Observation"
        modalWidth="max-w-md"
      >
        <form onSubmit={handleSubmit}>
          <div className="p-4 md:p-5 space-y-4">
            {/* Observation Type */}
            <Select
              name="type"
              id="observation-type"
              value={formData.type}
              onChange={handleTypeChange}
              disabled={false}
              label="Observation Type"
              additionalClasses="w-full"
              options={[
                { value: '', label: 'Select observation type' },
                ...OBSERVATION_TYPES,
              ]}
            />

            {/* Value Input */}
            <Input
              id="observation-value"
              name="value"
              type="text"
              autoComplete="off"
              required={true}
              value={formData.value}
              onChange={handleValueChange}
              disabled={false}
              placeholder={formData.type === 'BLOOD_PRESSURE' ? 'e.g., 120/80' : formData.type ? `Enter value` : 'Select type first'}
              label="Value"
              additionalClasses="w-full"
            />

            {/* Unit Display (Read-only) */}
            {formData.type && (
             <Input
                id="observation-unit"
                name="unit"
                type="text"
                autoComplete="off"
                required={true}
                value={getUnitForType(formData.type)}
                onChange={() => {}}
                disabled={false}
                placeholder={getUnitForType(formData.type)}
                label="Unit"
                additionalClasses="w-full"
                readOnly={true}
              />
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 p-4 md:p-5 border-t border-gray-200 rounded-b">
            <Button
              type="button"
              onClick={handleCloseModal}
              disabled={false}
              loading={false}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.type || !formData.value || createObservationMutation.isPending}
              loading={createObservationMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {createObservationMutation.isPending ? 'Adding...' : 'Add Observation'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};