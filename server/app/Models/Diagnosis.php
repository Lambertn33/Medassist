<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Diagnosis extends Model
{
    protected $fillable = [
        'encounter_id',
        'code',
        'label',
        'is_primary',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
    ];

    /**
     * Get the encounter that owns the Diagnosis
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function encounter(): BelongsTo
    {
        return $this->belongsTo(Encounter::class);
    }
}
