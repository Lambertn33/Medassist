<?php

namespace App\Http\Requests\common\patients;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Http\Exceptions\HttpResponseException;
use App\Models\Patient;

class UpdatePatientRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Check if patient exists first (before validation)
        $patientId = $this->route('id');
        if ($patientId && !Patient::find($patientId)) {
            throw new HttpResponseException(
                response()->json([
                    'message' => 'Patient not found',
                ], 404)
            );
        }

        // Then check authorization
        $authUser = $this->user();
        return $authUser?->can('admin') || $authUser?->can('doctor') || $authUser?->can('nurse') ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $patientId = $this->route('id');
        
        return [
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'gender' => 'sometimes|required|in:' . implode(',', Patient::GENDERS),
            'date_of_birth' => 'sometimes|required|date',
            'phone' => ['sometimes', 'required', 'regex:/^07\d{8}$/', Rule::unique('patients', 'phone')->ignore($patientId)],
            'national_id' => ['sometimes', 'required', 'digits:16', Rule::unique('patients', 'national_id')->ignore($patientId)],
            'address' => 'sometimes|required|string|max:255',
            'emergency_contact_name' => 'sometimes|required|string|max:255',
            'emergency_contact_phone' => 'sometimes|required|regex:/^07\d{8}$/',
        ];
    }

}
