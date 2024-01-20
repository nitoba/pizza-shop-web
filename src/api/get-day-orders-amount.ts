import { api } from '@/lib/axios'

export type GetDayOrdersAmountResponse = {
  amount: number
  diffFromYesterday: number
}

export async function getDayOrdersAmount() {
  const response = await api.get<GetDayOrdersAmountResponse>(
    '/metrics/day-orders-amount',
  )
  return response.data
}
