<?php

namespace App\Http\Controllers;

use App\Http\Requests\PlanRequest;
use App\Models\Plan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class PlanController extends Controller
{
    // 旅行概要の一覧を取得
    public function index()
    {
        Gate::authorize('viewAny', Plan::class);
        $plans = Plan::where('user_id', Auth::id())->get();

        return response()->json($plans, 200);
    }

    //　旅行概要の詳細を取得
    public function show($id)
    {
        $plan = Plan::findOrFail($id);
        Gate::authorize('view', $plan);

        return response()->json($plan, 200);
    }

    // 旅行概要を作成
    public function store(PlanRequest $request)
    {
        Gate::authorize('create', Plan::class);

        $planData = $request->validated();
        $planData['user_id'] = $request->user()->id;
        $plan = Plan::create($planData);

        return response()->json($plan, 201);
    }

    // 旅行概要を更新
    public function update(PlanRequest $request, $id)
    {
        // 旅行プランを更新
        $plan = Plan::findOrFail($id);
        Gate::authorize('update', $plan);

        $plan->update($request->validated());

        return response()->json($plan, 200);
    }

    // 旅行概要を削除
    public function destroy($id)
    {
        $plan = Plan::findOrFail($id);
        Gate::authorize('delete', $plan);

        $plan->delete();

        return response()->json(['message' => 'Plan deleted successfully.'], 200);
    }
}
