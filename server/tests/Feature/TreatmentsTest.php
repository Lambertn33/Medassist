<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use Laravel\Sanctum\Sanctum;
use App\Models\Treatment;
use App\Models\Encounter;
use App\Models\Patient;
use App\Models\Observation;
use App\Models\Diagnosis;

class TreatmentsTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsAdmin(): User
    {
        $admin = User::factory()->create([
            'role' => User::ADMIN_ROLE,
        ]);
        Sanctum::actingAs($admin);
        return $admin;
    }

    private function actingAsNurse(): User
    {
        $nurse = User::factory()->create([
            'role' => User::NURSE_ROLE,
        ]);
        Sanctum::actingAs($nurse);
        return $nurse;
    }

    private function actingAsDoctor(): User
    {
        $doctor = User::factory()->create([
            'role' => User::DOCTOR_ROLE,
        ]);
        Sanctum::actingAs($doctor);
        return $doctor;
    }

    public function test_any_authenticated_user_can_get_treatments()
    {
        $admin = $this->actingAsAdmin();
        $nurse = $this->actingAsNurse();
        $doctor = $this->actingAsDoctor();

        $patient = Patient::create([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'gender' => Patient::GENDERS[0],
            'date_of_birth' => '1990-01-15',
            'phone' => '0712345678',
            'national_id' => '1234567890123456',
            'address' => '123 Main St',
            'emergency_contact_name' => 'Jane Doe',
            'emergency_contact_phone' => '0798765432',
        ]);
        
        $encounter = Encounter::create([
            'patient_id' => $patient->id,
            'user_id' => $admin->id,
        ]);

        $this->actingAsAdmin();
        $adminResponse = $this->get('/api/common/encounters/' . $encounter->id . '/treatments');
        $adminResponse->assertStatus(200);

        $this->actingAsNurse();
        $nurseResponse = $this->get('/api/common/encounters/' . $encounter->id . '/treatments');
        $nurseResponse->assertStatus(200);

        $this->actingAsDoctor();
        $doctorResponse = $this->get('/api/common/encounters/' . $encounter->id . '/treatments');
        $doctorResponse->assertStatus(200);
    }

    public function test_any_authenticated_user_can_create_a_treatment()
    {
        $admin = $this->actingAsAdmin();
        $nurse = $this->actingAsNurse();
        $doctor = $this->actingAsDoctor();

        $patient = Patient::create([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'gender' => Patient::GENDERS[0],
            'date_of_birth' => '1990-01-15',
            'phone' => '0712345678',
            'national_id' => '1234567890123456',
            'address' => '123 Main St',
            'emergency_contact_name' => 'Jane Doe',
            'emergency_contact_phone' => '0798765432',
        ]);
        
        $encounter = Encounter::create([
            'patient_id' => $patient->id,
            'user_id' => $admin->id,
        ]);
        
        $startEncounterResponse = $this->putJson('/api/common/encounters/' . $encounter->id . '/start-consultation');
        $startEncounterResponse->assertStatus(200);
        $startEncounterResponse->assertJsonStructure([
            'message',
            'encounter',
        ]);

        $createObservationResponse = $this->postJson('/api/common/encounters/' . $encounter->id . '/observations', [
            'description' => 'Test Observation',
            'type' => Observation::TEMPERATURE_TYPE,
            'value' => '37.5',
            'unit' => '°C',
            'recorded_at' => now(),
        ]);

        $createDiagnosisResponse = $this->postJson('/api/common/encounters/' . $encounter->id . '/diagnoses', [
            'code' => '1234567890',
            'label' => 'Test Diagnosis',
            'is_primary' => true,
        ]);
        $createDiagnosisResponse->assertStatus(201);
        $createDiagnosisResponse->assertJsonStructure([
            'message',
            'diagnosis',
        ]);

        $this->actingAsAdmin();
        $adminResponse = $this->postJson('/api/common/encounters/' . $encounter->id . '/treatments', [
            'type' => Treatment::TYPES[0],
            'description' => 'Test Treatment',
            'dosage' => '100mg',
            'duration' => 10,
            'notes' => 'Test Notes',
        ]);
        $adminResponse->assertStatus(201);
        $adminResponse->assertJsonStructure([
            'message',
            'treatment',
        ]);

        $this->actingAsNurse();
        $nurseResponse = $this->postJson('/api/common/encounters/' . $encounter->id . '/treatments', [
            'type' => Treatment::TYPES[0],
            'description' => 'Test Treatment',
            'dosage' => '100mg',
            'duration' => 10,
            'notes' => 'Test Notes',
        ]);
        $nurseResponse->assertStatus(201);
        $nurseResponse->assertJsonStructure([
            'message',
            'treatment',
        ]);

        $this->actingAsDoctor();
        $doctorResponse = $this->postJson('/api/common/encounters/' . $encounter->id . '/treatments', [
            'type' => Treatment::TYPES[0],
            'description' => 'Test Treatment',
            'dosage' => '100mg',
            'duration' => 10,
            'notes' => 'Test Notes',
        ]);
        $doctorResponse->assertStatus(201);
        $doctorResponse->assertJsonStructure([
            'message',
            'treatment',
        ]);
    }

    public function test_cannot_create_a_treatment_if_the_encounter_is_not_in_progress()
    {
        $admin = $this->actingAsAdmin();
        $nurse = $this->actingAsNurse();
        $doctor = $this->actingAsDoctor();

        $patient = Patient::create([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'gender' => Patient::GENDERS[0],
            'date_of_birth' => '1990-01-15',
            'phone' => '0712345678',
            'national_id' => '1234567890123456',
            'address' => '123 Main St',
            'emergency_contact_name' => 'Jane Doe',
            'emergency_contact_phone' => '0798765432',
        ]);
        
        $encounter = Encounter::create([
            'patient_id' => $patient->id,
            'user_id' => $admin->id,
        ]);
        
        $createTreatmentResponse = $this->postJson('/api/common/encounters/' . $encounter->id . '/treatments', [
            'type' => Treatment::TYPES[0],
            'description' => 'Test Treatment',
            'dosage' => '100mg',
            'duration' => 10,
            'notes' => 'Test Notes',
        ]);
        $createTreatmentResponse->assertStatus(400);
        $createTreatmentResponse->assertJsonStructure([
            'message',
        ]);
    }

    public function test_cannot_create_a_treatment_if_the_encounter_has_no_observations()
    {
        $admin = $this->actingAsAdmin();
        $nurse = $this->actingAsNurse();
        $doctor = $this->actingAsDoctor();

        $patient = Patient::create([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'gender' => Patient::GENDERS[0],
            'date_of_birth' => '1990-01-15',
            'phone' => '0712345678',
            'national_id' => '1234567890123456',
            'address' => '123 Main St',
            'emergency_contact_name' => 'Jane Doe',
            'emergency_contact_phone' => '0798765432',
        ]);
        
        $encounter = Encounter::create([
            'patient_id' => $patient->id,
            'user_id' => $admin->id,
        ]);

        $startEncounterResponse = $this->putJson('/api/common/encounters/' . $encounter->id . '/start-consultation');
        $startEncounterResponse->assertStatus(200);
        $startEncounterResponse->assertJsonStructure([
            'message',
            'encounter',
        ]);

        $createDiagnosisResponse = $this->postJson('/api/common/encounters/' . $encounter->id . '/diagnoses', [
            'code' => '1234567890',
            'label' => 'Test Diagnosis',
            'is_primary' => true,
        ]);
        $createDiagnosisResponse->assertStatus(201);
        $createDiagnosisResponse->assertJsonStructure([
            'message',
            'diagnosis',
        ]);
        
        $createTreatmentResponse = $this->postJson('/api/common/encounters/' . $encounter->id . '/treatments', [
            'type' => Treatment::TYPES[0],
            'description' => 'Test Treatment',
            'dosage' => '100mg',
            'duration' => 10,
            'notes' => 'Test Notes',
        ]);
        $createTreatmentResponse->assertStatus(400);
        $createTreatmentResponse->assertJsonStructure([
            'message',
        ]);
    }
}
