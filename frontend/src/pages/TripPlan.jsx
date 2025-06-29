import { api } from "../api/api";
import { useEffect, useMemo, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom"
import { schemas } from "../validation";
import { v4 as uuid } from "uuid";

// 旅行プラン作成ページ

export default function TripPlan() {
  const { planId } = useParams(); // URLパラメータからplanIdを取得
  const [selectedDay, setSelectedDay] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [tripData, setTripData]   = useState({
    tripTitle: '',
    startDate: null,
    endDate:   null,
  });
  // プラン内容を管理
  const [planContents, setPlanContents] = useState();

  // 入力データが変更されたかどうかを管理
  const isTripChanged = useRef(false);
  const isPlanDetailChanged = useRef(false);

  // プラン詳細の初期挿入データを生成
  const createInitialPlanData = () => ({
    id: uuid(),
    type: null,
    title: '',
    memo: '',
    arrival_time: null,
    order: null,
  });

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
        const tripPlan = await api.get(`/plans/${planId}`);
        const planDetail = await api.get(`plans-details/${planId}/`);
        setTripData({
          tripTitle: tripPlan.data.title || '',
          startDate: tripPlan.data.start_date || null,
          endDate: tripPlan.data.end_date || null,
        });
        // 取得したプラン詳細を日付ごとにグループ化
        const groupedByDays = planDetail.data.reduce((acc, item) => {
          if (!acc[item.day_number]) {
            acc[item.day_number] = [];
          }
          acc[item.day_number].push({
            ...item,
            id: item.id,
            day_number: item.day_number,
            type: item.type || null,
            title: item.title || '',
            memo: item.memo || '',
            arrival_time: item.arrival_time || null,
            order: item.order || null,
          });
          return acc;
        }, {});
        setPlanContents(groupedByDays);

        setError('');
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
        const result = await handleBulkPlanDeleteByDays(deleteDays)
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

  // 旅行概要が変更された時の処理
  const handleInputChange = e => {
    const { name, value } = e.target;
    setTripData(prev => ({ ...prev, [name]: value }));
    isTripChanged.current = true;
  };

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
            plan_id: Number(planId),
            day_number: selectedDay,
            type: updatePlan.type,
            title: updatePlan.title,
            memo: updatePlan.memo,
            arrival_time: updatePlan.arrival_time,
            order: i + 1,
          });
          return updatePlan;
        }
        return plan;
      })
    }));
    isPlanDetailChanged.current = true;
  };

  // 遅延保存処理(旅行概要)
  useEffect(() => {
    if (!isTripChanged.current) return;

    const timer = setTimeout(() => {
      handleTripPlanUpdate();
      isTripChanged.current = false;
    }, 250);
    return () => clearTimeout(timer);
  },[tripData]);

  // 遅延保存処理(プラン詳細)
  useEffect(() => {
    if (!isPlanDetailChanged.current) return;

    const timer = setTimeout(() => {
      handlePlanDetailUpdate();
      isPlanDetailChanged.current = false;
    }, 250);
    return () => clearTimeout(timer);
  },[planContents]);

  // API側にデータを送信
  // 旅行概要の更新
  const handleTripPlanUpdate = async () => {
    try {
      // 旅行概要
      const updatedData = {
        title: tripData.tripTitle,
        start_date: tripData.startDate,
        end_date: tripData.endDate,
      };
      const validatedData = schemas.tripSchema.parse(updatedData);
      await api.put(`/plans/${planId}`, validatedData);

      setError('');
    } catch (error) {
      if (error.name === 'ZodError') {
        const allErrors = error.errors.map(error => error.message).join('\n');
        setError(allErrors);
      } else if (error.response) {
        setError('プランの更新に失敗しました。');
        console.error('プランの更新に失敗しました。', error);
      } else {
        setError('ネットワークエラーが発生しました。');
      }
    }
  }
  // プラン詳細の更新
  const handlePlanDetailUpdate = async () => {
    const changedItem = changedPlanDetail.current.entries().next();
    if (changedItem.done) {
      return;
    }
    const [planDetailId, payload] = changedItem.value;
    try {
      changedPlanDetail.current.clear();

      const validatedData = schemas.planDetailSchema.parse(payload);
      // 新規作成か更新かを判定
      const isNew = typeof planDetailId !== 'number'; // uuidならstring
      if (isNew) {
        await api.post(`/plan-details/`, validatedData);
      } else {
        await api.put(`/plan-details/${planDetailId}`, validatedData);
      }

      setError('');
    } catch (error) {
      if (error.name === 'ZodError') {
        const allErrors = error.errors.map(error => error.message).join('\n');
        setError(allErrors);
      } else if (error.response) {
        setError('プランの更新に失敗しました。');
        console.error('プランの更新に失敗しました。', error);
      } else {
        setError('ネットワークエラーが発生しました。');
      }
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
      await api.delete(`/plan-details/${planDetailId}`);
      setPlanContents(prev => ({
        ...prev,
        [selectedDay]: prev[selectedDay].filter((_, i) => i !== index)
      }));
    } catch (error) {
      setError('プランの削除に失敗しました。');
      console.error('プランの削除に失敗しました。', error);
    }
  }

  // 日数削除時、一括でプラン詳細の削除
  const handleBulkPlanDeleteByDays = async (deleteDays) => {
    try {
      if (!deleteDays || deleteDays.length === 0) {
        return;
      }
      await api.delete(`/plan-details/${planId}/bulk-delete-days`, {
        data: {
          delete_days: deleteDays
        }
      });
    } catch (error) {
      setError('プランの削除に失敗しました。');
      console.error('プランの削除に失敗しました。', error);
    }
  }

  // データがロード中の場合
  if (loading) {
    return <div>データを読み込み中...</div>;
  }

  // 現在選択されている日のプランの内容を取得
  const currentDayPlan = planContents[selectedDay] || [createInitialPlanData()];

  return (
    <>
      <div>
        <div>
          <h2>プラン作成</h2>
          <Link to="/management">
            <button>管理画面へ戻る</button>
          </Link>
          <div>
            <p>{error}</p>
            <h3>
              <label htmlFor="tripTitle">旅行タイトル</label>
              <input
                type="text"
                id="tripTitle"
                name="tripTitle"
                value={tripData.tripTitle || ''}
                placeholder="旅行タイトル"
                onChange={handleInputChange}
              />
            </h3>
            <div>
              <span>
                <label htmlFor="startDate">
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={tripData.startDate || ''}
                    onChange={handleInputChange}
                  />
                </label>
              </span>
              <span> ~ </span>
              <span>
                <label htmlFor="endDate">
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={tripData.endDate || ''}
                    onChange={handleInputChange}
                  />
                </label>
              </span>
            </div>
          </div>
        </div>
        <div>
          <div>
            {Array(totalDays).fill(null).map((_, index) => (
             <button key={index} onClick={() => handleSelectedDay(index)}>Day {index + 1}</button>
            ))}
          </div>
          <div>
            <p>Day {selectedDay}</p>
            <span>{calculateDay(selectedDay)}</span>
            <div>
              <div>
                {currentDayPlan.map((item, index) => {
                  return (
                    <div key={index}>
                      <label htmlFor="arrival_time">
                        <input type="time" id="arrival_time" name="arrival_time" value={item.arrival_time || ''} onChange={e => handlePlanChange(index, e)}/>
                      </label>
                      <label htmlFor="memo">
                        <textarea name="memo" id="memo" value={item.memo || ''} onChange={e => handlePlanChange(index, e)}></textarea>
                      </label>
                      <button onClick={() => (handlePlanDelete(index))}>削除</button>
                  </div>
                  )
                })}
              </div>
            </div>
          </div>
          <div>
            <button onClick={handleAddPlan}>メモを追加</button>
          </div>
        </div>
      </div>
    </>
  )
}