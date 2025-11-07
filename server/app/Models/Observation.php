<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Observation extends Model
{
    const TYPES = ['TEMPERATURE', 'BLOOD_PRESSURE', 'HEART_RATE', 'OXYGEN_SATURATION'];

    const TEMPERATURE_TYPE = self::TYPES[0];
    const BLOOD_PRESSURE_TYPE = self::TYPES[1];
    const HEART_RATE_TYPE = self::TYPES[2];
    const OXYGEN_SATURATION_TYPE = self::TYPES[3];

    protected $fillable = [
        'encounter_id',
        'type',
        'value',
        'unit',
        'recorded_at',
    ];

    protected $casts = [
        'recorded_at' => 'datetime',
    ];

    /**
     * Get the encounter that owns the Observation
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function encounter(): BelongsTo
    {
        return $this->belongsTo(Encounter::class);
    }
}
