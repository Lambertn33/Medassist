import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { createEncounterDiagnosis } from '@/api/encounters';
import type { ICreateDiagnosis } from '@/interfaces/encounters/IDiagnosis';

interface UseCreateDiagnosisOptions {
  encounterId: number;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
  onSuccessCallback?: () => void;
}

export const useCreateDiagnosis = (options: UseCreateDiagnosisOptions) => {
  const queryClient = useQueryClient();
  const { encounterId: encounterIdParam } = useParams();

  const createDiagnosisMutation = useMutation({
    mutationFn: (diagnosis: ICreateDiagnosis) => 
      createEncounterDiagnosis(options.encounterId, diagnosis),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['encounter', options.encounterId, 'diagnoses'] });
      await queryClient.refetchQueries({ queryKey: ['encounter', options.encounterId, 'diagnoses'] });
      
      if (encounterIdParam) {
        queryClient.invalidateQueries({ queryKey: ['encounter', encounterIdParam] });
      }
      queryClient.invalidateQueries({ queryKey: ['encounters'] });
      
      const message = data?.message as string || 'Diagnosis created successfully';
      options.onSuccess?.(message);
      options.onSuccessCallback?.();
    },
    onError: (error) => {
      options.onError?.(error.message);
    },
  });

  return createDiagnosisMutation;
};

