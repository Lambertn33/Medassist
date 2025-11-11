<?php

namespace App\Http\Controllers\common;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\common\TreatmentsServices;
use Exception;
use Illuminate\Validation\ValidationException;
use App\Http\Requests\common\StoreTreatmentRequest;

class TreatmentsController extends Controller
{
    public function __construct(private TreatmentsServices $treatmentsServices) {}

    public function index(int $encounterId)
    {
        try {
            $treatments = $this->treatmentsServices->getAllTreatments($encounterId);
            return response()->json([
                'treatments' => $treatments,
            ], 200);
        }
        catch (Exception $e) {
            return response()->json([
                'message' => 'An error occurred while fetching treatments.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function store(StoreTreatmentRequest $request, int $encounterId)
    {
        try {
            $fields = $request->validated();
            $treatment = $this->treatmentsServices->storeTreatment($fields, $encounterId);
            return response()->json([
                'message' => 'Treatment created successfully',
                'treatment' => $treatment,
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
                'message' => 'An error occurred while creating treatment.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
