import { api } from "./api";

// プラン管理画面でのプラン操作に関するAPI

// プラン取得
const fetchPlan = async () => {
  const response = await api.get('/plans');
  return response.data;
}

// プラン削除
const planDelete = async (planId) => {
  await api.delete(`/plans/${planId}`);
}

export { fetchPlan, planDelete };