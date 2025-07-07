import { api } from "@/api/api";
import { formatPlanOverview } from "@/utils/planDataFormatter";

// 旅行概要の取得
const fetchPlanOverviewData = async (planId) => {
  const tripPlan = await api.get(`/plans/${planId}`);
  
  return tripPlan
};

// 旅行概要の新規作成
const planOverviewCreate = async (tripData) => {
  const formattedData = formatPlanOverview(tripData);
  const response = await api.post(`/plans/`, formattedData);

  return response;
}


// 旅行概要の更新
const planOverviewUpdate = async (updatedData, planId) => {
  const formattedData = formatPlanOverview(updatedData);
  await api.put(`/plans/${planId}`, formattedData);
}

export { fetchPlanOverviewData, planOverviewUpdate, planOverviewCreate};
