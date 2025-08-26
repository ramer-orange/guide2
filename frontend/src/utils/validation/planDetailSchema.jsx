import * as z from "zod/v4";

export const planDetailSchema = z.object({
  planId: z.number().int(),
  dayNumber: z.number().int().positive('日数は1以上の整数で入力してください。'),
  type: z.number().int().nullish(),
  title: z.string().max(255, 'タイトルは255文字以内で入力してください。').nullish(),
  memo: z.string().nullish(),
  arrivalTime: z.iso.time().nullish(),
  order: z.number().int().positive('順番は1以上の整数で入力してください。').nullish(),
  placeId: z.string().max(255, '場所IDは255文字以内で入力してください。').nullish(),
  latitude: z.number().min(-90, '緯度は-90以上で入力してください。').max(90, '緯度は90以下で入力してください。').nullish(),
  longitude: z.number().min(-180, '経度は-180以上で入力してください。').max(180, '経度は180以下で入力してください。').nullish(),
  address: z.string().max(255, '住所は255文字以内で入力してください。').nullish(),
  rating: z.number().min(0, '評価は0以上で入力してください。').max(5, '評価は5以下で入力してください。').nullish(),
})