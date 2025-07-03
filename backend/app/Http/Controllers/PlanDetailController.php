<?php

namespace App\Http\Controllers;

use App\Http\Requests\PlanDetailRequest;
use App\Http\Requests\BulkDeletePlanDetailRequest;
use App\Models\Plan;
use App\Models\PlanDetail;
use Illuminate\Support\Facades\Gate;

class PlanDetailController extends Controller
{
    public function index(Plan $plan)
    {
        Gate::authorize('view', $plan);

        return response()->json($plan->planDetails, 200);
    }

    public function store(PlanDetailRequest $request, Plan $plan)
    {
        Gate::authorize('create', $plan);
        $planDetail = $plan->planDetails()->create($request->validated());

        return response()->json($planDetail, 201);
    }

    public function update(PlanDetailRequest $request, Plan $plan, PlanDetail $planDetail)
    {
        Gate::authorize('update', $plan);
        $planDetail->update($request->validated());

        return response()->json($planDetail, 200);
    }

    public function destroy(Plan $plan, PlanDetail $planDetail)
    {
        Gate::authorize('delete', $plan);
        $planDetail->delete();

        return response()->json(['message' => 'Plan detail deleted successfully.'], 200);
    }

    public function bulkDestroy(BulkDeletePlanDetailRequest $request, Plan $plan)
    {
        Gate::authorize('delete', $plan);
        $dayNumbers = $request->input('delete_days');
        if (!empty($dayNumbers)) {
            $plan->planDetails()
                ->whereIn('day_number', $dayNumbers)
                ->delete();
        }

        return response()->json(['message' => 'Plan detail deleted successfully(Bulk).'], 200);
    }
}
