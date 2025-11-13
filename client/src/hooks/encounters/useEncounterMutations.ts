import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { cancelEncounterConsultation, endEncounterConsultation, startEncounterConsultation } from '@/api/encounters';

interface UseEncounterMutationsOptions {
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

export const useEncounterMutations = (options?: UseEncounterMutationsOptions) => {
  const queryClient = useQueryClient();
  const { encounterId } = useParams();

  const startConsultationMutation = useMutation({
    mutationFn: (id: number) => startEncounterConsultation(id),
    onSuccess: async (data) => {
      // Optimistically update the encounter data immediately
      if (data?.encounter && encounterId) {
        queryClient.setQueryData(['encounter', encounterId], { encounter: data.encounter });
      }
      
      await queryClient.invalidateQueries({ queryKey: ['encounter', encounterId] });
      await queryClient.refetchQueries({ queryKey: ['encounter', encounterId] });
      queryClient.invalidateQueries({ queryKey: ['encounters'] });
      
      const message = data?.message as string || 'Consultation started successfully';
      options?.onSuccess?.(message);
    },
    onError: (error) => {
      options?.onError?.(error.message);
    },
  });

  const cancelConsultationMutation = useMutation({
    mutationFn: (id: number) => cancelEncounterConsultation(id),
    onSuccess: async (data) => {
      // Optimistically update the encounter data immediately
      if (data?.encounter && encounterId) {
        queryClient.setQueryData(['encounter', encounterId], { encounter: data.encounter });
      }
      
      // Invalidate and refetch queries to ensure data consistency
      await queryClient.invalidateQueries({ queryKey: ['encounter', encounterId] });
      await queryClient.refetchQueries({ queryKey: ['encounter', encounterId] });
      await queryClient.invalidateQueries({ queryKey: ['encounters'] });
      
      const message = data?.message as string || 'Consultation canceled successfully';
      options?.onSuccess?.(message);
    },
    onError: (error) => {
      options?.onError?.(error.message);
    },
  });

  const endConsultationMutation = useMutation({
    mutationFn: ({ id, summary }: { id: number; summary: string }) => endEncounterConsultation(id, summary),
    onSuccess: async (data) => {
      // Optimistically update the encounter data immediately
      if (data?.encounter && encounterId) {
        queryClient.setQueryData(['encounter', encounterId], { encounter: data.encounter });
      }
      
      // Invalidate and refetch queries to ensure data consistency
      await queryClient.invalidateQueries({ queryKey: ['encounter', encounterId] });
      await queryClient.refetchQueries({ queryKey: ['encounter', encounterId] });
      queryClient.invalidateQueries({ queryKey: ['encounters'] });
      
      const message = data?.message as string || 'Consultation ended successfully';
      options?.onSuccess?.(message);
    },
    onError: (error) => {
      options?.onError?.(error.message);
    },
  });

  return {
    startConsultationMutation,
    cancelConsultationMutation,
    endConsultationMutation,
  };
};

