import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from 'react-router';
import { Button, Toast } from '@/components';
import { formatDateTime } from '@/utils';

import type { IEncounter } from '@/interfaces/encounters/IEncounter';
import type { IObservation } from '@/interfaces/encounters/IObservation';
import type { IDiagnosis } from '@/interfaces/encounters/IDiagnosis';
import type { ITreatment } from '@/interfaces/encounters/ITreatment';

import { cancelEncounterConsultation, getEncounterDiagnoses, getEncounterObservations, getEncounterTreatments, startEncounterConsultation } from '@/api/encounters';

import { EncounterOverview } from './EncounterOverview';
import { EncounterObservations } from './EncounterObservations';
import { EncounterDiagnoses } from './EncounterDiagnoses';
import { EncounterTreatments } from './EncounterTreatments';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

type TabType = 'overview' | 'observations' | 'diagnoses' | 'treatments';

export const EncounterDetails = ({ encounter }: { encounter: IEncounter }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const queryClient = useQueryClient();
  const { encounterId } = useParams();
  
  const { data: observationsData, isLoading: isLoadingObservations, error: observationsError } = useQuery<{ observations: IObservation[] }>({
    queryKey: ['encounter', encounter.id, 'observations'],
    queryFn: () => getEncounterObservations(encounter.id),
    enabled: activeTab === 'observations',
    staleTime: 30 * 1000,
  });

  const { data: diagnosesData, isLoading: isLoadingDiagnoses, error: diagnosesError } = useQuery<{ diagnoses: IDiagnosis[] }>({
    queryKey: ['encounter', encounter.id, 'diagnoses'],
    queryFn: () => getEncounterDiagnoses(encounter.id),
    enabled: activeTab === 'diagnoses',
    staleTime: 30 * 1000,
  });

  const { data: treatmentsData, isLoading: isLoadingTreatments, error: treatmentsError } = useQuery<{ treatments: ITreatment[] }>({
    queryKey: ['encounter', encounter.id, 'treatments'],
    queryFn: () => getEncounterTreatments(encounter.id),
    enabled: activeTab === 'treatments',
    staleTime: 30 * 1000,
  });


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
      setToastMessage(message);
      setToastType('success');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
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
      setToastMessage(message);
      setToastType('success');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
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

  const handleStartConsultation = () => {
    startConsultationMutation.mutate(encounter.id);
  }; 
  const handleCancelConsultation = () => {
    cancelConsultationMutation.mutate(encounter.id);
  };

  const observations = observationsData?.observations || [];
  const diagnoses = diagnosesData?.diagnoses || [];
  const treatments = treatmentsData?.treatments || [];

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      INITIALIZED: 'bg-gray-100 text-gray-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELED: 'bg-red-100 text-red-800',
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          statusColors[status] || 'bg-gray-100 text-gray-800'
        }`}
      >
        {status.replace(/_/g, ' ')}
      </span>
    );
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'observations', label: 'Observations' },
    { id: 'diagnoses', label: 'Diagnoses' },
    { id: 'treatments', label: 'Treatments' },
  ];

  const calculateDuration = () => {
    if (!encounter.started_at) return 'Not started';
    const start = new Date(encounter.started_at);
    const end = encounter.ended_at ? new Date(encounter.ended_at) : new Date();
    const diff = Math.floor((end.getTime() - start.getTime()) / 1000 / 60);
    return `${diff} min`;
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
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 break-words">
              Encounter #{encounter.id} - <Link to={`/dashboard/patients/${encounter.patient.id}`} className="text-blue-600 hover:text-blue-700 transition-colors">{encounter.patient.first_name} {encounter.patient.last_name}</Link>
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="font-medium">Status:</span>
                {getStatusBadge(encounter.status)}
              </div>
              <div className="truncate">
                <span className="font-medium">Provider:</span> {encounter.user.name}
              </div>
              <div>
                <span className="font-medium">Started:</span>{' '}
                {formatDateTime(encounter.started_at)}
              </div>
              <div>
                <span className="font-medium">Duration:</span> {calculateDuration()}
              </div>
            </div>
          </div>
          {encounter.status === 'INITIALIZED' && (
            <div className="flex gap-2 sm:flex-shrink-0">
              <Button
                type="button"
                disabled={startConsultationMutation.isPending}
                loading={startConsultationMutation.isPending}
                onClick={handleStartConsultation}
                className="bg-blue-600 text-white px-3 sm:px-4 py-2 text-sm sm:text-base rounded-md hover:bg-blue-700 transition-colors font-medium w-full sm:w-auto"
              >
                {startConsultationMutation.isPending ? 'Starting...' : 'Start Consultation'}
              </Button>
            </div>
          )}
          {encounter.status === 'IN_PROGRESS' && (
            <div className="flex gap-2 sm:flex-shrink-0">
              <Button
                type="button"
                disabled={false}
                loading={false}
                onClick={() => {}}
                className="bg-green-600 disabled:bg-green-400 disabled:cursor-not-allowed text-white px-3 sm:px-4 py-2 text-sm sm:text-base rounded-md hover:bg-green-700 transition-colors font-medium w-full sm:w-auto"
              >
                End Consultation
              </Button>
              <Button
                type="button"
                disabled={cancelConsultationMutation.isPending}
                loading={cancelConsultationMutation.isPending}
                onClick={handleCancelConsultation}
                className="bg-red-600 text-white px-3 sm:px-4 py-2 text-sm sm:text-base rounded-md hover:bg-red-700 transition-colors font-medium w-full sm:w-auto"
              >
                Cancel Consultation
              </Button>
            </div>
          )}
          {encounter.status === 'COMPLETED' && (
           <div className="flex gap-2 sm:flex-shrink-0">
            <span className="text-green-600 text-sm sm:text-base">Consultation completed</span>
            <FaCheckCircle className="text-green-600 text-sm sm:text-base" />
           </div>
          )}
          {encounter.status === 'CANCELED' && (
            <div className="flex gap-2 sm:flex-shrink-0 items-center">
              <span className="text-red-600 text-sm sm:text-base font-bold">Consultation canceled</span>
              <FaTimesCircle className="text-red-600 text-sm sm:text-base ml-2" />
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="flex -mb-px min-w-max sm:min-w-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent cursor-pointer text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-4 sm:p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <EncounterOverview encounter={encounter} />
        )}

        {/* Observations Tab */}
        {activeTab === 'observations' && (
          <EncounterObservations
           observations={observations}
           isLoadingObservations={isLoadingObservations}
           observationsError={observationsError as Error | null}
           isEncounterConsultationStarted={encounter.status === 'IN_PROGRESS'}
           encounterId={encounter.id}
          />
        )}

        {/* Diagnoses Tab */}
        {activeTab === 'diagnoses' && (
          <EncounterDiagnoses
           diagnoses={diagnoses}
           isLoadingDiagnoses={isLoadingDiagnoses}
           diagnosesError={diagnosesError as Error | null}
           isEncounterConsultationStarted={encounter.status === 'IN_PROGRESS'}
          />
        )}

        {/* Treatments Tab */}
        {activeTab === 'treatments' && (
          <EncounterTreatments
           treatments={treatments}
           isLoadingTreatments={isLoadingTreatments}
           treatmentsError={treatmentsError as Error | null}
           isEncounterConsultationStarted={encounter.status === 'IN_PROGRESS'}
          />
        )}
      </div>
    </div>
    </>
  );
};

