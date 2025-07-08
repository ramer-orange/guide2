import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { parseError, ERROR_MESSAGES } from '@/utils/errorHandler';
import { planOverviewCreate } from "@/api/planOverviewApi";

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
    try {
      const response = await planOverviewCreate(tripData);
      
      setError('');
      // プランIDのみを渡してTripPlanページに遷移
      navigate(`/trip-plan/${response.data.id}`);
    } catch (error) {
      const { message } = parseError(error, ERROR_MESSAGES.PLAN_CREATE_FAILED);
      setError(message);
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
