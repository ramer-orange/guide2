import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/api";

// 旅行名と日付を入力するページ

export default function NewTrip() {
  const [tripData, setTripData] = useState({});
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleTrip = (e) => {
    setTripData({
      ...tripData,
      [e.target.name]: e.target.value,
    });
    // エラーメッセージをクリア
    setError('');
  };

  // API通信
  const handleCreate = async () => {
    const startDate = new Date(tripData.startDay);
    const endDate = new Date(tripData.finishDay);

    // バリデーションエラー
    if (!tripData.tripName) {
      setError('旅行名は必須項目です。');
      return;
    }
    else if (startDate > endDate) {
      setError('出発日は帰着日より前の日付を入力してください。');
      return;
    }

    try {
      const apiData = {
        title: tripData.tripName,
        start_date: tripData.startDay,
        end_date: tripData.finishDay,
      }
      const response = await api.post('/plans', apiData);

      navigate('/trip-plan', { state: { ...response.data } });
    } catch (error) {
      console.error('旅行プランの作成に失敗しました。', error);
      setError('旅行プランの作成に失敗しました。');
    }
  };

  return (
    <div>
      <h2>新しい旅行プランを作成</h2>
      <Link to="/management">
          <button>管理画面へ戻る</button>
      </Link>
      <div>
        <p>{error}</p>
        <div>
          <label htmlFor="tripName">旅行タイトル</label>
          <input
            type="text"
            id="tripName"
            name="tripName"
            value={tripData.tripName || ''}
            placeholder="旅行タイトル"
            onChange={handleTrip}
          />
        </div>
        <div>
          <label htmlFor="startDay">出発日</label>
          <input
            type="date"
            id="startDay"
            name="startDay"
            value={tripData.startDay || ''}
            placeholder="出発日"
            onChange={handleTrip}
          />
        </div>
        <div>
          <label htmlFor="finishDay">帰着日</label>
          <input
            type="date"
            id="finishDay"
            name="finishDay"
            value={tripData.finishDay || ''}
            placeholder="帰着日"
            onChange={handleTrip}
          />
        </div>
      </div>
      <button type="button" onClick={handleCreate}>
        作成
      </button>
    </div>
  );
}
