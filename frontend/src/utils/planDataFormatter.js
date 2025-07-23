import { schemas } from "@/validation";

// 旅行概要をAPIに送信するためのフォーマットを行う関数
export const formatPlanOverview = (tripData) => {
  const validatedData = schemas.tripSchema.parse(tripData);
  const formattedData = {
    title: validatedData.tripTitle,
    start_date: validatedData.startDate,
    end_date: validatedData.endDate,
  };

  return formattedData;
}

// 旅行詳細をAPIに送信するためのフォーマットを行う関数
export const formatPlanDetail = (tripData) => {
  const validatedData = schemas.planDetailSchema.parse(tripData);
  const formattedData = {
    plan_id: validatedData.planId,
    day_number: validatedData.dayNumber,
    type: validatedData.type,
    title: validatedData.title,
    memo: validatedData.memo,
    arrival_time: validatedData.arrivalTime,
    order: validatedData.order,
    place_id: validatedData.placeId,
    latitude: validatedData.latitude,
    longitude: validatedData.longitude,
    address: validatedData.address,
    rating: validatedData.rating,
  };

  return formattedData;
}