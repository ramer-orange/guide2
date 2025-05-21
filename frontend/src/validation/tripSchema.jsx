import { z } from 'zod';

export const tripSchema = z.object({
  tripTitle: z.string().max(255, '旅行名は255文字以内で入力してください。').nullish(),
  startDate: z.string().date('有効な日付を入力してください。').nullish(),
  endDate: z.string().date('有効な日付を入力してください。').nullish(),
}).refine((data) => {
  if (data.startDate >= data.endDate) {
    return false;
  }
  console.log('process_continue');
  return true;
}, {
  message: '出発日は帰着日より前の日付で入力してください。',
  path: ['endDate'],
});