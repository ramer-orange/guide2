import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { parseError, ERROR_MESSAGES } from '@/utils/errorHandler';
import { planOverviewCreate } from '@/services/api/planOverviewApi';

export const useNewTrip = () => {
  const [tripData, setTripData] = useState({});
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleTrip = (e) => {
    const { name, value } = e.target;
    setTripData({
      ...tripData,
      [name]: value,
    });
    // 該当フィールドのエラーをクリア
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: undefined,
      });
    }
    setError('');
  };

  // API通信
  const handleCreate = async () => {
    try {
      const response = await planOverviewCreate(tripData);
      
      setError('');
      setFieldErrors({});
      // プランIDのみを渡してTripPlanページに遷移
      navigate(`/trip-plan/${response.data.id}`);
    } catch (error) {
      const { message } = parseError(error, ERROR_MESSAGES.PLAN_CREATE_FAILED);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    tripData,
    setTripData,
    error,
    fieldErrors,
    isLoading,
    handleTrip,
    handleCreate,
  };
}