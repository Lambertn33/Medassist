<?php

namespace App\Services\common;

use App\Models\Treatment;
use App\Models\Encounter;

class TreatmentsServices
{
    public function getAllTreatments(int $encounterId)
    {
        return Treatment::where('encounter_id', $encounterId)
        ->orderBy('created_at', 'desc')
        ->get(['id', 'encounter_id', 'type', 'description', 'dosage', 'duration', 'notes']);
    }

    public function storeTreatment(array $fields, int $encounterId): Treatment
    {
        $fields['encounter_id'] = $encounterId;
        return Treatment::create($fields);
    }

    public function canTreatmentBeCreated(int $encounterId): bool
    {
        $encounter = Encounter::find($encounterId);
        if (! $encounter) {
            return false;
        }
        if ($encounter->status !== Encounter::STATUS_IN_PROGRESS) {
            return false;
        }
        if ($encounter->observations()->count() === 0) {
            return false;
        }
        if ($encounter->diagnoses()->count() === 0) {
            return false;
        }
        return true;
    }
}