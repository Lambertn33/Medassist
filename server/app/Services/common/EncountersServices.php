<?php

namespace App\Services\common;
use App\Models\Encounter;

class EncountersServices
{
    public function getAllEncounters(?int $patientId = null, ?string $status = null)
    {
        $query = Encounter::query()
            ->select('id', 'patient_id', 'user_id', 'status', 'started_at', 'ended_at', 'summary')
            ->with('patient', 'user')
            ->orderBy('started_at', 'desc');
        
        if ($patientId) {
            $query->where('patient_id', $patientId);
        }

        if ($status) {
            $query->where('status', $status);
        }

        return $query->get();
    }

    public function storeEncounter(array $fields): Encounter
    {
        return Encounter::create($fields);
    }

    public function getEncounter(int $id): ?Encounter
    {
        return Encounter::with('patient', 'user')
        ->withCount('observations')
        ->withCount('diagnoses')
        ->withCount('treatments')
        ->find($id);
    }

    public function startConsultation(int $id): ?Encounter
    {
        $encounter = $this->getEncounter($id);
        if (! $encounter) {
            return null;
        }
        $encounter->update([
            'status' => Encounter::STATUS_IN_PROGRESS,
            'started_at' => now(),
        ]);
        return $encounter;
    }

    public function endConsultation(int $id, array $fields): ?Encounter
    {
        $encounter = $this->getEncounter($id);
        if (! $encounter) {
            return null;
        }
        $encounter->update([
            'status' => Encounter::STATUS_COMPLETED,
            'ended_at' => now(),
            'summary' => $fields['summary'],
        ]);
        return $encounter;
    }

    public function cancelConsultation(int $id): ?Encounter
    {
        $encounter = $this->getEncounter($id);
        if (! $encounter) {
            return null;
        }
        $encounter->update([
            'status' => Encounter::STATUS_CANCELED,
            'ended_at' => now(),
        ]);
        return $encounter;
    }
}