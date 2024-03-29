import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Search } from 'lucide-react'
import { useState } from 'react'

import { Order } from '@/api/get-orders'
import { OrderStatus } from '@/components/order-status'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'
import { useHandleChangeOrderStatus } from '@/hooks/use-handle-change-order-status'

import { OrderDetails } from './order-details'

type Props = {
  order: Order
}

export function OrderTableRow({ order }: Props) {
  const [open, setOpen] = useState(false)

  const { ActionStatusButton, CancelActionButton } = useHandleChangeOrderStatus(
    order.orderId,
    order.status,
  )

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
        <ActionStatusButton status={order.status} />
      </TableCell>
      <TableCell>
        <CancelActionButton />
      </TableCell>
    </TableRow>
  )
}
