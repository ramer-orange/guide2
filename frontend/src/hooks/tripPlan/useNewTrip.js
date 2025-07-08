import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { parseError, ERROR_MESSAGES } from '@/utils/errorHandler';
import { planOverviewCreate } from "@/api/planOverviewApi";

export const useNewTrip = () => {
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

  return {
    tripData,
    setTripData,
    error,
    handleTrip,
    handleCreate,
  };
}