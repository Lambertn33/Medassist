<?php

namespace App\Http\Controllers\common;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\common\EncountersServices;

class EncountersController extends Controller
{
    public function __construct(private EncountersServices $encountersServices) {}

    public function index(Request $request)
    {
        try {
            $patientId = $request->query('patient_id');
            $status = $request->query('status');
            $encounters = $this->encountersServices->getAllEncounters((int) $patientId, $status);
            return response()->json([
                'encounters' => $encounters,
            ], 200);
        }
        catch (Exception $e) {
            return response()->json([
                'message' => 'An error occurred while fetching encounters.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $authUser = $request->user();
            $fields = $request->validate([
                'patient_id' => 'required|exists:patients,id',
            ]);
            $fields['user_id'] = $authUser->id;
            $encounter = $this->encountersServices->storeEncounter($fields);
            return response()->json([
                'message' => 'Encounter created successfully',
                'encounter' => $encounter,
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $e->errors(),
            ], 422);
        }
        catch (Exception $e) {
            return response()->json([
                'message' => 'An error occurred while creating encounter.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
