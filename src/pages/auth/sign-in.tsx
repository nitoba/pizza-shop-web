import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2, LogIn } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import * as z from 'zod'

import { signIn } from '@/api/sign-in'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  email: z.string().email('Email obrigatório'),
})

type FormSchemaValues = z.infer<typeof formSchema>

export function SignInPage() {
  const [searchParams] = useSearchParams()

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: signIn,
    onSettled(_, error) {
      if (error) {
        toast.error('Erro ao se autenticar!', {
          description: 'Credenciais incorretas!',
        })
      } else {
        toast.success('Uhul!', {
          description: 'Enviamos um link de autenticação para seu email.',
        })
      }
    },
  })

  const form = useForm<FormSchemaValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: searchParams.get('email') ?? '',
    },
  })

  async function onSubmit({ email }: FormSchemaValues) {
    try {
      await authenticate({ email })
    } catch (error) {}
  }

  const isSubmitting = form.formState.isSubmitting

  return (
    <>
      <Helmet title="Sign In" />
      <div className="p-8">
        <Button
          asChild
          className="absolute right-4 top-4 gap-2"
          variant="outline"
        >
          <Link to="/sign-up">
            Novo estabelecimento
            <LogIn className="size-4" />
          </Link>
        </Button>

        <div className="mx-auto flex w-[90%] flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Acessar o painel
            </h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe suas vendas pelo painel do parceiro!
            </p>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seu e-mail</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="jondoe@gmail.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isSubmitting} className="w-full" type="submit">
                Acessar painel
                {isSubmitting && (
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  )
}
