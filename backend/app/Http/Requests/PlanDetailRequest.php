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
            'plan_day_id' => 'required|integer|exists:plan_days,id',
            'type' => 'nullable|integer',
            'title' => 'nullable|string|max:255',
            'memo' => 'nullable|string',
            'arrival_time' => 'nullable|date_format:H:i:s',
            'order' => 'nullable|integer',
        ];
    }
}
