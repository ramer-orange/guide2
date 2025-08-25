import { useState, useEffect } from 'react';
import { fetchPlanSpots } from '@/api/planDetailApi';
import { formatPlanDetailSpots } from "@/utils/planDataFormatter";

export const useRegisteredSpots = (planId) => {
  const [registeredSpots, setRegisteredSpots] = useState([]);
  const [loading, setLoading] = useState(false);

  // 登録済みスポットをDBから取得
  const loadRegisteredSpots = async () => {
    if (!planId) return;
    
    try {
      setLoading(true);
      const spotData = await fetchPlanSpots(planId);
      const formattedSpots = formatPlanDetailSpots(spotData);
      setRegisteredSpots(formattedSpots);
    } catch (error) {
      console.error('スポットデータの取得に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  // planIdが変更された時に自動でロード
  useEffect(() => {
    loadRegisteredSpots();
  }, [planId]);

  return {
    registeredSpots,
    loading,
    loadRegisteredSpots
  };
};