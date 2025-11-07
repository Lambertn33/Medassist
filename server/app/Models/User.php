<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    const ROLES = ['ADMIN', 'DOCTOR', 'NURSE'];

    const ADMIN_ROLE = self::ROLES[0];
    const DOCTOR_ROLE = self::ROLES[1];
    const NURSE_ROLE = self::ROLES[2];

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'last_login_at  '
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     * A user (nurse or doctor) can handle many encounters.
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'last_login_at' => 'datetime'
        ];
    }

    /**
     * Get all of the encounters for the User
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function encounters(): HasMany
    {
        return $this->hasMany(Encounter::class);
    }
}
