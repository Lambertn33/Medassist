import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { createEncounterTreatment } from '@/api/encounters';
import type { ICreateTreatment } from '@/interfaces/encounters/ITreatment';

interface UseCreateTreatmentOptions {
  encounterId: number;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
  onSuccessCallback?: () => void;
}

export const useCreateTreatment = (options: UseCreateTreatmentOptions) => {
  const queryClient = useQueryClient();
  const { encounterId: encounterIdParam } = useParams();

  const createTreatmentMutation = useMutation({
    mutationFn: (treatment: ICreateTreatment) => 
      createEncounterTreatment(options.encounterId, treatment),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['encounter', options.encounterId, 'treatments'] });
      await queryClient.refetchQueries({ queryKey: ['encounter', options.encounterId, 'treatments'] });
      
      if (encounterIdParam) {
        queryClient.invalidateQueries({ queryKey: ['encounter', encounterIdParam] });
      }
      queryClient.invalidateQueries({ queryKey: ['encounters'] });
      
      const message = data?.message as string || 'Treatment created successfully';
      options.onSuccess?.(message);
      options.onSuccessCallback?.();
    },
    onError: (error) => {
      options.onError?.(error.message);
    },
  });

  return createTreatmentMutation;
};

