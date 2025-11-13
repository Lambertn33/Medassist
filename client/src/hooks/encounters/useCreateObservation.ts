import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { createEncounterObsevation } from '@/api/encounters';
import type { ICreateObservation } from '@/interfaces/encounters/IObservation';

interface UseCreateObservationOptions {
  encounterId: number;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
  onSuccessCallback?: () => void;
}

export const useCreateObservation = (options: UseCreateObservationOptions) => {
  const queryClient = useQueryClient();
  const { encounterId: encounterIdParam } = useParams();

  const createObservationMutation = useMutation({
    mutationFn: (observation: ICreateObservation) => 
      createEncounterObsevation(options.encounterId, observation),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['encounter', options.encounterId, 'observations'] });
      await queryClient.refetchQueries({ queryKey: ['encounter', options.encounterId, 'observations'] });
      
      if (encounterIdParam) {
        queryClient.invalidateQueries({ queryKey: ['encounter', encounterIdParam] });
      }
      queryClient.invalidateQueries({ queryKey: ['encounters'] });
      
      const message = data?.message as string || 'Observation created successfully';
      options.onSuccess?.(message);
      options.onSuccessCallback?.();
    },
    onError: (error) => {
      options.onError?.(error.message);
    },
  });

  return createObservationMutation;
};

