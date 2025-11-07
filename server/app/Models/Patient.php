<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Patient extends Model
{

    const GENDERS = ['MALE', 'FEMALE'];
    protected $fillable = [
        'first_name',
        'last_name',
        'gender',
        'date_of_birth',
        'phone',
        'national_id',
        'address',
        'emergency_contact_name',
        'emergency_contact_phone',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
    ];

    /**
     * Get all of the encouters for the Patient
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function encouters(): HasMany
    {
        return $this->hasMany(Encouter::class);
    }
}
