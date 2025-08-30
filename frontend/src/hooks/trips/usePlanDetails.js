import { fetchPlanDetailData, planDetailUpdate, planDelete, bulkPlanDeleteByDays } from "@/services/api/planDetailApi";
import { useState, useEffect, useRef, useCallback } from "react";
import { v4 as uuid } from "uuid";
import { parseError, ERROR_MESSAGES } from '@/utils/errorHandler';

export const usePlanDetails = (planId, totalDays, onSpotDeleted) => {
  const [selectedDay, setSelectedDay] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [planContents, setPlanContents] = useState({});

  const isPlanDetailChanged = useRef(false);

  // createInitialPlanDataをuseCallbackでラップ
  const createInitialPlanData = useCallback(() => ({
    id: uuid(),
    type: null,
    title: '',
    memo: '',
    arrivalTime: null,
    order: null,
  }), []); // 依存配列を空にする

  const initializePlanContentsForDays = useCallback((days) => {
    setPlanContents(prev => {
      const next = { ...prev };
      for (let day = 1; day <= days; day++) {
        if (!(day in next)) {
          next[day] = [createInitialPlanData()];
        }
      }
      Object.keys(next)
        .map(Number)
        .filter(day => day > days)
        .forEach(day => {
          delete next[day];
        });
      return next;
    });
  }, [createInitialPlanData]);

  useEffect(() => {
    if (selectedDay > totalDays) {
      setSelectedDay(totalDays);
    }
  }, [selectedDay, totalDays]);

  useEffect(() => {
    const fetchPlanDetail = async () => {
      try {
        setLoading(true);
        const planDetail = await fetchPlanDetailData(planId);
        const groupedByDays = planDetail.data.reduce((acc, item) => {
          if (!acc[item.day_number]) {
            acc[item.day_number] = [];
          }
          acc[item.day_number].push({
            ...item,
            id: item.id,
            dayNumber: item.day_number,
            type: item.type || null,
            title: item.title || '',
            memo: item.memo || '',
            arrivalTime: item.arrival_time || null,
            order: item.order || null,
          });
          return acc;
        }, {});
        setPlanContents(groupedByDays);

        setError('');
        console.debug('プランデータの取得に成功しました:', groupedByDays);
      } catch (error) {
        const { message } = parseError(error, ERROR_MESSAGES.PLAN_FETCH_FAILED);
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    if (planId) {
      fetchPlanDetail();
    }
  }, [planId]);

  const handleAddPlan = () => {
    setPlanContents(prev => (
      {
        ...prev,
        [selectedDay]: [
          ...prev[selectedDay],
          createInitialPlanData()
        ]
      })
    )
  };

  const addSpotToPlan = (spotData) => {
    console.debug('スポットデータを追加:', spotData);
    const newPlanItem = {
      id: uuid(),
      type: null,
      title: spotData.name || '',
      memo: '',
      arrivalTime: null,
      order: planContents[selectedDay].length + 1,
      placeId: spotData.placeId || '',
      latitude: spotData.lat || null,
      longitude: spotData.lng || null,
      address: spotData.address || '',
      rating: spotData.rating || null,
    };
    changedPlanDetail.current.set(newPlanItem.id, {
      ...newPlanItem,
      planId: Number(planId),
      dayNumber: selectedDay,
    });
    
    setPlanContents(prev => {
      const updated = {
        ...prev,
        [selectedDay]: [
          ...prev[selectedDay],
          newPlanItem
        ]
      };
      
      setTimeout(() => {
        handlePlanDetailUpdate();
      }, 0);
      
      return updated;
    });
  };

  const handleSelectedDay = (dayNumber) => {
    setSelectedDay(dayNumber);
  }

  const changedPlanDetail = useRef(new Map());

  const handlePlanChange = (index, e) => {
    const { name, value } = e.target;
    setPlanContents(prev => ({
      ...prev,
      [selectedDay]: prev[selectedDay].map((plan, i) => {
        if (i === index) {
          const updatePlan = {...plan, [name]: value};
          changedPlanDetail.current.set(plan.id, {
            planId: Number(planId),
            dayNumber: selectedDay,
            type: updatePlan.type,
            title: updatePlan.title,
            memo: updatePlan.memo,
            arrivalTime: updatePlan.arrivalTime,
            order: i + 1,
          });
          return updatePlan;
        }
        return plan;
      })
    }));
    isPlanDetailChanged.current = true;
  };

  useEffect(() => {
    if (!isPlanDetailChanged.current) return;

    const timer = setTimeout(() => {
      handlePlanDetailUpdate();
      isPlanDetailChanged.current = false;
    }, 500);
    return () => clearTimeout(timer);
  },[planContents]);

  const handlePlanDetailUpdate = async () => {
    const changedItem = changedPlanDetail.current.entries().next();
    if (changedItem.done) {
      return;
    }
    const [planDetailId, payload] = changedItem.value;
    try {
      changedPlanDetail.current.clear();

      await planDetailUpdate(payload, planId, planDetailId);

      if (typeof planDetailId === 'string') {
        const updatedData = await fetchPlanDetailData(planId);
        const groupedByDays = updatedData.data.reduce((acc, item) => {
          if (!acc[item.day_number]) {
            acc[item.day_number] = [];
          }
          acc[item.day_number].push({
            ...item,
            id: item.id,
            dayNumber: item.day_number,
            type: item.type || null,
            title: item.title || '',
            memo: item.memo || '',
            arrivalTime: item.arrival_time || null,
            order: item.order || null,
            placeId: item.place_id || '',
            latitude: item.latitude || null,
            longitude: item.longitude || null,
            address: item.address || '',
            rating: item.rating || null,
          });
          return acc;
        }, {});
        setPlanContents(groupedByDays);
      }

      setError('');
      console.debug('プランの更新に成功しました:', payload);
    } catch (error) {
      const { message } = parseError(error, ERROR_MESSAGES.PLAN_UPDATE_FAILED);
      setError(message);
    }
  }

  const handlePlanDelete = async (index) => {
    try {
      const deletePlanDetailItem = planContents[selectedDay][index];
      if (typeof deletePlanDetailItem.id !== 'number') {
        setPlanContents(prev => ({
          ...prev,
          [selectedDay]: prev[selectedDay].filter((_, i) => i !== index)
        }));
        
        if (onSpotDeleted && onSpotDeleted.current) {
          onSpotDeleted.current(deletePlanDetailItem);
        }
        return;
      }

      const planDetailId = deletePlanDetailItem.id;
      await planDelete(planId, planDetailId);
      setPlanContents(prev => ({
        ...prev,
        [selectedDay]: prev[selectedDay].filter((_, i) => i !== index)
      }));
      setError('');
      console.debug('プランの削除に成功しました:', deletePlanDetailItem);
      
      if (onSpotDeleted && onSpotDeleted.current) {
        onSpotDeleted.current(deletePlanDetailItem);
      }
    } catch (error) {
      const { message } = parseError(error, ERROR_MESSAGES.PLAN_DELETE_FAILED);
      setError(message);
    }
  }

  const handleBulkPlanDeleteByDays = async (deleteDays, planId) => {
    try {
      await bulkPlanDeleteByDays(deleteDays, planId);

      setError('');
      console.debug('プランの一括削除に成功しました:', deleteDays);
      return { success: true };
    } catch (error) {
      const { message } = parseError(error, ERROR_MESSAGES.PLAN_DELETE_FAILED);
      setError(message);
      return { success: false };
    }
  }

  useEffect(() => {
    if (!planContents[selectedDay]) {
      setPlanContents(prev => ({
        ...prev,
        [selectedDay]: [createInitialPlanData()]
      }));
    }
  }, [selectedDay, planContents, createInitialPlanData]);
  const currentDayPlan = planContents[selectedDay] || [];
  console.debug('現在選択されている日のプラン:', currentDayPlan);

  return {
    selectedDay,
    setSelectedDay,
    error,
    setError,
    loading,
    setLoading,
    planContents,
    setPlanContents,
    handleAddPlan,
    addSpotToPlan,
    handlePlanChange,
    isPlanDetailChanged,
    createInitialPlanData,
    handlePlanDetailUpdate,
    handlePlanDelete,
    handleBulkPlanDeleteByDays,
    handleSelectedDay,
    currentDayPlan,
    initializePlanContentsForDays,
  };
}