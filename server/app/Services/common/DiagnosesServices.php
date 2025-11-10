<?php

namespace App\Services\common;

use App\Models\Diagnosis;
class DiagnosesServices
{
    public function getAllDiagnoses(int $encounterId)
    {
        return Diagnosis::where('encounter_id', $encounterId)
        ->orderBy('is_primary', 'desc')
        ->get(['id', 'encounter_id', 'code', 'label', 'is_primary']);
    }

    public function storeDiagnosis(array $fields, int $encounterId): Diagnosis
    {
        $fields['encounter_id'] = $encounterId;
        return Diagnosis::create($fields);
    }
}