import { api } from '@/lib/axios'

export type GetGetMonthRevenueResponse = {
  receipt: number
  diffFromLastMonth: number
}

export async function getMonthRevenue() {
  const response = await api.get<GetGetMonthRevenueResponse>(
    '/metrics/month-receipt',
  )
  return response.data
}
