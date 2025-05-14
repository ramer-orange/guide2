import { z } from 'zod';

export const tripSchema = z.object({
  tripName: z.string().max(255, '旅行名は255文字以内で入力してください。').nullish(),
  startDay: z.string().date('有効な日付を入力してください。').nullish(),
  endDay: z.string().date('有効な日付を入力してください。').nullish(),
}).refine((data) => {
  if (data.startDay >= data.endDay) {
    return false;
  }
  return true;
}, {
  message: '出発日は帰着日より前の日付で入力してください。',
  path: ['endDay'],
});