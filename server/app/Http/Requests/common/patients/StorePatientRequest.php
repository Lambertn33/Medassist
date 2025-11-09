<?php

namespace App\Http\Requests\common\patients;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Patient;

class StorePatientRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
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
        return [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'gender' => 'required|in:' . implode(',', Patient::GENDERS),
            'date_of_birth' => 'required|date',
            'phone' => 'required|regex:/^07\d{8}$/|unique:patients,phone',
            'national_id' => 'required|digits:16|unique:patients,national_id',
            'address' => 'required|string|max:255',
            'emergency_contact_name' => 'required|string|max:255',
            'emergency_contact_phone' => 'required|regex:/^07\d{8}$/',
        ];
    }
}
