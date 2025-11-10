<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Patient;

class PatientsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (Patient::get() as $patient) {
            $patient->delete();
        }

        for ($i = 0; $i < 10; $i++) {
            Patient::create([
                'first_name' => 'Patient ' . $i,
                'last_name' => 'Patient ' . $i,
                'gender' => Patient::GENDERS[rand(0, 1)],
                'date_of_birth' => now()->subYears(rand(18, 60)),
                'phone' => '071234567' . $i,
                'national_id' => '123456789012345' . $i,
                'address' => 'Address ' . $i,
                'emergency_contact_name' => 'Emergency Contact ' . $i,
                'emergency_contact_phone' => '079876543' . $i,
            ]);
        }
    }
}
