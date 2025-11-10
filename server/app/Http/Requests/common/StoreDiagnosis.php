<?php

namespace App\Http\Requests\common;

use Illuminate\Foundation\Http\FormRequest;

class StoreDiagnosis extends FormRequest
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
            'code' => 'required|string|max:255',
            'label' => 'required|string|max:255',
            'is_primary' => 'required|boolean',
        ];
    }
}
