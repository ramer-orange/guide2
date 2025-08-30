import { useState, useEffect, useRef, useMemo } from "react";
import { fetchPlanOverviewData, planOverviewUpdate } from "@/services/api/planOverviewApi";
import { parseError, ERROR_MESSAGES } from '@/utils/errorHandler';

export function usePlanOverview(planId) {
  // error と loading の state を正しく宣言
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [tripData, setTripData] = useState({
    title: '',
    start_date: '',
    end_date: '',
  });

  const isTripChanged = useRef(false);

  const calculateDay = (selectedDay) => {
    if (tripData?.start_date){
      const startDate = new Date(tripData.start_date);
      startDate.setDate(startDate.getDate() + selectedDay - 1);
      const options = { month: 'numeric', day: 'numeric' };
      return startDate.toLocaleDateString("ja-JP", options);
    }
  };

  const calculateDiffTime = useMemo(() => {
    if(tripData?.start_date && tripData?.end_date) {
      const startDate = new Date(tripData.start_date);
      const endDate = new Date(tripData.end_date);
      const diffTime = endDate.getTime() - startDate.getTime();
      if (diffTime < 0) {
        setError('出発日は帰着日より前の日付で入力してください。');
      } else {
        setError(null); // エラーがない場合はクリア
      }
      return diffTime;
    }
    return 0;
  }, [tripData?.start_date, tripData?.end_date]);

  const totalDays = useMemo(() => {
    if(tripData?.start_date && tripData?.end_date) {
      const diffTime = calculateDiffTime;
      if(diffTime >= 0) {
        return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
      }
    }
    return 1;
  }, [tripData?.start_date, tripData?.end_date, calculateDiffTime]);

  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        setLoading(true);
        const tripPlan = await fetchPlanOverviewData(planId);
        // DBのキー(スネークケース)に合わせてstateを更新
        setTripData({
          title: tripPlan.data.title || '',
          start_date: tripPlan.data.start_date || null,
          end_date: tripPlan.data.end_date || null,
        });
        setError(null);
      } catch (err) { // catchの引数を正しく定義
        const { message } = parseError(err, ERROR_MESSAGES.PLAN_FETCH_FAILED);
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    if (planId) {
      fetchPlanData();
    }
  }, [planId]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setTripData(prev => ({ ...prev, [name]: value }));
    isTripChanged.current = true;
  };

  useEffect(() => {
    if (!isTripChanged.current) return;
    const timer = setTimeout(() => {
      handlePlanOverviewUpdate();
      isTripChanged.current = false;
    }, 250);
    return () => clearTimeout(timer);
  },[tripData]);

  const handlePlanOverviewUpdate = async () => {
    try {
      await planOverviewUpdate(tripData, planId);
      setError(null);
    } catch (err) { // catchの引数を正しく定義
      const { message } = parseError(err, ERROR_MESSAGES.PLAN_UPDATE_FAILED);
      setError(message);
    }
  }

  return {
    error,
    loading,
    tripData,
    calculateDay,
    totalDays,
    handleInputChange,
  }
}