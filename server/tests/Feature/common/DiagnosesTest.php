<?php

namespace Tests\Feature\common;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use Laravel\Sanctum\Sanctum;
use App\Models\Diagnosis;
use App\Models\Encounter;
use App\Models\Patient;

class DiagnosesTest extends TestCase
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

    public function test_any_authenticated_user_can_get_diagnoses()
    {
        $admin = $this->actingAsAdmin();
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
        $adminResponse = $this->get('/api/common/encounters/' . $encounter->id . '/diagnoses');
        $adminResponse->assertStatus(200);

        $this->actingAsNurse();
        $nurseResponse = $this->get('/api/common/encounters/' . $encounter->id . '/diagnoses');
        $nurseResponse->assertStatus(200);

        $this->actingAsDoctor();
        $doctorResponse = $this->get('/api/common/encounters/' . $encounter->id . '/diagnoses');
        $doctorResponse->assertStatus(200);
    }

    public function test_any_authenticated_user_can_create_an_diagnosis()
    {
        $admin = $this->actingAsAdmin();
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
        $adminResponse = $this->postJson('/api/common/encounters/' . $encounter->id . '/diagnoses', [
            'code' => '1234567890',
            'label' => 'Diagnosis',
            'is_primary' => true,
        ]);
        $adminResponse->assertStatus(201);

        $this->actingAsNurse();
        $nurseResponse = $this->postJson('/api/common/encounters/' . $encounter->id . '/diagnoses', [
            'code' => '1234567890',
            'label' => 'Diagnosis',
            'is_primary' => true,
        ]);
        $nurseResponse->assertStatus(201);

        $this->actingAsDoctor();
        $doctorResponse = $this->postJson('/api/common/encounters/' . $encounter->id . '/diagnoses', [
            'code' => '1234567890',
            'label' => 'Diagnosis',
            'is_primary' => true,
        ]);
        $doctorResponse->assertStatus(201);
    }
}
