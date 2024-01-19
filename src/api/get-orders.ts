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

type GetOrdersQuery = {
  pageIndex?: number | null
  costumerName?: string
  status?: string
}

export async function getOrders({ pageIndex }: GetOrdersQuery) {
  const response = await api.get<GetOrdersResponse>('/orders', {
    params: { pageIndex },
  })

  return response.data
}
