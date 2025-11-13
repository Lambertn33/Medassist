<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Patient;
use App\Models\Encounter;
use App\Models\Observation;
use App\Models\Diagnosis;
use App\Models\Treatment;
use App\Models\User;

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

        // Get a user (doctor) for encounters
        $user = User::where('role', User::DOCTOR_ROLE)->first() 
            ?? User::first();

        if (!$user) {
            throw new \Exception('No user found. Please run UsersSeeder first.');
        }

        for ($i = 0; $i < 5; $i++) {
            $patient = Patient::create([
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

            // Create IN_PROGRESS encounter
            $inProgressEncounter = Encounter::create([
                'patient_id' => $patient->id,
                'user_id' => $user->id,
                'status' => Encounter::STATUS_IN_PROGRESS,
                'started_at' => now()->subDays(rand(1, 7)),
                'ended_at' => null,
                'summary' => 'Ongoing consultation for patient ' . $i,
            ]);

            // Create observations for IN_PROGRESS encounter (not INITIALIZED)
            $observationType = Observation::TYPES[rand(0, count(Observation::TYPES) - 1)];
            $observationData = [
                'encounter_id' => $inProgressEncounter->id,
                'type' => $observationType,
                'recorded_at' => $inProgressEncounter->started_at,
            ];

            // Set value and unit based on observation type
            switch ($observationType) {
                case Observation::TEMPERATURE_TYPE:
                    $observationData['value'] = (string) rand(360, 380) / 10; // 36.0 to 38.0
                    $observationData['unit'] = '°C';
                    break;
                case Observation::BLOOD_PRESSURE_TYPE:
                    $observationData['value'] = rand(110, 140) . '/' . rand(70, 90);
                    $observationData['unit'] = 'mmHg';
                    break;
                case Observation::HEART_RATE_TYPE:
                    $observationData['value'] = (string) rand(60, 100);
                    $observationData['unit'] = 'bpm';
                    break;
                case Observation::OXYGEN_SATURATION_TYPE:
                    $observationData['value'] = (string) rand(95, 100);
                    $observationData['unit'] = '%';
                    break;
            }

            Observation::create($observationData);

            // Create diagnosis for IN_PROGRESS encounter (not INITIALIZED)
            Diagnosis::create([
                'encounter_id' => $inProgressEncounter->id,
                'code' => 'ICD-' . rand(10, 99) . '.' . rand(10, 99),
                'label' => 'Diagnosis for Patient ' . $i,
                'is_primary' => true,
            ]);

            // Create treatment for IN_PROGRESS encounter (not INITIALIZED)
            $treatmentType = Treatment::TYPES[rand(0, count(Treatment::TYPES) - 1)];
            Treatment::create([
                'encounter_id' => $inProgressEncounter->id,
                'type' => $treatmentType,
                'description' => 'Treatment description for Patient ' . $i,
                'dosage' => $treatmentType === Treatment::MEDICATION_TYPE ? '500mg' : ($treatmentType === Treatment::PROCEDURE_TYPE ? '1 hour' : '1 session'),
                'duration' => rand(1, 14),
                'notes' => 'Treatment notes for Patient ' . $i,
            ]);

            // Create INITIALIZED encounter (without observations, diagnoses, or treatments)
            Encounter::create([
                'patient_id' => $patient->id,
                'user_id' => $user->id,
                'status' => Encounter::STATUS_INITIALIZED,
                'started_at' => now()->subDays(rand(8, 30)),
                'ended_at' => null,
                'summary' => 'Initial consultation for patient ' . $i,
            ]);
        }
    }
}
