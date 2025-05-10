<?php

namespace App\Http\Controllers;

use App\Http\Requests\PlanRequest;
use App\Models\Plan;

class PlanController extends Controller
{
    // 旅行プランの一覧を取得
    public function index()
    {
        $plans = Plan::all();

        return response()->json($plans, 200);
    }

    //　旅行プランの詳細を取得
    public function show($id)
    {
        $plan = Plan::findOrFail($id);

        return response()->json($plan, 200);
    }

    // 旅行プランを作成
    public function store(PlanRequest $request)
    {
        // 新しい旅行プランを作成
        $plan = new Plan();
        $plan->user_id = $request->user()->id;
        $plan->title = $request->input('title');
        $plan->start_date = $request->input('start_date');
        $plan->end_date = $request->input('end_date');
        $plan->save();

        return response()->json($plan, 201);
    }

    // 旅行プランを更新
    public function update(PlanRequest $request, $id)
    {
        // 旅行プランを更新
        $plan = Plan::findOrFail($id);

        $plan->title = $request->input('title', $plan->title);
        $plan->start_date = $request->input('start_date', $plan->start_date);
        $plan->end_date = $request->input('end_date', $plan->end_date);
        $plan->save();

        return response()->json($plan, 200);
    }

    // 旅行プランを削除
    public function destroy($id)
    {
        // 旅行プランを削除
        $plan = Plan::findOrFail($id);

        $plan->delete();

        return response()->json(['message' => 'Plan deleted successfully.'], 200);
    }
}
