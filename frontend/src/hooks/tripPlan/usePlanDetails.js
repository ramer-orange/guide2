import { fetchPlanDetailData, planDetailUpdate, planDelete, bulkPlanDeleteByDays } from "@/api/planDetailApi";
import { useState, useEffect, useRef } from "react";
import { v4 as uuid } from "uuid";
import { parseError, ERROR_MESSAGES } from '@/utils/errorHandler';

export const usePlanDetails = (planId, totalDays) => {
  const [selectedDay, setSelectedDay] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  // プラン内容を管理
  const [planContents, setPlanContents] = useState({});

  // 入力データが変更されたかどうかを管理
  const isPlanDetailChanged = useRef(false);

  // プラン詳細の初期挿入データを生成
  const createInitialPlanData = () => ({
    id: uuid(),
    type: null,
    title: '',
    memo: '',
    arrivalTime: null,
    order: null,
  });

  // DBからプランデータを取得
  useEffect(() => {
    const fetchPlanDetail = async () => {
      try {
        setLoading(true);
        const planDetail = await fetchPlanDetailData(planId);
        // 取得したプラン詳細を日付ごとにグループ化
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

  // 追加ボタンが押された時の処理(選択された日のみに初期データを挿入)
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

  // マップ上からのスポットをプランに追加する関数
  const addSpotToPlan = (spotData) => {
    const newPlanItem = {
      id: uuid(),
      type: null,
      title: spotData.name || '',
      memo: '',
      arrivalTime: null,
      order: null,
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
      
      // 直接保存処理を実行
      setTimeout(() => {
        handlePlanDetailUpdate();
      }, 0);
      
      return updated;
    });
  };

  // 日数の増減時の処理
  useEffect(() => {
    // 日数が増えた時
    setPlanContents(prev => {
      const next = {...prev};
      for (let day = 1; day <= totalDays; day++) {
        if(!(day in next)) {
          next[day] = [createInitialPlanData()]
        }
      }
      return next;
    });

    // 日数が減った時
    const next = {...planContents};
    const deleteDays = Object.keys(next)
      .map(Number)
      .filter(day => day > totalDays);
    if (deleteDays.length > 0) {
      (async () => {
        // DB上から削除
        const result = await handleBulkPlanDeleteByDays(deleteDays, planId)
        if (result.success) {
          // UI上から削除
          setPlanContents(prev => {
            const next = {...prev};
            deleteDays.forEach(day => {
              delete next[day];
            });
            return next;
          });
        }
      })();
    };
  }, [totalDays]);

  useEffect(() => {
    // 選択日が範囲外になったら最新の範囲内に戻す
    if (selectedDay > totalDays ) {
      setSelectedDay(totalDays);
    }
  },[totalDays]);

  // 押されたボタンが何日目なのか
  const handleSelectedDay = (index) => {
    setSelectedDay(index + 1);
  }

  // 変更されたプラン詳細の内容を追跡
  const changedPlanDetail = useRef(new Map());

  // 選択中の日のプラン内容（時間または内容）を変更するハンドラ
  const handlePlanChange = (index, e) => {
    const { name, value } = e.target;
    setPlanContents(prev => ({
      ...prev,
      [selectedDay]: prev[selectedDay].map((plan, i) => {
        if (i === index) {
          const updatePlan = {...plan, [name]: value};
          // 変更されたプランアイテムのIDを追跡
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

  // 遅延保存処理(プラン詳細)
  useEffect(() => {
    if (!isPlanDetailChanged.current) return;

    const timer = setTimeout(() => {
      handlePlanDetailUpdate();
      isPlanDetailChanged.current = false;
    }, 500);
    return () => clearTimeout(timer);
  },[planContents]);


  // プラン詳細の更新
  const handlePlanDetailUpdate = async () => {
    const changedItem = changedPlanDetail.current.entries().next();
    if (changedItem.done) {
      return;
    }
    const [planDetailId, payload] = changedItem.value;
    try {
      changedPlanDetail.current.clear();

      await planDetailUpdate(payload, planId, planDetailId);

      setError('');
      console.debug('プランの更新に成功しました:', payload);
    } catch (error) {
      const { message } = parseError(error, ERROR_MESSAGES.PLAN_UPDATE_FAILED);
      setError(message);
    }
  }

  // プラン詳細データの削除
  const handlePlanDelete = async (index) => {
    try {
      const deletePlanDetailItem = planContents[selectedDay][index];
      // データベースに存在しないもの(uuidの場合)
      if (typeof deletePlanDetailItem.id !== 'number') {
        // UI上から削除
        setPlanContents(prev => ({
          ...prev,
          [selectedDay]: prev[selectedDay].filter((_, i) => i !== index)
        }));
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
    } catch (error) {
      const { message } = parseError(error, ERROR_MESSAGES.PLAN_DELETE_FAILED);
      setError(message);
    }
  }

  // 日数削除時、一括でプラン詳細の削除
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

  // 現在選択されている日のプランの内容を取得
  useEffect(() => {
    // 選択された日にプランがない場合、stateに初期データを挿入
    if (!planContents[selectedDay]) {
      setPlanContents(prev => ({
        ...prev,
        [selectedDay]: [createInitialPlanData()]
      }));
    }
  }, [selectedDay, planContents]);
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
  };
}
