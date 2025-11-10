<?php

namespace App\Http\Controllers\common;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\common\DiagnosesServices;
use Exception;

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
}
