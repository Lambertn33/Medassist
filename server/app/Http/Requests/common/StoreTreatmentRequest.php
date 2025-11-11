<?php

namespace App\Http\Requests\common;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Treatment;

class StoreTreatmentRequest extends FormRequest
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
            'type' => 'required|string|in:' . implode(',', Treatment::TYPES),
            'description' => 'required|string',
            'dosage' => 'required|string',
            'duration' => 'required|integer',
            'notes' => 'nullable|string',
        ];
    }
}
