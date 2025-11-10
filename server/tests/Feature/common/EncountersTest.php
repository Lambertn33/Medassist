<?php

namespace Tests\Feature\common;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use Laravel\Sanctum\Sanctum;
use App\Models\Patient;
use App\Models\Encounter;

class EncountersTest extends TestCase
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

    public function test_any_authenticated_user_can_get_encounters()
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

        $adminresponse = $this->get('/api/common/encounters');
        $adminresponse->assertStatus(200);
        $adminresponse->assertJsonCount(1, 'encounters');
        
        $this->actingAsNurse();
        $nurseresponse = $this->get('/api/common/encounters');
        $nurseresponse->assertStatus(200);
        $nurseresponse->assertJsonCount(1, 'encounters');
        
        $this->actingAsDoctor();
        $doctorresponse = $this->get('/api/common/encounters');
        $doctorresponse->assertStatus(200);
        $doctorresponse->assertJsonCount(1, 'encounters');
    }

    public function test_any_authenticated_user_can_create_an_encounter()
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

        $this->actingAsAdmin();
        $adminresponse = $this->postJson('/api/common/encounters', [
            'patient_id' => $patient->id,
        ]);
        $adminresponse->assertStatus(201);
        $adminresponse->assertJsonStructure([
            'message',
            'encounter',
        ]);

        $this->actingAsNurse();
        $nurseresponse = $this->postJson('/api/common/encounters', [
            'patient_id' => $patient->id,
        ]);
        $nurseresponse->assertStatus(201);
        $nurseresponse->assertJsonStructure([
            'message',
            'encounter',
        ]);

        $this->actingAsDoctor();
        $doctorresponse = $this->postJson('/api/common/encounters', [
            'patient_id' => $patient->id,
        ]);
        $doctorresponse->assertStatus(201);
        $doctorresponse->assertJsonStructure([
            'message',
            'encounter',
        ]);
    }

    public function test_any_authenticated_user_can_view_an_encounter()
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
        $adminresponse = $this->get('/api/common/encounters/' . $encounter->id);
        $adminresponse->assertStatus(200);
        $adminresponse->assertJsonStructure([
            'encounter',
        ]);

        $this->actingAsNurse();
        $nurseresponse = $this->get('/api/common/encounters/' . $encounter->id);
        $nurseresponse->assertStatus(200);
        $nurseresponse->assertJsonStructure([
            'encounter',
        ]);

        $this->actingAsDoctor();
        $doctorresponse = $this->get('/api/common/encounters/' . $encounter->id);
        $doctorresponse->assertStatus(200);
        $doctorresponse->assertJsonStructure([
            'encounter',
        ]);
    }

    public function test_any_authenticated_user_can_start_a_consultation()
    {
        $user = $this->actingAsNurse();

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

        $encounter1 = Encounter::create([
            'patient_id' => $patient->id,
            'user_id' => $user->id,
        ]);

        $encounter2 = Encounter::create([
            'patient_id' => $patient->id,
            'user_id' => $user->id,
        ]);

        $encounter3 = Encounter::create([
            'patient_id' => $patient->id,
            'user_id' => $user->id,
        ]);

        $this->actingAsAdmin();
        $adminresponse = $this->putJson('/api/common/encounters/' . $encounter1->id . '/start-consultation');
        $adminresponse->assertStatus(200);

        $this->actingAsNurse();
        $nurseresponse = $this->putJson('/api/common/encounters/' . $encounter2->id . '/start-consultation');
        $nurseresponse->assertStatus(200);

        $this->actingAsDoctor();
        $doctorresponse = $this->putJson('/api/common/encounters/' . $encounter3->id . '/start-consultation');
        $doctorresponse->assertStatus(200);
    }

    public function test_only_initial_encounter_can_be_started()
    {
        $user = $this->actingAsNurse();

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

        $initialEncounter = Encounter::create([
            'patient_id' => $patient->id,
            'user_id' => $user->id,
        ]);

        $this->actingAsAdmin();
        $adminresponse = $this->putJson('/api/common/encounters/' . $initialEncounter->id . '/start-consultation');
        $adminresponse->assertStatus(200);      
        
        $secondAdminResponse = $this->putJson('/api/common/encounters/' . $initialEncounter->id . '/start-consultation');
        $secondAdminResponse->assertStatus(400);
        $secondAdminResponse->assertJsonStructure([
            'message',
        ]);
    }

    public function test_any_authenticated_user_can_end_a_consultation()
    {
        $user = $this->actingAsNurse();

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

        $encounter1 = Encounter::create([
            'patient_id' => $patient->id,
            'user_id' => $user->id,
        ]);

        $encounter2 = Encounter::create([
            'patient_id' => $patient->id,
            'user_id' => $user->id,
        ]);

        $encounter3 = Encounter::create([
            'patient_id' => $patient->id,
            'user_id' => $user->id,
        ]);

        $this->actingAsAdmin();
        $adminresponse = $this->putJson('/api/common/encounters/' . $encounter1->id . '/start-consultation');
        $adminresponse->assertStatus(200);

        $this->actingAsNurse();
        $nurseresponse = $this->putJson('/api/common/encounters/' . $encounter2->id . '/start-consultation');
        $nurseresponse->assertStatus(200);

        $this->actingAsDoctor();
        $doctorresponse = $this->putJson('/api/common/encounters/' . $encounter3->id . '/start-consultation');
        $doctorresponse->assertStatus(200);

        $this->actingAsAdmin();
        $adminresponse = $this->putJson('/api/common/encounters/' . $encounter1->id . '/end-consultation', [
            'summary' => 'Test summary',
        ]);
        $adminresponse->assertStatus(200);
        $adminresponse->assertJsonStructure([
            'message',
            'encounter',
        ]);

        $this->actingAsNurse();
        $nurseresponse = $this->putJson('/api/common/encounters/' . $encounter2->id . '/end-consultation', [
            'summary' => 'Test summary',
        ]);
        $nurseresponse->assertStatus(200);
        $nurseresponse->assertJsonStructure([
            'message',
            'encounter',
        ]);

        $this->actingAsDoctor();
        $doctorresponse = $this->putJson('/api/common/encounters/' . $encounter3->id . '/end-consultation', [
            'summary' => 'Test summary',
        ]);
        $doctorresponse->assertStatus(200);
        $doctorresponse->assertJsonStructure([
            'message',
            'encounter',
        ]);
    }
}
