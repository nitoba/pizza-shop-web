import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { getOrderDetails } from '@/api/get-order-details'
import { OrderStatus } from '@/components/order-status'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type Props = {
  orderId: string
}

export function OrderDetails({ orderId }: Props) {
  const { data: orderDetails } = useQuery({
    queryKey: ['order-details', orderId],
    queryFn: () => getOrderDetails({ orderId }),
  })

  function formatCurrency(price: number) {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  return (
    <DialogContent>
      {orderDetails && (
        <>
          <DialogHeader>
            <DialogTitle>Pedido: {orderDetails.id}</DialogTitle>
            <DialogDescription>Detalhes do pedido</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="text-muted-foreground">
                    Status
                  </TableCell>
                  <TableCell className="flex justify-end">
                    <OrderStatus status={orderDetails.status} />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="text-muted-foreground">
                    Cliente
                  </TableCell>
                  <TableCell className="flex justify-end">
                    {orderDetails.customer.name}
                  </TableCell>
                </TableRow>

                {orderDetails.customer.email && (
                  <TableRow>
                    <TableCell className="text-muted-foreground">
                      Email
                    </TableCell>
                    <TableCell className="flex justify-end">
                      {orderDetails.customer.email}
                    </TableCell>
                  </TableRow>
                )}

                {orderDetails.customer.phone && (
                  <TableRow>
                    <TableCell className="text-muted-foreground">
                      Telefone
                    </TableCell>
                    <TableCell className="flex justify-end">
                      {orderDetails.customer.phone}
                    </TableCell>
                  </TableRow>
                )}

                <TableRow>
                  <TableCell className="text-muted-foreground">
                    Realizado há
                  </TableCell>
                  <TableCell className="flex justify-end">
                    {formatDistanceToNow(orderDetails.createdAt, {
                      locale: ptBR,
                    })}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <Separator />

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-right">Qtd.</TableHead>
                  <TableHead className="text-right">Preço</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderDetails.orderItems.map((orderItem) => (
                  <TableRow key={orderItem.id}>
                    <TableCell>{orderItem.product.name}</TableCell>
                    <TableCell className="text-right">
                      {orderItem.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(orderItem.priceInCents / 100)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(
                        (orderItem.priceInCents * orderItem.quantity) / 100,
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

              <TableFooter>
                <TableCell colSpan={3}>Total do pedido</TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(orderDetails.totalInCents / 100)}
                </TableCell>
              </TableFooter>
            </Table>
          </div>
        </>
      )}
    </DialogContent>
  )
}
