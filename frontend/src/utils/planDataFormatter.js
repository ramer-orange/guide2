import { schemas } from "@/validation";

// 旅行概要のフォーマットを行う関数
export const formatPlanOverview = (tripData) => {
  // undefinedが渡るのを防ぐ
  tripData.tripTitle = tripData.tripTitle || '';

  const validatedData = schemas.tripSchema.parse(tripData);
  const formattedData = {
    title: validatedData.tripTitle,
    start_date: validatedData.startDate,
    end_date: validatedData.endDate,
  };

  return formattedData;
}
