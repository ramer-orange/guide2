import * as z from "zod/v4";

export const tripSchema = z.object({
  title: z.string().max(255, '旅行名は255文字以内で入力してください。').nullish(),
  start_date: z.string().date('有効な日付を入力してください。').nullish(),
  end_date: z.string().date('有効な日付を入力してください。').nullish(),
}).refine((data) => {
  if (data.start_date >= data.end_date) {
    return false;
  }
  return true;
}, {
  message: '出発日は帰着日より前の日付で入力してください。',
  path: ['endDate'],
});