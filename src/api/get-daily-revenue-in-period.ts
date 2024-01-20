import { api } from '@/lib/axios'

export type GetDailyRevenueInPeriod = {
  date: string
  receipt: number
}[]

type GetDailyRevenueInPeriodQuery = {
  from?: Date
  to?: Date
}

export async function getDailyRevenueInPeriod({
  from,
  to,
}: GetDailyRevenueInPeriodQuery) {
  const response = await api.get<GetDailyRevenueInPeriod>(
    '/metrics/daily-receipt-in-period',
    { params: { from, to } },
  )
  return response.data
}
