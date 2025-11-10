<?php

namespace App\Http\Controllers\common;

use App\Http\Controllers\Controller;
use App\Services\common\ObservationsServices;
use App\Http\Requests\common\StoreObservation;
use Exception;

class ObservationsController extends Controller
{
    public function __construct(private ObservationsServices $observationsServices) {}

    public function index(int $encounterId)
    {
        try {
            $observations = $this->observationsServices->getObservationsByEncounter($encounterId);
            return response()->json([
                'observations' => $observations,
                ], 200);
        }
        catch (Exception $e) {
            return response()->json([
                'message' => 'An error occurred while fetching observations.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function store(StoreObservation $request, int $encounterId)
    {
        try {
            $fields = $request->validated();
            $observation = $this->observationsServices->storeObservation($fields, $encounterId);
            return response()->json([
                'message' => 'Observation created successfully',
                'observation' => $observation,
            ], 201);
        }
        catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $e->errors(),
            ], 422);
        }
        catch (Exception $e) {
            return response()->json([
                'message' => 'An error occurred while creating observation.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
