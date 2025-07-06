import { api } from "@/api/api";
import { schemas } from "@/validation";

// DBからプランデータを取得
const fetchPlanDetailData = async (planId) => {
  const planDetail = await api.get(`plans/${planId}/details`);
  return planDetail;
};

// プラン詳細の更新
const planDetailUpdate = async (payload, planId, planDetailId) => {
  const validatedData = schemas.planDetailSchema.parse(payload);
  // 新規作成か更新かを判定
  const isNew = typeof planDetailId !== 'number'; // uuidならstring
  if (isNew) {
    await api.post(`/plans/${planId}/details/`, validatedData);
  } else {
    await api.put(`/plans/${planId}/details/${planDetailId}`, validatedData);
  }
}

// プラン詳細データの削除
const planDelete = async (planId, planDetailId) => {
  await api.delete(`/plans/${planId}/details/${planDetailId}`);
}

// 日数削除時、一括でプラン詳細の削除
const bulkPlanDeleteByDays = async (deleteDays, planId) => {
  if (!deleteDays || deleteDays.length === 0) {
    return;
  }
  await api.delete(`/plans/${planId}/details/bulk`, {
    data: {
      delete_days: deleteDays
    }
  });
}

export { fetchPlanDetailData, planDetailUpdate, planDelete, bulkPlanDeleteByDays };
