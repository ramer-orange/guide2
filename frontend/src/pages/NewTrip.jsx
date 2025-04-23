import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// 旅行名と日付を入力するページ

export default function NewTrip() {
  const [tripData, setTripData] = useState({});
  const navigate = useNavigate();

  const handleTrip = (e) => {
    setTripData({
      ...tripData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreate = () => {
    navigate('/trip-plan', { state: { ...tripData } });
  };

  return (
    <div>
      <h2>新しい旅行プランを作成</h2>
      <Link to="/management">
          <button>管理画面へ戻る</button>
      </Link>
      <div>
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
      <button type="button" onClick={handleCreate}>作成</button>
    </div>
  );
}
