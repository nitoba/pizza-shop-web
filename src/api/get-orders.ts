import { api } from '@/lib/axios'

export type Status =
  | 'pending'
  | 'canceled'
  | 'processing'
  | 'delivering'
  | 'delivered'

const orderStatusMap = {
  status: '',
  label: '',
}

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

type GetOrdersSearchParams = {
  pageIndex: number
  costumerName?: string
  status?: string
}

export async function getOrders() {
  const response = await api.get<GetOrdersResponse>('/orders', {
    params: { pageIndex: 0 },
  })

  return response.data
}
