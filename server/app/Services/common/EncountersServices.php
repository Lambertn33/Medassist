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
}