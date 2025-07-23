<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PlanDetailRequest extends FormRequest
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
            'plan_id' => 'required|integer|exists:plans,id',
            'day_number' => 'required|integer',
            'type' => 'nullable|integer',
            'title' => 'nullable|string|max:255',
            'memo' => 'nullable|string',
            'arrival_time' => 'nullable|date_format:H:i:s',
            'order' => 'nullable|integer',
            'place_id' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'address' => 'nullable|string|max:255',
            'rating' => 'nullable|numeric|between:0,5',
        ];
    }
}
