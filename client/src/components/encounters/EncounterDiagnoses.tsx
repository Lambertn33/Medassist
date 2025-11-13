import { useState } from 'react';
import type { IDiagnosis } from '@/interfaces/encounters/IDiagnosis';
import { Button, Loader, Modal, Input, Toast } from '@/components';
import { useToast } from '@/hooks/useToast';
import { useCreateDiagnosis } from '@/hooks/encounters/useCreateDiagnosis';
import { FaStar } from 'react-icons/fa';

interface IEncounterDiagnoses {
  diagnoses: IDiagnosis[];
  isLoadingDiagnoses: boolean;
  diagnosesError: Error | null;
  isEncounterConsultationStarted: boolean;
  encounterId: number;
}

export const EncounterDiagnoses = ({ diagnoses, isLoadingDiagnoses, diagnosesError, isEncounterConsultationStarted, encounterId }: IEncounterDiagnoses) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast, toastMessage, toastType, showSuccessToast, showErrorToast } = useToast();
  
  const [formData, setFormData] = useState({
    label: '',
    code: '',
    is_primary: false,
  });

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ label: '', code: '', is_primary: false });
  };

  const createDiagnosisMutation = useCreateDiagnosis({
    encounterId,
    onSuccess: (message) => showSuccessToast(message),
    onError: (message) => showErrorToast(message),
    onSuccessCallback: handleCloseModal,
  });

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, label: e.target.value });
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, code: e.target.value });
  };

  const handleIsPrimaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, is_primary: e.target.checked });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createDiagnosisMutation.mutate({
      label: formData.label,
      code: formData.code,
      is_primary: formData.is_primary
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
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Diagnoses</h3>
          {
            isEncounterConsultationStarted && (
              <Button
                type="button"
                disabled={false}
                loading={false}
                onClick={handleOpenModal}
                className="bg-green-600 cursor-pointer text-white px-3 sm:px-4 py-2 text-sm sm:text-base rounded-md hover:bg-green-700 transition-colors font-medium w-full sm:w-auto"
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

      {/* Add Diagnosis Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add Diagnosis"
        modalWidth="max-w-md"
      >
        <form onSubmit={handleSubmit}>
          <div className="p-4 md:p-5 space-y-4">
            <Input
              id="diagnosis-label"
              name="label"
              type="text"
              autoComplete="off"
              required={true}
              value={formData.label}
              onChange={handleLabelChange}
              disabled={false}
              placeholder="e.g., Malaria, unspecified"
              label="Diagnosis Label"
              additionalClasses="w-full"
            />

            <Input
              id="diagnosis-code"
              name="code"
              type="text"
              autoComplete="off"
              required={false}
              value={formData.code}
              onChange={handleCodeChange}
              disabled={false}
              placeholder="e.g., B54"
              label="ICD-10 Code"
              additionalClasses="w-full"
            />

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="diagnosis-primary"
                name="is_primary"
                checked={formData.is_primary}
                onChange={handleIsPrimaryChange}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
              />
              <label htmlFor="diagnosis-primary" className="text-sm font-medium text-gray-700 cursor-pointer">
                Set as Primary Diagnosis
              </label>
            </div>
            {formData.is_primary && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-800">
                  <FaStar className="inline mr-1 text-yellow-600" />
                  This will be set as the primary diagnosis. Any existing primary diagnosis will be updated.
                </p>
              </div>
            )}
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
              disabled={!formData.label || createDiagnosisMutation.isPending}
              loading={createDiagnosisMutation.isPending}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {createDiagnosisMutation.isPending ? 'Adding...' : 'Add Diagnosis'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};