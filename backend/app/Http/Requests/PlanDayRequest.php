<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PlanDayRequest extends FormRequest
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
            'plan_id' => 'required|exists:plans,id',
            'day_number' => 'required|integer|min:1',
            'date' => 'date',
        ];
    }
}
