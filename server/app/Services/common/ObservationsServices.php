<?php

namespace App\Services\common;

use App\Models\Observation;
use App\Models\Encounter;

class ObservationsServices
{
    public function getObservationsByEncounter(int $encounterId)
    {
        return Observation::where('encounter_id', $encounterId)
        ->orderBy('recorded_at', 'desc')
        ->get(['id', 'encounter_id', 'type', 'value', 'unit', 'recorded_at']);
    }

    public function storeObservation(array $fields, int $encounterId): Observation
    {
        $fields['encounter_id'] = $encounterId;
        $fields['recorded_at'] = now();
        return Observation::create($fields);
    }
}