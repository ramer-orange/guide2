import { useState, useEffect, useRef, useMemo } from "react";
import { fetchPlanOverviewData, planOverviewUpdate } from "@/api/planOverviewApi";
import { parseError, ERROR_MESSAGES } from '@/utils/errorHandler';

export const usePlanOverview = (planId) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [tripData, setTripData]   = useState({
    tripTitle: '',
    startDate: null,
    endDate:   null,
  });

  // 入力データが変更されたかどうかを管理
  const isTripChanged = useRef(false);

  // 旅行開始日と日数(〇日目)から、該当日付の文字列 (/MM/DD形式) を計算して返す
  const calculateDay = (selectedDay) => {
    // 旅行開始日が選択されている時のみ
    if (tripData?.startDate){
      const startDate = new Date(tripData.startDate);
      startDate.setDate(startDate.getDate() + selectedDay - 1);
      const options = {
        month: 'numeric',
        day: 'numeric',
      }
      return startDate.toLocaleDateString("ja-JP", options);
    }
  };

  // 出発日と帰着日の差(ミリ秒)を計算
  const calculateDiffTime = useMemo(() => {
    if(tripData?.startDate && tripData?.endDate) {
      const startDate = new Date(tripData.startDate);
      const endDate = new Date(tripData.endDate);
      const diffTime = endDate - startDate;
      if (diffTime < 0) {
        setError('出発日は帰着日より前の日付で入力してください。');
      }

      return diffTime;
    }
  }, [tripData?.startDate, tripData?.endDate]);

  // 旅行日数を計算
  const totalDays = useMemo(() => {
    let countDay = 1;
    if(tripData?.startDate && tripData?.endDate) {
      const diffTime = calculateDiffTime;
      if(diffTime >= 0) {
        countDay = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
      }
    }
    return countDay;
  }, [tripData?.startDate, tripData?.endDate, calculateDiffTime]);

  // DBからプランデータを取得
  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        setLoading(true);

        const tripPlan = await fetchPlanOverviewData(planId);
        setTripData({
          tripTitle: tripPlan.data.title || '',
          startDate: tripPlan.data.start_date || null,
          endDate: tripPlan.data.end_date || null,
        });

        setError('');
        console.debug('プランデータの取得に成功しました:', tripPlan.data);
      } catch (error) {
        console.error('プランデータの取得に失敗しました:', error);
        setError('プランデータの取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    if (planId) {
      fetchPlanData();
    }
  }, [planId]);

  // 旅行概要が変更された時の処理
  const handleInputChange = e => {
    const { name, value } = e.target;
    setTripData(prev => ({ ...prev, [name]: value }));
    isTripChanged.current = true;
  };

  // 遅延保存処理(旅行概要)
  useEffect(() => {
    if (!isTripChanged.current) return;

    const timer = setTimeout(() => {
      handlePlanOverviewUpdate();
      isTripChanged.current = false;
    }, 250);
    return () => clearTimeout(timer);
  },[tripData]);


  // API側にデータを送信
  // 旅行概要の更新
  const handlePlanOverviewUpdate = async () => {
    try {
      await planOverviewUpdate(tripData, planId);

      setError('');
      console.debug('プランの更新に成功しました:', tripData);
    } catch (error) {
      const { message } = parseError(error, ERROR_MESSAGES.PLAN_UPDATE_FAILED);
      setError(message);
    }
  }

  return {
    error,
    setError,
    loading,
    setLoading,
    tripData,
    setTripData,
    calculateDay,
    calculateDiffTime,
    totalDays,
    handleInputChange,
    handlePlanOverviewUpdate,
  }
}
