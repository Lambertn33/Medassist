<?php

namespace App\Http\Controllers\common;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\common\DiagnosesServices;
use App\Http\Requests\common\StoreDiagnosis;
use Exception;
use Illuminate\Validation\ValidationException;

class DiagnosesController extends Controller
{
    public function __construct(private DiagnosesServices $diagnosesServices) {}

    public function index(int $encounterId)
    {
        $diagnoses = $this->diagnosesServices->getAllDiagnoses($encounterId);
        try {
            return response()->json([
                'diagnoses' => $diagnoses,
            ], 200);
        }
        catch (Exception $e) {
            return response()->json([
                'message' => 'An error occurred while fetching diagnoses.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
    public function store(StoreDiagnosis $request, int $encounterId)
    {
        try {
            $fields = $request->validated();
            $diagnosis = $this->diagnosesServices->storeDiagnosis($fields, $encounterId);
            return response()->json([
                'message' => 'Diagnosis created successfully',
                'diagnosis' => $diagnosis,
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
                'message' => 'An error occurred while creating diagnosis.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
