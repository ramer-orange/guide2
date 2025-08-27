import { useState, useEffect } from 'react';
import { parseError, ERROR_MESSAGES } from '@/utils/errorHandler';
import { fetchPlan } from "@/services/api/planManagementApi";
import { planDelete } from "@/services/api/planManagementApi";

export const usePlanManagement = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // プランの取得
  const loadPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchPlan();
      setPlans(response);
    } catch (error) {
      console.error('プランの取得に失敗しました。', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // プランの削除
  const deletePlan = async (planId) => {
    try {
      await planDelete(planId);
      setPlans(plans.filter(plan => plan.id !== planId));
      return { success: true, message: 'プランを削除しました。' };
    } catch (error) {
      const { message } = parseError(error, ERROR_MESSAGES.PLAN_DELETE_FAILED);
      return { success: false, message };
    }
  };

  // 削除確認付きの削除処理
  const handleDeletePlan = async (planId) => {
    if (window.confirm('本当に削除しますか？')) {
      const result = await deletePlan(planId);
      if (result.success) {
        alert(result.message);
      } else {
        alert(result.message);
      }
    }
  };

  // 初期化時にプランを取得
  useEffect(() => {
    loadPlans();
  }, []);

  return {
    plans,
    loading,
    error,
    loadPlans,
    deletePlan,
    handleDeletePlan
  };
};
