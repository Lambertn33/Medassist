<?php

namespace Tests\Feature\common;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use Laravel\Sanctum\Sanctum;
use App\Models\Patient;

class PatientsTest extends TestCase
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

    public function test_any_authenticated_user_can_get_patients()
    {
        // Create some patients before querying
        $patient1 = Patient::create([
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

        $patient2 = Patient::create([
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'gender' => Patient::GENDERS[1],
            'date_of_birth' => '1985-05-20',
            'phone' => '0711111111',
            'national_id' => '9876543210987654',
            'address' => '456 Oak Ave',
            'emergency_contact_name' => 'John Smith',
            'emergency_contact_phone' => '0722222222',
        ]);

        $patient3 = Patient::create([
            'first_name' => 'Bob',
            'last_name' => 'Johnson',
            'gender' => Patient::GENDERS[0],
            'date_of_birth' => '1992-12-10',
            'phone' => '0733333333',
            'national_id' => '1111222233334444',
            'address' => '789 Pine Rd',
            'emergency_contact_name' => 'Alice Johnson',
            'emergency_contact_phone' => '0744444444',
        ]);

        $this->actingAsAdmin();
        $adminResponse = $this->get('/api/common/patients');

        $this->actingAsNurse();
        $nurseResponse = $this->get('/api/common/patients');

        $this->actingAsDoctor();
        $doctorResponse = $this->get('/api/common/patients');

        $adminResponse->assertStatus(200)
            ->assertJsonCount(3, 'patients')
            ->assertJsonStructure([
                'patients' => [
                    '*' => [
                        'id',
                        'first_name',
                        'last_name',
                        'gender',
                        'date_of_birth',
                        'encounters_count',
                    ]
                ]
            ]);

        $nurseResponse->assertStatus(200)
            ->assertJsonCount(3, 'patients');

        $doctorResponse->assertStatus(200)
            ->assertJsonCount(3, 'patients');
    }

    public function test_any_authenticated_user_can_create_a_patient()
    {
        $this->actingAsAdmin();
        $adminResponse = $this->postJson('/api/common/patients', [
            'first_name' => 'Test',
            'last_name' => 'Patient',
            'gender' => Patient::GENDERS[0],
            'date_of_birth' => '1990-01-15',
            'phone' => '0712345671',
            'national_id' => '1234567890123456',
            'address' => '123 Main St',
            'emergency_contact_name' => 'Jane Doe',
            'emergency_contact_phone' => '0798765431',
        ]);

        $adminResponse->assertStatus(201);

        $this->assertDatabaseHas('patients', [
            'first_name' => 'Test',
            'last_name' => 'Patient',
        ]);

        $this->actingAsNurse();
        $nurseResponse = $this->postJson('/api/common/patients', [
            'first_name' => 'Test',
            'last_name' => 'Patient',
            'gender' => Patient::GENDERS[0],
            'date_of_birth' => '1990-01-15',
            'phone' => '0712345672',
            'national_id' => '1234567890123457',
            'address' => '123 Main St',
            'emergency_contact_name' => 'Jane Doe',
            'emergency_contact_phone' => '0798765433',
        ]);

        $nurseResponse->assertStatus(201);

        $this->assertDatabaseHas('patients', [
            'first_name' => 'Test',
            'last_name' => 'Patient',
        ]);

        $this->actingAsDoctor();
        $doctorResponse = $this->postJson('/api/common/patients', [
            'first_name' => 'Test',
            'last_name' => 'Patient',
            'gender' => Patient::GENDERS[0],
            'date_of_birth' => '1990-01-15',
            'phone' => '0712345673',
            'national_id' => '1234567890123458',
            'address' => '123 Main St',
            'emergency_contact_name' => 'Jane Doe',
            'emergency_contact_phone' => '0798765434',
        ]);
        $doctorResponse->assertStatus(201);
    }

    public function test_cannot_create_a_patient_with_the_same_phone_or_national_id()
    {
        $body = [
            'first_name' => 'Test',
            'last_name' => 'Patient',
            'gender' => Patient::GENDERS[0],
            'date_of_birth' => '1990-01-15',
            'phone' => '0712345671',
            'national_id' => '1234567890123456',
            'address' => '123 Main St',
            'emergency_contact_name' => 'Jane Doe',
            'emergency_contact_phone' => '0798765431',
        ];
        $this->actingAsAdmin();
        $adminResponse = $this->postJson('/api/common/patients', $body);
        $adminResponse->assertStatus(201);

        $this->assertDatabaseHas('patients', [
            'first_name' => 'Test',
            'last_name' => 'Patient',
        ]);

        $this->actingAsNurse();
        $nurseResponse = $this->postJson('/api/common/patients', $body);
        $nurseResponse->assertStatus(422);
        $nurseResponse->assertJsonStructure([
            'message',
            'errors',
        ]);
    }

    public function test_any_authenticated_user_can_view_a_patient()
    {
        $body = [
            'first_name' => 'Test',
            'last_name' => 'Patient',
            'gender' => Patient::GENDERS[0],
            'date_of_birth' => '1990-01-15',
            'phone' => '0712345671',
            'national_id' => '1234567890123456',
            'address' => '123 Main St',
            'emergency_contact_name' => 'Jane Doe',
            'emergency_contact_phone' => '0798765431',
        ];
        $this->actingAsAdmin();
        $adminResponse = $this->postJson('/api/common/patients', $body);
        $adminResponse->assertStatus(201);

        $adminResponse = $this->get('/api/common/patients/' . $adminResponse->json('patient.id'));
        $adminResponse->assertStatus(200);
        $adminResponse->assertJsonStructure([
            'patient' => [
                'id',
                'first_name',
                'last_name',
                'gender',
                'date_of_birth',
                'phone',
                'national_id',
                'address',
                'emergency_contact_name',
                'emergency_contact_phone',
                'encounters' => [
                    '*' => [
                        'id',
                        'patient_id',
                        'doctor_id',
                        'date',
                        'time',
                    ],
                ],
            ],
        ]);
    }

    public function test_cannot_view_a_patient_that_does_not_exist()
    {
        $this->actingAsAdmin();
        $adminResponse = $this->get('/api/common/patients/100');
        $adminResponse->assertStatus(404);
        $adminResponse->assertJsonStructure([
            'message',
        ]);
    }

    public function test_any_authenticated_user_can_update_a_patient()
    {
        $body = [
            'first_name' => 'Test',
            'last_name' => 'Patient',
            'gender' => Patient::GENDERS[0],
            'date_of_birth' => '1990-01-15',
            'phone' => '0712345671',
            'national_id' => '1234567890123456',
            'address' => '123 Main St',
            'emergency_contact_name' => 'Jane Doe',
            'emergency_contact_phone' => '0798765431',
        ];
        $this->actingAsAdmin();
        $adminResponse = $this->postJson('/api/common/patients', $body);
        $adminResponse->assertStatus(201);

        $adminResponse = $this->putJson('/api/common/patients/' . $adminResponse->json('patient.id'), $body);
        $adminResponse->assertStatus(200);
        $adminResponse->assertJsonStructure([
            'message',
            'patient',
        ]);

        $this->actingAsNurse();
        $nurseResponse = $this->putJson('/api/common/patients/' . $adminResponse->json('patient.id'), $body);
        $nurseResponse->assertStatus(200);
        $nurseResponse->assertJsonStructure([
            'message',
            'patient',
        ]);

        $this->actingAsDoctor();
        $doctorResponse = $this->putJson('/api/common/patients/' . $adminResponse->json('patient.id'), $body);
        $doctorResponse->assertStatus(200);
        $doctorResponse->assertJsonStructure([
            'message',
            'patient',
        ]);
    }

    public function test_only_admin_can_delete_a_patient()
    {

        $this->actingAsAdmin();
        $createResponse = $this->postJson('/api/common/patients', [
            'first_name' => 'Test',
            'last_name' => 'Patient',
            'gender' => Patient::GENDERS[0],
            'date_of_birth' => '1990-01-15',
            'phone' => '0712345671',
            'national_id' => '1234567890123456',
            'address' => '123 Main St',
            'emergency_contact_name' => 'Jane Doe',
            'emergency_contact_phone' => '0798765431',
        ]);
        $createResponse->assertStatus(201);
        $patientId = $createResponse->json('patient.id');

        $adminResponse = $this->deleteJson('/api/common/patients/' . $patientId);
        $adminResponse->assertStatus(200);
        $adminResponse->assertJsonStructure([
            'message',
        ]);

        $createResponse2 = $this->postJson('/api/common/patients', [
            'first_name' => 'Test2',
            'last_name' => 'Patient2',
            'gender' => Patient::GENDERS[0],
            'date_of_birth' => '1990-01-15',
            'phone' => '0712345672',
            'national_id' => '1234567890123457',
            'address' => '123 Main St',
            'emergency_contact_name' => 'Jane Doe',
            'emergency_contact_phone' => '0798765432',
        ]);
        $createResponse2->assertStatus(201);
        $patientId2 = $createResponse2->json('patient.id');

        $this->actingAsNurse();
        $nurseResponse = $this->deleteJson('/api/common/patients/' . $patientId2);
        $nurseResponse->assertStatus(403);

        $this->actingAsDoctor();
        $doctorResponse = $this->deleteJson('/api/common/patients/' . $patientId2);
        $doctorResponse->assertStatus(403);
    }
}
