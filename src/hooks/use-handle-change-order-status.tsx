import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowRight, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'

import { approveOrder } from '@/api/aprove-order'
import { cancelOrder } from '@/api/cancel-order'
import { deliverOrder } from '@/api/deliver-order'
import { dispatchOrder } from '@/api/dispatch-order'
import { GetOrdersResponse, Status } from '@/api/get-orders'
import { Button } from '@/components/ui/button'

export function useHandleChangeOrderStatus(orderId: string, status: Status) {
  const queryClient = useQueryClient()

  const canCancelOrder = ['pending', 'processing'].includes(status)

  function updateStatusOnCache(orderId: string, status: Status) {
    queryClient.setQueriesData<GetOrdersResponse>(
      { queryKey: ['orders'] },
      (cached) => {
        if (cached) {
          return {
            ...cached,
            orders: cached.orders.map((orderCached) => {
              if (orderCached.orderId === orderId) {
                return {
                  ...orderCached,
                  status,
                }
              } else {
                return orderCached
              }
            }),
          }
        }
      },
    )
  }

  const { mutateAsync: cancelOrderFn, isPending: isCanceling } = useMutation({
    mutationFn: cancelOrder,
    onSuccess: (_, { orderId }) => {
      updateStatusOnCache(orderId, 'canceled')
    },
  })

  const { mutateAsync: approveOrderFn, isPending: isApproving } = useMutation({
    mutationFn: approveOrder,
    onSuccess: (_, { orderId }) => {
      updateStatusOnCache(orderId, 'processing')
    },
  })

  const { mutateAsync: dispatchOrderFn, isPending: isDispatching } =
    useMutation({
      mutationFn: dispatchOrder,
      onSuccess: (_, { orderId }) => {
        updateStatusOnCache(orderId, 'delivering')
      },
    })

  const { mutateAsync: deliverOrderFn, isPending: isDelivering } = useMutation({
    mutationFn: deliverOrder,
    onSuccess: (_, { orderId }) => {
      updateStatusOnCache(orderId, 'delivered')
    },
  })

  async function handleCancelOrder() {
    try {
      await cancelOrderFn({ orderId })
      toast.success('Pedido cancelado com sucesso')
    } catch (error) {
      toast.error('Erro ao cancelar pedido, tente novamente!')
    }
  }

  async function handleApproveOrder() {
    try {
      await approveOrderFn({ orderId })
      toast.success('Pedido aprovado com sucesso')
    } catch (error) {
      toast.error('Erro ao aprovar pedido, tente novamente!')
    }
  }

  async function handleDispatchOrder() {
    try {
      await dispatchOrderFn({ orderId })
      toast.success('Pedido enviado com sucesso')
    } catch (error) {
      toast.error('Erro ao enviar pedido, tente novamente!')
    }
  }

  async function handleDeliverOrder() {
    try {
      await deliverOrderFn({ orderId })
      toast.success('Pedido marcado como entregue com sucesso')
    } catch (error) {
      toast.error('Erro ao marcar pedido como entregue, tente novamente!')
    }
  }

  function ActionStatusButton({ status }: { status: Status }) {
    switch (status) {
      case 'pending': {
        return (
          <Button
            variant="outline"
            size="xs"
            onClick={handleApproveOrder}
            disabled={isApproving}
          >
            <ArrowRight className="mr-2 size-3" />
            Aprovar
            {isApproving && <Loader2 className="ml-2 size-4 animate-spin" />}
          </Button>
        )
      }
      case 'processing': {
        return (
          <Button
            variant="outline"
            size="xs"
            onClick={handleDispatchOrder}
            disabled={isDispatching}
          >
            <ArrowRight className="mr-2 size-3" />
            Em entrega
            {isDispatching && <Loader2 className="ml-2 size-4 animate-spin" />}
          </Button>
        )
      }
      case 'delivering': {
        return (
          <Button
            variant="outline"
            size="xs"
            onClick={handleDeliverOrder}
            disabled={isDelivering}
          >
            <ArrowRight className="mr-2 size-3" />
            Entregue
            {isApproving && <Loader2 className="ml-2 size-4 animate-spin" />}
          </Button>
        )
      }
      default: {
        return null
      }
    }
  }

  function CancelActionButton() {
    if (canCancelOrder) {
      return (
        <Button
          variant="ghost"
          size="xs"
          disabled={!canCancelOrder || isCanceling}
          onClick={handleCancelOrder}
        >
          <X className="mr-2 size-3" />
          Cancelar
          {isCanceling && <Loader2 className="ml-2 size-4 animate-spin" />}
        </Button>
      )
    }
  }

  return {
    ActionStatusButton,
    CancelActionButton,
  }
}
