import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom"


// 旅行プラン作成ページ

export default function TripPlan() {
  const { state } = useLocation();
  // 何日目のプランなのかを管理
  const [selectedDay, setSelectedDay] = useState(1);
  const [stateDate, setStateDate] = useState(state);


  // 旅行開始日と日数(〇日目)から、該当日付の文字列 (/MM/DD形式) を計算して返す
  const calculateDay = (selectedDay) => {
    // 旅行開始日が選択されている時のみ
    if (stateDate.selectedDay){
      const startDate = new Date(stateDate?.startDay);
      startDate.setDate(startDate.getDate() + selectedDay - 1);
      const options = {
        month: 'numeric',
        day: 'numeric',
      }
      return startDate.toLocaleDateString("ja-JP", options);
    }
  };

  // 出発日と帰着日の差を計算
  const calculateDiffDay = useMemo(() => {
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
      const diffTime = calculateDiffDay;
      if(diffTime >= 0) {
        countDay = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
      }
    }
    return countDay;
  }, [stateDate?.startDay, stateDate?.finishDay, calculateDiffDay]);

  // プランデータを日付とリンク(初期設定)
  const initialPlanContents = useMemo(() => {
    const contents = {};
    for (let day = 1; day <= totalDays; day++){
      contents[day] = {time: '', content: ''}
    }
    return contents;
  }, [totalDays]);

  // プラン内容を管理
  const [planContents, setPlanContents] = useState(initialPlanContents);

  // 日数が増えた時の初期値をマージ
  useEffect(() => {
    setPlanContents(prev => {
      const next = {...prev};

      for (let day = 1; day <= totalDays; day++) {
        if(!(day in next)) {
          next[day] = {time: '', content: ''}
        }
      }
      return next;
    });
  }, [totalDays]);

  // useEffect(() => {
  //   setPlanContents(initialPlanContents)
  // }, [initialPlanContents]);

  // 押されたボタンが何日目なのか
  const handleSelectedDay = (index) => {
    setSelectedDay(index + 1);
  }

  // 選択中の日のプラン内容（時間または内容）を変更するハンドラ
  const handlePlanChange = (e) => {
    const { name, value } = e.target;
    setPlanContents((prevPlanContents) => ({
      ...prevPlanContents, // 他の日の内容はそのまま維持
      [selectedDay]: { // 現在選択中の日のオブジェクトを更新
        ...prevPlanContents[selectedDay],
        [name]: value, // 変更されたフィールドを新しい値で更新
      },
    }));
  };

  // 日付の更新
  const handleSetDate = (e) => {
    setStateDate({
      ...stateDate,
      [e.target.name]: e.target.value
    })
  }

  // 現在選択されている日のプランの内容を取得
  const currentDayPlan = planContents[selectedDay];

  return (
    <>
      <div>
        <div>
          <h2>プラン作成</h2>
          <div>
            <h3>{state?.tripName}</h3>
            <div>
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
              <label htmlFor="time">
                <input type="time" id="time" name="time" value={currentDayPlan.time} onChange={handlePlanChange}/>
              </label>
              <label htmlFor="content">
                <textarea name="content" id="content" value={currentDayPlan.content} onChange={handlePlanChange}></textarea>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}