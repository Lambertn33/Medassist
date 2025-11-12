<?php

namespace App\Services\common;

use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PatientsServices
{
    public function getAllPatients(?string $search = null)
    {
        $query = Patient::query()
            ->select('id', 'first_name', 'last_name', 'gender', 'date_of_birth');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%");
            });
        }

        return $query->withCount('encounters')->get();
    }

    public function createPatient(array $fields): Patient
    {
        return Patient::create($fields);
    }

    public function viewPatient(int $id): ?Patient
    {
        return Patient::with('encounters')->find($id);
    }

    public function updatePatient(Patient $patient, array $fields): ?Patient
    {
         $patient->update($fields);
         return $patient;
    }

    public function deletePatient(Patient $patient): bool
    {
        return DB::transaction(function () use ($patient) {
            $encounterIds = $patient->encounters()->pluck('id');
            
            if ($encounterIds->isNotEmpty()) {
                DB::table('observations')->whereIn('encounter_id', $encounterIds)->delete();
                
                DB::table('diagnoses')->whereIn('encounter_id', $encounterIds)->delete();
                
                DB::table('treatments')->whereIn('encounter_id', $encounterIds)->delete();
            }

            $patient->encounters()->delete();
            
            return $patient->delete();
        });
    }
}