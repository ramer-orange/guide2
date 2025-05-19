import { api } from "../api/api";
import { useEffect, useMemo, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom"
import { schemas } from "../validation";

// 旅行プラン作成ページ

export default function TripPlan() {
  const { planId } = useParams(); // URLパラメータからplanIdを取得
  // const [tripData, setTripData] = useState(null); // DBから取得したプランデータ
  const [selectedDay, setSelectedDay] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [inputData, setInputData]   = useState({
    tripTitle: '',
    startDate: null,
    endDate:   null,
  });

  // 入力データが変更されたかどうかを管理
  const isInputChanged = useRef(false);

  // DBからプランデータを取得
  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/plans/${planId}`);
        setInputData({
          tripTitle: response.data.title || '',
          startDate: response.data.start_date || null,
          endDate: response.data.end_date || null,
        });
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

  // 入力データが変更された時の処理
  const handleInputChange = e => {
    const { name, value } = e.target;
    setInputData(prev => ({ ...prev, [name]: value }));
    console.log('inputData', inputData);
    isInputChanged.current = true;
  };

  // 遅延保存処理(デバウンス)
  useEffect(() => {
    if (!isInputChanged.current) return;

    const timer = setTimeout(() => {
      handleTripPlanUpdate(inputData);
    }, 1000);
    isInputChanged.current = false;
    return () => clearTimeout(timer);
  },[inputData]);

  // API側にデータを送信
  const handleTripPlanUpdate = async () => {
    try {
      const updatedData = {
        tripTitle: inputData.tripTitle,
        startDate: inputData.startDate,
        endDate: inputData.endDate,
      };
      const validatedData = schemas.tripSchema.parse(updatedData);

      const apiData = {
        title: validatedData.tripTitle,
        start_date: validatedData.startDate,
        end_date: validatedData.endDate,
      }

      await api.put(`/plans/${planId}`, apiData);
      
      setError('');
    } catch (error) {
      if (error.name === 'ZodError') {
        const allErrors = error.errors.map(error => error.message).join('\n');
        setError(allErrors);
      } else if (error.response) {
        setError(error.response.data.message || 'プランの更新に失敗しました。');
        console.error('プランの更新に失敗しました。', error);
      } else {
        setError('ネットワークエラーが発生しました。');
      }
    }
  }

  // 最初に挿入するためのプランデータ
  const initialPlanData = {time: '', content: ''};

  // 旅行開始日と日数(〇日目)から、該当日付の文字列 (/MM/DD形式) を計算して返す
  const calculateDay = (selectedDay) => {
    // 旅行開始日が選択されている時のみ
    if (inputData?.startDate){
      const startDate = new Date(inputData.startDate);
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
    if(inputData?.startDate && inputData?.endDate) {
      const startDate = new Date(inputData.startDate);
      const endDate = new Date(inputData.endDate);
      const diffTime = endDate - startDate;

      return diffTime;
    }
  }, [inputData?.startDate, inputData?.endDate]);

  // 旅行日数を計算
  const totalDays = useMemo(() => {
    let countDay = 1;
    if(inputData?.startDate && inputData?.endDate) {
      const diffTime = calculateDiffTime;
      if(diffTime >= 0) {
        countDay = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
      }
    }
    return countDay;
  }, [inputData?.startDate, inputData?.endDate, calculateDiffTime]);

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

  // プランデータの削除
  const handlePlanDelete = (index) => {
    setPlanContents(prev => ({
      ...prev,
      [selectedDay]: prev[selectedDay].filter((_, i) => i !== index)
    }));
  }

  // データがロード中の場合
  if (loading) {
    return <div>データを読み込み中...</div>;
  }

  // // プランデータが取得できない場合
  // if (!tripData) {
  //   return <div>プランデータが見つかりません。</div>;
  // }

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
            <p>{error}</p>
            <h3>
              <label htmlFor="tripTitle">旅行タイトル</label>
              <input
                type="text"
                id="tripTitle"
                name="tripTitle"
                value={inputData.tripTitle}
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
                    value={inputData.startDate}
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
                    value={inputData.endDate}
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