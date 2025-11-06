<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Encouter extends Model
{

    const STATUSES = ['INITIALIZED', 'IN_PROGRESS', 'COMPLETED', 'CANCELED'];

    const STATUS_INITIALIZED = self::STATUSES[0];
    const STATUS_IN_PROGRESS = self::STATUSES[1];
    const STATUS_COMPLETED   = self::STATUSES[2];
    const STATUS_CANCELLED   = self::STATUSES[3];

    protected $fillable = [
        'patient_id',
        'user_id',
        'status',
        'started_at',
        'ended_at',
        'summary',
        'is_synced',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at'   => 'datetime',
        'is_synced'  => 'boolean',
    ];

    /**
     * Get the patient that owns the Encouter
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class, 'patient_id');
    }

    /**
     * Get the user that owns the Encouter
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    
    /**
     * Get all of the observations for the Encouter
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function observations(): HasMany
    {
        return $this->hasMany(Observation::class);
    }

    /**
     * Get all of the diagnoses for the Encouter
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function diagnoses(): HasMany
    {
        return $this->hasMany(Diagnosis::class);
    }
    
    /**
     * Get all of the treatments for the Encouter
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function treatments(): HasMany
    {
        return $this->hasMany(Treatment::class);
    }
}
