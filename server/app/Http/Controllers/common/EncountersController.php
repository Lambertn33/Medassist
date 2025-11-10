<?php

namespace App\Http\Controllers\common;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\common\EncountersServices;
use App\Models\Encounter;

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

    public function show(int $id)
    {
        try {
            $encounter = $this->encountersServices->getEncounter($id);
            if (! $encounter) {
                return response()->json([
                    'message' => 'Encounter not found',
                ], 404);
            }
            return response()->json([
                'encounter' => $encounter,
            ], 200);
        }
        catch (Exception $e) {
            return response()->json([
                'message' => 'An error occurred while fetching encounter.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function startConsultation(int $id)
    {
        try {
            $encounter = $this->encountersServices->getEncounter($id);
            if (! $encounter) {
                return response()->json([
                    'message' => 'Encounter not found',
                ], 404);
            }

            if ($encounter->status !== Encounter::STATUS_INITIALIZED) {
                return response()->json([
                    'message' => 'Consultation has already started',
                ], 400);
            }
            $encounter = $this->encountersServices->startConsultation($id);
            return response()->json([
                'message' => 'Consultation started successfully',
                'encounter' => $encounter,
            ], 200);
        }
        catch (Exception $e) {
            return response()->json([
                'message' => 'An error occurred while starting consultation.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function endConsultation(Request $request, int $id)
    {
        try {
            $fields = $request->validate([
                'summary' => 'required|string',
            ]);
            $encounter = $this->encountersServices->getEncounter($id);
            if (! $encounter) {
                return response()->json([
                    'message' => 'Encounter not found',
                ], 404);
            }
            if ($encounter->status !== Encounter::STATUS_IN_PROGRESS) {
                return response()->json([
                    'message' => 'Consultation has not been started, or has already been ended or cancelled',
                ], 400);
            }
            $encounterToUpdate = $this->encountersServices->endConsultation($id, $fields);
            return response()->json([
                'message' => 'Consultation ended successfully',
                'encounter' => $encounterToUpdate,
            ], 200);
        }
        catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $e->errors(),
            ], 422);
        }
        catch (Exception $e) {
            return response()->json([
                'message' => 'An error occurred while ending consultation.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
