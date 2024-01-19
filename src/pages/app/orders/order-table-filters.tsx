import { zodResolver } from '@hookform/resolvers/zod'
import { Search, X } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const orderFiltersSchema = z.object({
  orderId: z.string().optional(),
  costumerName: z.string().optional(),
  status: z.string().optional(),
})

type OrderFiltersSchema = z.infer<typeof orderFiltersSchema>

export function OrderTableFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const orderId = searchParams.get('orderId')
  const costumerName = searchParams.get('costumerName')
  const status = searchParams.get('status')

  const { control, register, handleSubmit, reset } =
    useForm<OrderFiltersSchema>({
      resolver: zodResolver(orderFiltersSchema),
      defaultValues: {
        orderId: orderId ?? '',
        costumerName: costumerName ?? '',
        status: status ?? 'all',
      },
    })

  function handleFilter({ orderId, costumerName, status }: OrderFiltersSchema) {
    setSearchParams((prev) => {
      if (orderId) {
        prev.set('orderId', orderId)
      } else {
        prev.delete('orderId')
      }

      if (costumerName) {
        prev.set('costumerName', costumerName)
      } else {
        prev.delete('costumerName')
      }

      if (status) {
        prev.set('status', status)
      } else {
        prev.delete('status')
      }

      prev.set('page', '1')

      return prev
    })
  }

  function handleRemoveFilters() {
    setSearchParams((prev) => {
      prev.delete('orderId')
      prev.delete('costumerName')
      prev.delete('status')
      prev.set('page', '1')
      return prev
    })
    reset({ status: 'all', costumerName: '', orderId: '' })
  }

  return (
    <form
      className="flex items-center gap-2"
      onSubmit={handleSubmit(handleFilter)}
    >
      <span className="text-sm font-semibold">Filtros:</span>
      <Input
        placeholder="ID do pedido"
        className="h-8 w-auto"
        {...register('orderId')}
      />
      <Input
        placeholder="Nome do cliente"
        className="h-8 w-[320px]"
        {...register('costumerName')}
      />

      <Controller
        control={control}
        name="status"
        render={({ field: { value, onChange, name, disabled } }) => (
          <Select
            defaultValue={value}
            value={value}
            onValueChange={onChange}
            name={name}
            disabled={disabled}
          >
            <SelectTrigger className="h-8 w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={'all'}>Todos status</SelectItem>
              <SelectItem value={'pending'}>Pendente</SelectItem>
              <SelectItem value={'canceled'}>Cancelado</SelectItem>
              <SelectItem value={'processing'}>Em preparo</SelectItem>
              <SelectItem value={'delivering'}>Em entrega</SelectItem>
              <SelectItem value={'delivered'}>Entregue</SelectItem>
            </SelectContent>
          </Select>
        )}
      />

      <Button type="submit" size={'xs'} variant="secondary">
        <Search className="mr-2 size-4" />
        Filtrar resultados
      </Button>
      <Button
        type="button"
        size={'xs'}
        variant="outline"
        onClick={handleRemoveFilters}
      >
        <X className="mr-2 size-4" />
        Remover filtros
      </Button>
    </form>
  )
}
