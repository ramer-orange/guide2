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

        return response()->json($plan->details, 200);
    }

    public function store(PlanDetailRequest $request, Plan $plan)
    {
        Gate::authorize('create', $plan);
        $planDetail = $plan->details()->create($request->validated());

        return response()->json($planDetail, 201);
    }

    public function update(PlanDetailRequest $request, Plan $plan, PlanDetail $detail)
    {
        Gate::authorize('update', $plan);
        $detail->update($request->validated());

        return response()->json($detail, 200);
    }

    public function destroy(Plan $plan, PlanDetail $detail)
    {
        Gate::authorize('delete', $plan);
        $detail->delete();

        return response()->json(['message' => 'Plan detail deleted successfully.'], 200);
    }

    public function bulkDestroy(BulkDeletePlanDetailRequest $request, Plan $plan)
    {
        Gate::authorize('delete', $plan);
        $dayNumbers = $request->input('delete_days');
        if (!empty($dayNumbers)) {
            $plan->details()
                ->whereIn('day_number', $dayNumbers)
                ->delete();
        }

        return response()->json(['message' => 'Plan detail deleted successfully(Bulk).'], 200);
    }
}
