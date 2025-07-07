import * as z from "zod/v4";

export const tripSchema = z.object({
  tripTitle: z.string().min(1, "旅行名は必須項目です").max(255, "旅行名は255文字以内で入力してください。"),
  startDate: z.string().date('有効な日付を入力してください。').nullish(),
  endDate: z.string().date('有効な日付を入力してください。').nullish(),
}).refine((data) => {
  if (data.startDate > data.endDate) {
    return false;
  }
  return true;
}, {
  message: '出発日は帰着日より前の日付で入力してください。',
  path: ['endDate'],
});