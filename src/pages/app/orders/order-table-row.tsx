import { useMutation, useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ArrowRight, Loader2, Search, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { cancelOrder } from '@/api/cancel-order'
import { GetOrdersResponse, Order } from '@/api/get-orders'
import { OrderStatus } from '@/components/order-status'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'

import { OrderDetails } from './order-details'

type Props = {
  order: Order
}

export function OrderTableRow({ order }: Props) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const canCancelOrder = ['pending', 'processing'].includes(order.status)

  const { mutateAsync, isPending: isCanceling } = useMutation({
    mutationFn: cancelOrder,
    onSuccess: (_, { orderId }) => {
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
                    status: 'canceled',
                  }
                } else {
                  return orderCached
                }
              }),
            }
          }
        },
      )
    },
  })

  async function handleCancelOrder() {
    try {
      await mutateAsync({ orderId: order.orderId })
      toast.success('Pedido cancelado com sucesso')
    } catch (error) {
      toast.error('Erro ao cancelar pedido, tente novamente!')
    }
  }

  return (
    <TableRow>
      <TableCell>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="xs">
              <Search className="size-3" />
              <span className="sr-only">Detalhes do pedido</span>
            </Button>
          </DialogTrigger>

          {open && <OrderDetails orderId={order.orderId} />}
        </Dialog>
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {order.orderId}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatDistanceToNow(order.createdAt, {
          locale: ptBR,
          addSuffix: true,
        })}
      </TableCell>
      <TableCell>
        <OrderStatus status={order.status} />
      </TableCell>
      <TableCell className="font-medium">{order.customerName}</TableCell>
      <TableCell className="font-medium">
        {(order.total / 100).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}
      </TableCell>
      <TableCell>
        <Button variant="outline" size="xs">
          <ArrowRight className="mr-2 size-3" />
          Aprovar
        </Button>
      </TableCell>
      <TableCell>
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
      </TableCell>
    </TableRow>
  )
}
