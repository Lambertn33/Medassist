<?php

namespace App\Http\Controllers\common;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\common\PatientsServices;
use App\Models\Patient;
use Illuminate\Validation\ValidationException;
use Exception;

class PatientsController extends Controller
{
    public function __construct(private PatientsServices $patientsServices) {}

    public function index(Request $request)
    {
        try {
            $search = $request->query('search');
            $patients = $this->patientsServices->getAllPatients($search);
            return response()->json([
                'patients' => $patients,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'An error occurred while fetching patients.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $fields = $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'gender' => 'required|in:' . implode(',', Patient::GENDERS),
                'date_of_birth' => 'required|date',
                'phone' => 'required|regex:/^07\d{8}$/',
                'national_id' => 'required|digits:16',
                'address' => 'required|string|max:255',
                'emergency_contact_name' => 'required|string|max:255',
                'emergency_contact_phone' => 'required|string|max:255',
            ]);
            $patient = $this->patientsServices->createPatient($fields);
            return response()->json([
                'message' => 'Patient created successfully',
                'patient' => $patient,
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $e->errors(),
            ], 422);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'An error occurred while creating the patient.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
