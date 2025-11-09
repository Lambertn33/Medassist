<?php

namespace App\Http\Controllers\common;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\common\PatientsServices;
use App\Http\Requests\common\patients\StorePatientRequest;
use App\Http\Requests\common\patients\UpdatePatientRequest;
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

    public function store(StorePatientRequest $request)
    {
        try {
            $patient = $this->patientsServices->createPatient($request->validated());
            return response()->json([
                'message' => 'Patient created successfully',
                'patient' => $patient,
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'An error occurred while creating the patient.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function show(int $id)
    {
        try {
            $patient = $this->patientsServices->viewPatient($id);
            if (! $patient) {
                return response()->json([
                    'message' => 'Patient not found',
                ], 404);
            }
            return response()->json([
                'patient' => $patient,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'An error occurred while fetching the patient.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function update(int $id, UpdatePatientRequest $request)
    {
        try {
            $patient = $this->patientsServices->viewPatient($id);
            if (! $patient) {
                return response()->json([
                    'message' => 'Patient not found',
                ], 404);
            }
            $patient = $this->patientsServices->updatePatient($patient, $request->validated());
            return response()->json([
                'message' => 'Patient updated successfully',
                'patient' => $patient,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'An error occurred while updating the patient.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }   
}
