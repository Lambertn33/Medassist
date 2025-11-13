import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router';
import type { ICreateTreatment, ITreatment } from '@/interfaces/encounters/ITreatment';
import { Button, Loader, Modal, Input, Select, Toast, Textarea } from '@/components';
import { createEncounterTreatment } from '@/api/encounters';
import { FaPills, FaHospital, FaComments } from 'react-icons/fa';

interface IEncounterTreatments {
  treatments: ITreatment[];
  isLoadingTreatments: boolean;
  treatmentsError: Error | null;
  isEncounterConsultationStarted: boolean;
  encounterId: number;
}

const TREATMENT_TYPES = [
  { value: 'MEDICATION', label: 'Medication' },
  { value: 'PROCEDURE', label: 'Procedure' },
  { value: 'COUNSELING', label: 'Counseling' },
];

export const EncounterTreatments = ({ treatments, isLoadingTreatments, treatmentsError, isEncounterConsultationStarted, encounterId }: IEncounterTreatments) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const queryClient = useQueryClient();
  const { encounterId: encounterIdParam } = useParams();
  
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    dosage: '',
    duration: '',
    notes: '',
  });

  // Create treatment mutation
  const createTreatmentMutation = useMutation({
    mutationFn: (treatment: ICreateTreatment) => 
      createEncounterTreatment(encounterId, treatment),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['encounter', encounterId, 'treatments'] });
      await queryClient.refetchQueries({ queryKey: ['encounter', encounterId, 'treatments'] });
      
      if (encounterIdParam) {
        queryClient.invalidateQueries({ queryKey: ['encounter', encounterIdParam] });
      }
      queryClient.invalidateQueries({ queryKey: ['encounters'] });
      
      const message = data?.message as string || 'Treatment created successfully';
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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ type: '', description: '', dosage: '', duration: '', notes: '' });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, type: e.target.value });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, description: e.target.value });
  };

  const handleDosageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, dosage: e.target.value });
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, duration: e.target.value });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, notes: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTreatmentMutation.mutate({
      type: formData.type as 'MEDICATION' | 'PROCEDURE' | 'COUNSELING',
      description: formData.description,
      dosage: formData.dosage,
      duration: parseInt(formData.duration) || 0,
      notes: formData.notes || ''
    });
  };
    
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
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Treatments</h3>
          {
            isEncounterConsultationStarted && (
              <Button
                type="button"
                disabled={false}
                loading={false}
                onClick={handleOpenModal}
                className="bg-purple-600 cursor-pointer text-white px-3 sm:px-4 py-2 text-sm sm:text-base rounded-md hover:bg-purple-700 transition-colors font-medium w-full sm:w-auto"
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

      {/* Add Treatment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add Treatment"
        modalWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit}>
          <div className="p-4 md:p-5 space-y-4">
            <Select
              name="type"
              id="treatment-type"
              value={formData.type}
              onChange={handleTypeChange}
              disabled={false}
              label="Treatment Type"
              additionalClasses="w-full"
              options={[
                { value: '', label: 'Select treatment type' },
                ...TREATMENT_TYPES,
              ]}
            />

            <Input
              id="treatment-description"
              name="description"
              type="text"
              autoComplete="off"
              required={true}
              value={formData.description}
              onChange={handleDescriptionChange}
              disabled={false}
              placeholder="e.g., Paracetamol 500mg"
              label="Description"
              additionalClasses="w-full"
            />

            <Input
              id="treatment-dosage"
              name="dosage"
              type="text"
              autoComplete="off"
              required={true}
              value={formData.dosage}
              onChange={handleDosageChange}
              disabled={false}
              placeholder={formData.type === 'MEDICATION' ? 'e.g., 2 tablets, 3x daily' : formData.type === 'PROCEDURE' ? 'e.g., 1 hour' : 'e.g., 1 session'}
              label="Dosage"
              additionalClasses="w-full"
            />

            <Input
              id="treatment-duration"
              name="duration"
              type="number"
              autoComplete="off"
              required={true}
              value={formData.duration}
              onChange={handleDurationChange}
              disabled={false}
              placeholder="e.g., 5 (in days)"
              label="Duration (days)"
              additionalClasses="w-full"
            />

            <Textarea
              id="treatment-notes"
              name="notes"
              value={formData.notes}
              onChange={handleNotesChange}
              disabled={false}
              placeholder="Additional notes about the treatment..."
              label="Notes"
            />
          </div>

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
              disabled={!formData.type || !formData.description || !formData.dosage || !formData.duration || createTreatmentMutation.isPending}
              loading={createTreatmentMutation.isPending}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {createTreatmentMutation.isPending ? 'Adding...' : 'Add Treatment'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};