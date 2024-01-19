import { api } from '@/lib/axios'

export type Status =
  | 'pending'
  | 'canceled'
  | 'processing'
  | 'delivering'
  | 'delivered'

export type Order = {
  orderId: string
  createdAt: string
  status: Status
  customerName: string
  total: number
}

export type GetOrdersResponse = {
  orders: Order[]
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
  }
}

type GetOrdersQuery = {
  pageIndex?: number | null
  costumerName?: string | null
  orderId?: string | null
  status?: string | null
}

export async function getOrders({
  pageIndex,
  costumerName,
  orderId,
  status,
}: GetOrdersQuery) {
  const response = await api.get<GetOrdersResponse>('/orders', {
    params: { pageIndex, costumerName, orderId, status },
  })

  return response.data
}
