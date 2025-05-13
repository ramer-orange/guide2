import { api } from "../api/api";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom"


// 旅行プラン作成ページ

export default function TripPlan() {
  const { state } = useLocation();
  // 何日目のプランなのかを管理
  const [selectedDay, setSelectedDay] = useState(1);
  const [stateDate, setStateDate] = useState(state);
  const [error, setError] = useState('');

  // API側にデータを送信
  const handleTripPlanUpdate = async (next) => {
    try {
      const response = await api.put(`/plans/${state.id}`, next);
      console.log(response);
    } catch (error) {
      setError(error.response.data.message);
      console.error('プランの更新に失敗しました。', error);
    }
  }

  // 最初に挿入するためのプランデータ
  const initialPlanData = {time: '', content: ''};

  // 旅行開始日と日数(〇日目)から、該当日付の文字列 (/MM/DD形式) を計算して返す
  const calculateDay = (selectedDay) => {
    // 旅行開始日が選択されている時のみ
    if (stateDate.startDay){
      const startDate = new Date(stateDate.startDay);
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
    if(stateDate?.startDay && stateDate?.finishDay) {
      const startDay = new Date(stateDate.startDay);
      const finishDay = new Date(stateDate.finishDay);
      const diffTime = finishDay - startDay;

      return diffTime;
    }
  }, [stateDate?.startDay, stateDate?.finishDay]);

  // 旅行日数を計算
  const totalDays = useMemo(() => {
    let countDay = 1;
    if(stateDate?.startDay && stateDate?.finishDay) {
      const diffTime = calculateDiffTime;
      if(diffTime >= 0) {
        countDay = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
      }
    }
    return countDay;
  }, [stateDate?.startDay, stateDate?.finishDay, calculateDiffTime]);

  // プランデータを日付とリンク(初期設定)
  const initialPlanContents = useMemo(() => {
    const contents = {};
    for (let day = 1; day <= totalDays; day++){
      contents[day] = [initialPlanData]
    }
    return contents;
  }, [totalDays]);

  // プラン内容を管理
  const [planContents, setPlanContents] = useState(initialPlanContents);

  // 追加ボタンが押された時の処理(選択された日のみに初期データを挿入)
  const handleAddPlan = () => {
    setPlanContents(prev => (
      {
        ...prev,
        [selectedDay]: [
          ...prev[selectedDay],
          initialPlanData
        ]
      })
    )
  };

  // 日数の増減時の処理
  useEffect(() => {
    setPlanContents(prev => {
      const next = {...prev};

      // 日数は増えた時
      for (let day = 1; day <= totalDays; day++) {
        if(!(day in next)) {
          next[day] = {time: '', content: ''}
        }
      }

      // 日数が減った時
      Object.keys(next).forEach(key => {
        const dayNum = Number(key);
        if(dayNum > totalDays) {
          delete next[key];
        }
      })
      return next;
    });
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

  // 選択中の日のプラン内容（時間または内容）を変更するハンドラ
  const handlePlanChange = (index, e) => {
    const { name, value } = e.target;
    setPlanContents(prev => ({
      ...prev,
      // 変更箇所を特定し、変更
      [selectedDay]: prev[selectedDay].map((plan, i) =>
      i === index ? {...plan, [name]: value} : plan
      )
    }));
  };

  // 日付の更新
  const handleSetDate = (e) => {
    const { name, value } = e.target;

    setStateDate(prev => {
      const next = {...prev, [name]: value};

      // 帰着日が出発日よりも早い場合
      if (next.startDay && next.finishDay) {
        if (next.startDay > next.finishDay) {
          alert('帰着日が出発日よりも早いです。');
          return prev;
        }
      }

      // API側にデータを送信
      handleTripPlanUpdate(next);

      return next;
    });
  }

  // プランデータの削除
  const handlePlanDelete = (index) => {
    setPlanContents(prev => ({
      ...prev,
      [selectedDay]: prev[selectedDay].filter((_, i) => i !== index)
    }));
  }

  // 現在選択されている日のプランの内容を取得
  const currentDayPlan = planContents[selectedDay];

  return (
    <>
      <div>
        <div>
          <h2>プラン作成</h2>
          <Link to="/management">
            <button>管理画面へ戻る</button>
          </Link>
          <div>
            {/* <h3>
              <label htmlFor="tripName">旅行タイトル</label>
              <input
                type="text"
                id="tripName"
                name="tripName"
                value={state?.tripName || ''}
                placeholder="旅行タイトル"
                onChange={handleTripPlanUpdate}/>
                {state?.tripName}
              </h3> */}
            <div>
              <p>{error}</p>
              <span>
                <label htmlFor="startDay">
                  <input type="date" id="startDay" name="startDay" value={stateDate?.startDay} onChange={handleSetDate} />
                </label>
                </span>
              <span> ~ </span>
              <span>
                <label htmlFor="finishDay">
                  <input type="date" id="finishDay" name="finishDay" value={stateDate?.finishDay} onChange={handleSetDate} />
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
                {currentDayPlan.map((plan, index) => {
                  return (
                    <div key={index}>
                      <label htmlFor="time">
                        <input type="time" id="time" name="time" value={plan.time} onChange={e => handlePlanChange(index, e)}/>
                      </label>
                      <label htmlFor="content">
                        <textarea name="content" id="content" value={plan.content} onChange={e => handlePlanChange(index, e)}></textarea>
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