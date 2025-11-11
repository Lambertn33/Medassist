<?php

namespace App\Services\common;

use App\Models\Treatment;

class TreatmentsServices
{
    public function getAllTreatments(int $encounterId)
    {
        return Treatment::where('encounter_id', $encounterId)
        ->orderBy('created_at', 'desc')
        ->get(['id', 'encounter_id', 'type', 'description', 'dosage', 'duration', 'notes']);
    }
}