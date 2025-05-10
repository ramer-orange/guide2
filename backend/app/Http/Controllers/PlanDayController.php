<?php

namespace App\Http\Controllers;

use App\Http\Requests\PlanDayRequest;
use App\Models\PlanDay;

class PlanDayController extends Controller
{
    // リクエスト日の情報を取得
    public function show($planId, $planDayId)
    {
        $planDays = PlanDay::where('plan_id', $planId)->where('id', $planDayId)->firstOrFail();

        return response()->json($planDays, 200);
    }

    public function store(PlanDayRequest $request, $planId)
    {
      $planDay = new PlanDay();

      $planDay->plan_id = $planId;
      $planDay->day_number = $request->input('day_number');
      $planDay->date = $request->input('date');
      $planDay->save();

      return response()->json($planDay, 201);
    }

    public function update(PlanDayRequest $request, $id)
    {
        $planDay = PlanDay::findOrFail($id);

        $planDay->day_number = $request->input('day_number', $planDay->day_number);
        $planDay->date = $request->input('date', $planDay->date);
        $planDay->save();

        return response()->json($planDay, 200);
    }

    // リクエスト日の情報を削除
     public function destroy($planDayId)
     {
        $planDays = PlanDay::where('plan_day_id', $planDayId)->delete();

        return response()->json(['message' => 'Plan day deleted successfully.'], 200);
     }
}
