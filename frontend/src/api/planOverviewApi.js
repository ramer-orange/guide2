import { api } from "@/api/api";
import { schemas } from "@/validation";

const fetchPlanOverviewData = async (planId) => {
  const tripPlan = await api.get(`/plans/${planId}`);
  return tripPlan
};

// 旅行概要の更新
const tripPlanOverviewUpdate = async (updatedData, planId) => {
  const validatedData = schemas.tripSchema.parse(updatedData);
  await api.put(`/plans/${planId}`, validatedData);
}

export { fetchPlanOverviewData, tripPlanOverviewUpdate};
