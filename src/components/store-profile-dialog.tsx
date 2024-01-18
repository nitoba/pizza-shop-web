import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import {
  getManagedRestaurant,
  GetManagedRestaurantResponse,
} from '@/api/get-managed-restaurant'
import { updateProfile } from '@/api/update-profile'

import { Button } from './ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'

const formSchema = z.object({
  name: z.string().min(1, 'Nome é um campo obrigatório'),
  description: z.string(),
})

type FormSchemaValues = z.infer<typeof formSchema>

export function StoreProfileDialog() {
  const queryClient = useQueryClient()
  const { data: managedRestaurant } = useQuery({
    queryKey: ['managed-restaurant'],
    queryFn: getManagedRestaurant,
  })

  const { mutateAsync: handleUpdateProfile } = useMutation({
    mutationFn: updateProfile,
  })

  const form = useForm<FormSchemaValues>({
    resolver: zodResolver(formSchema),
    values: {
      name: managedRestaurant?.name ?? '',
      description: managedRestaurant?.description ?? '',
    },
  })

  async function onSubmit({ name, description }: FormSchemaValues) {
    try {
      await handleUpdateProfile({ name, description })
      toast.success('Perfil atualizado com sucesso!')
      //   Update the cached data instead to do another request to backend
      queryClient.setQueryData<GetManagedRestaurantResponse>(
        ['managed-restaurant'],
        (cached) => {
          if (cached) {
            return {
              ...cached,
              name,
              description,
            }
          }
        },
      )
    } catch (e) {
      toast.error('Erro ao atualizar o perfil, tente novamente')
    }
  }

  const isSubmitting = form.formState.isSubmitting

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Perfil da loja</DialogTitle>
        <DialogDescription>
          Atualize as informações do seu estabelecimento visíveis ao seu cliente
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">Nome</FormLabel>
                <FormControl>
                  <Input
                    className="col-span-3"
                    placeholder="Seu nome"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="col-span-3 text-right" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">Descrição</FormLabel>
                <FormControl>
                  <Textarea
                    className="col-span-3"
                    placeholder="Descrição do loja"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="col-span-3 text-right" />
              </FormItem>
            )}
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              Salvar
              {isSubmitting && (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}
