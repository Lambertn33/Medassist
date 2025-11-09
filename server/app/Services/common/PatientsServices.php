<?php

namespace App\Services\common;

use App\Models\Patient;
use Illuminate\Http\Request;

class PatientsServices
{
    public function getAllPatients(?string $search = null)
    {
        $query = Patient::query()
            ->select('id', 'first_name', 'last_name', 'gender', 'date_of_birth', 'phone', 'national_id', 'address', 'emergency_contact_name', 'emergency_contact_phone');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('national_id', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%")
                  ->orWhere('emergency_contact_name', 'like', "%{$search}%")
                  ->orWhere('emergency_contact_phone', 'like', "%{$search}%");
            });
        }

        return $query->get();
    }

    public function createPatient(array $fields): Patient
    {
        return Patient::create($fields);
    }
}