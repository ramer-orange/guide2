<?php

namespace App\Http\Controllers;

use App\Http\Requests\PlanDetailRequest;
use App\Http\Requests\BulkDeletePlanDetailRequest;
use App\Models\Plan;
use App\Models\PlanDetail;
use Illuminate\Support\Facades\Gate;

class PlanDetailController extends Controller
{
    public function index($planId)
    {
        $plan = Plan::findOrFail($planId);
        Gate::authorize('view', $plan); // プランに対する認可
        $planDetails = PlanDetail::where('plan_id', $planId)->get();

        return response()->json($planDetails, 200);
    }

    public function store(PlanDetailRequest $request)
    {
        Gate::authorize('create', PlanDetail::class);

        $planDetail = new PlanDetail();

        $planDetail->plan_id = $request->input('plan_id');
        $planDetail->day_number = $request->input('day_number');
        $planDetail->type = $request->input('type');
        $planDetail->title = $request->input('title');
        $planDetail->memo = $request->input('memo');
        $planDetail->arrival_time = $request->input('arrival_time');
        $planDetail->order = $request->input('order');

        $planDetail->save();

        return response()->json($planDetail, 201);
    }

    public function update(PlanDetailRequest $request, $planDetailId)
    {
        $planDetail = PlanDetail::findOrFail($planDetailId);
        Gate::authorize('update', $planDetail);

        $planDetail->day_number = $request->input('day_number', $planDetail->day_number);
        $planDetail->type = $request->input('type', $planDetail->type);
        $planDetail->title = $request->input('title', $planDetail->title);
        $planDetail->memo = $request->input('memo', $planDetail->memo);
        $planDetail->arrival_time = $request->input('arrival_time', $planDetail->arrival_time);
        $planDetail->order = $request->input('order', $planDetail->order);

        $planDetail->save();

        return response()->json($planDetail, 200);
    }

    public function destroy($planDetailId)
    {
        $planDetail = PlanDetail::findOrFail($planDetailId);
        Gate::authorize('delete', $planDetail);

        $planDetail->delete();

        return response()->json(['message' => 'Plan detail deleted successfully.'], 200);
    }

    public function bulkDestroy(BulkDeletePlanDetailRequest $request, $planId)
    {
        $plan = Plan::findOrFail($planId);
        Gate::authorize('delete', $plan);

        $dayNumbers = $request->input('delete_days');
        if (!empty($dayNumbers)) {
            PlanDetail::where('plan_id', $planId)
                ->whereIn('day_number', $dayNumbers)
                ->delete();
        }

        return response()->json(['message' => 'Plan detail deleted successfully(Bulk).'], 200);
    }
}
