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
        
        // If the new diagnosis is primary, update any existing primary diagnosis to non-primary
        $isPrimary = filter_var($fields['is_primary'] ?? false, FILTER_VALIDATE_BOOLEAN);
        if ($isPrimary) {
            Diagnosis::where('encounter_id', $encounterId)
                ->where('is_primary', true)
                ->update(['is_primary' => false]);
        }
        
        return Diagnosis::create($fields);
    }
}