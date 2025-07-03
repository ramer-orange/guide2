import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/api/api";
import { schemas } from "@/validation";

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
    // Zodバリデーション
    try {
      const validatedData = schemas.tripSchema.parse(tripData);
      
      const apiData = {
        title: validatedData.tripTitle,
        start_date: validatedData.startDate,
        end_date: validatedData.endDate,
      }
      
      const response = await api.post('/plans', apiData);
      
      // プランIDのみを渡してTripPlanページに遷移
      navigate(`/trip-plan/${response.data.id}`);
    } catch (error) {
      if (error.name === 'ZodError') {
        // Zodバリデーションエラーの場合
        const allErrors = error.errors.map(error => error.message).join('\n');
        setError(allErrors);
      } else if (error.response) {
        // APIエラーの場合
        setError(error.response.data.message || '旅行プランの作成に失敗しました。');
      } else {
        // その他のエラー
        console.error('旅行プランの作成に失敗しました。', error);
        setError('ネットワークエラーが発生しました。');
      }
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
          <label htmlFor="tripTitle">旅行タイトル</label>
          <input
            type="text"
            id="tripTitle"
            name="tripTitle"
            value={tripData.tripTitle || ''}
            placeholder="旅行タイトル"
            onChange={handleTrip}
          />
        </div>
        <div>
          <label htmlFor="startDate">出発日</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={tripData.startDate || ''}
            placeholder="出発日"
            onChange={handleTrip}
          />
        </div>
        <div>
          <label htmlFor="endDate">帰着日</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={tripData.endDate || ''}
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
