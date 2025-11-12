<?php

namespace App\Http\Controllers\common;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Patient;
use App\Models\Encounter;
use App\Models\Observation;
use App\Models\Diagnosis;
use App\Models\Treatment;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $patients = Patient::count();
        $encounters = Encounter::count();
        $inProgressEncounters = Encounter::where('status', Encounter::STATUS_IN_PROGRESS)->count();
        $completedEncounters = Encounter::where('status', Encounter::STATUS_COMPLETED)->count();
        $cancelledEncounters = Encounter::where('status', Encounter::STATUS_CANCELLED)->count();
        $observations = Observation::count();
        $diagnoses = Diagnosis::count();
        $treatments = Treatment::count();

        return response()->json([
            'patients' => $patients,
            'encounters' => $encounters,
            'inProgressEncounters' => $inProgressEncounters,
            'completedEncounters' => $completedEncounters,
            'cancelledEncounters' => $cancelledEncounters,
            'observations' => $observations,
            'diagnoses' => $diagnoses,
            'treatments' => $treatments,
        ]);
    }
}
