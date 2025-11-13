import type { IEncounter } from '@/interfaces/encounters/IEncounter';

export const EncounterOverview = ({ encounter }: { encounter: IEncounter }) => {
  return (
    <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="text-sm text-gray-600 mb-1">Observations</div>
        <div className="text-2xl font-bold text-blue-600">
          {encounter.observations_count}
        </div>
      </div>
      <div className="bg-green-50 rounded-lg p-4">
        <div className="text-sm text-gray-600 mb-1">Diagnoses</div>
        <div className="text-2xl font-bold text-green-600">
          {encounter.diagnoses_count}
        </div>
      </div>
      <div className="bg-purple-50 rounded-lg p-4">
        <div className="text-sm text-gray-600 mb-1">Treatments</div>
        <div className="text-2xl font-bold text-purple-600">
          {encounter.treatments_count}
        </div>
      </div>
    </div>

    {encounter.summary && (
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
          Summary
        </h3>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-gray-700">{encounter.summary}</p>
        </div>
      </div>
    )}
  </div>
  );
};