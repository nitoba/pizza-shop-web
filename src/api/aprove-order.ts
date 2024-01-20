import { api } from '@/lib/axios'

type ApproveOrderParams = {
  orderId: string
}

export async function approveOrder({ orderId }: ApproveOrderParams) {
  await api.patch(`/orders/${orderId}/approve`)
}
