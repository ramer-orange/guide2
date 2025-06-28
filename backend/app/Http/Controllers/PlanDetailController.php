<?php

namespace App\Http\Controllers;

use App\Http\Requests\PlanDetailRequest;
use App\Models\Plan;
use App\Models\PlanDetail;

class PlanDetailController extends Controller
{
    public function show($planDayId)
    {
        $planDetails = PlanDetail::where('id', $planDayId)->get();

        return response()->json($planDetails, 200);
    }

    public function store(PlanDetailRequest $request)
    {
        $planDetails = new PlanDetail();

        $planDetails->plan_id = $request->input('day_number');
        $planDetails->day_number = $request->input('day_number');
        $planDetails->type = $request->input('type');
        $planDetails->title = $request->input('title');
        $planDetails->memo = $request->input('memo');
        $planDetails->arrival_time = $request->input('arrival_time');
        $planDetails->order = $request->input('order');

        $planDetails->save();

        return response()->json($planDetails, 201);
    }

    public function update(PlanDetailRequest $request, $planDetailId)
    {
        $planDetails = PlanDetail::findOrFail($planDetailId);

        $planDetails->day_number = $request->input('day_number', $planDetails->day_number);
        $planDetails->type = $request->input('type', $planDetails->type);
        $planDetails->title = $request->input('title', $planDetails->title);
        $planDetails->memo = $request->input('memo', $planDetails->memo);
        $planDetails->arrival_time = $request->input('arrival_time', $planDetails->arrival_time);
        $planDetails->order = $request->input('order', $planDetails->order);

        $planDetails->save();

        return response()->json($planDetails, 200);
    }

    public function destroy($planDetailId)
    {
        $planDetails = PlanDetail::findOrFail($planDetailId);
        $planDetails->delete();

        return response()->json(['message' => 'Plan detail deleted successfully.'], 200);
    }
}
