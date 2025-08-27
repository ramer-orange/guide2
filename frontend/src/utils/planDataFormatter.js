import { schemas } from "@/utils/validation/schemas";

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

// APIから取得したデータを地図用に変換
export const formatPlanDetailSpots = (spots) => {
  const formattedSpots = spots.map(spot => ({
    id: spot.id,
    lat: parseFloat(spot.latitude),
    lng: parseFloat(spot.longitude),
    name: spot.title,
    address: spot.address,
    rating: parseFloat(spot.rating),
    placeId: spot.place_id,
    dayNumber: spot.day_number,
    order: spot.order
  }));

  return formattedSpots
}

// 登録済みスポットのデータフォーマット
export const formatRegisteredSpotData = (spot) => {
  return {
    name: spot.name,
    address: spot.address,
    lat: spot.lat,
    lng: spot.lng,
    placeId: spot.placeId,
    rating: spot.rating
  };
};

// 新規スポット（Place）のデータフォーマット
export const formatNewSpotData = (place) => {
  // 位置情報がない場合
  if (!place.geometry || !place.geometry.location) {
    throw new Error('このスポットのデータが見つかりません。');
  }

  return {
    name: place.name,
    address: place.formatted_address,
    lat: place.geometry.location.lat(),
    lng: place.geometry.location.lng(),
    placeId: place.place_id,
    rating: place.rating
  };
};