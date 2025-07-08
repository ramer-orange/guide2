import * as z from "zod/v4";

export const planDetailSchema = z.object({
  planId: z.number().int(),
  dayNumber: z.number().int().positive('日数は1以上の整数で入力してください。'),
  type: z.number().int().nullish(),
  title: z.string().max(255, 'タイトルは255文字以内で入力してください。').nullish(),
  memo: z.string().nullish(),
  arrivalTime: z.iso.time().nullish(),
  order: z.number().int().positive('順番は1以上の整数で入力してください。').nullish(),
})