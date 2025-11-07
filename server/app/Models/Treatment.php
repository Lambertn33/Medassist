<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Treatment extends Model
{
    const TYPES = ['MEDICATION', 'PROCEDURE', 'COUNSELING'];

    const MEDICATION_TYPE = self::TYPES[0];
    const PROCEDURE_TYPE = self::TYPES[1];
    const COUNSELING_TYPE = self::TYPES[2];
    
    protected $fillable = [
        'encounter_id',
        'type',
        'description',
        'dosage',
        'duration',
        'notes',
    ];

    /**
     * Get the encounter that owns the Treatment
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function encounter(): BelongsTo
    {
        return $this->belongsTo(Encounter::class);
    }
}
