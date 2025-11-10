<?php

namespace App\Http\Requests\common;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Observation;

class StoreObservation extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'type' => 'required|string|in:' . implode(',', Observation::TYPES),
            'value' => 'required|string',
            'unit' => 'required|string',
        ];
    }
}
