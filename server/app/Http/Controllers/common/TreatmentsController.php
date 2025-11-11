<?php

namespace App\Http\Controllers\common;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\common\TreatmentsServices;
use Exception;

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
}
