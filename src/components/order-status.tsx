import { Status } from '@/api/get-orders'

type Props = {
  status: Status
}

const orderStatusMap: Record<Status, string> = {
  pending: 'Pendente',
  processing: 'Em preparo',
  canceled: 'Cancelado',
  delivering: 'Em entrega',
  delivered: 'Entregue',
}

export function OrderStatus({ status }: Props) {
  return (
    <div className="flex items-center gap-2">
      {status === 'pending' && (
        <span className="size-2 rounded-full bg-slate-400" />
      )}

      {status === 'canceled' && (
        <span className="size-2 rounded-full bg-rose-400" />
      )}

      {status === 'delivered' && (
        <span className="size-2 rounded-full bg-emerald-500" />
      )}

      {['processing', 'delivering'].includes(status) && (
        <span className="size-2 rounded-full bg-amber-400" />
      )}
      <span className="font-medium text-muted-foreground">
        {orderStatusMap[status]}
      </span>
    </div>
  )
}
