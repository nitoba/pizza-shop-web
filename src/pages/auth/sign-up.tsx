import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, LogIn } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import * as z from 'zod'

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
  restaurantName: z.string().min(4),
  managerName: z.string().min(4),
  phone: z.string().min(6),
  email: z.string().email('Email obrigatório'),
})

type FormSchemaValues = z.infer<typeof formSchema>

export function SignUpPage() {
  const navigate = useNavigate()
  const form = useForm<FormSchemaValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(values: FormSchemaValues) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast.success('Uhul!', {
      description: 'Restaurante cadastrado com sucesso!',
      action: {
        label: 'Login',
        onClick: () => navigate('/sign-in'),
      },
    })
  }

  const isSubmitting = form.formState.isSubmitting

  return (
    <>
      <Helmet title="Cadrastro" />
      <div className="p-8">
        <Button
          asChild
          className="absolute right-4 top-4 gap-2"
          variant="outline"
        >
          <Link to="/sign-in">
            Fazer login <LogIn className="size-4" />
          </Link>
        </Button>
        <div className="mx-auto flex w-3/4 flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Criar conta grátis
            </h1>
            <p className="text-sm text-muted-foreground">
              Seja um parceiro de comece suas vendas
            </p>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="restaurantName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do estabelecimento</FormLabel>
                    <FormControl>
                      <Input placeholder="Restaurante" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="managerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seu nome</FormLabel>
                    <FormControl>
                      <Input placeholder="JonDoe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seu celular</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="(XX) XXXXX-XXXX"
                        type="tel"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                Finalizar cadastro
                {isSubmitting && (
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                )}
              </Button>

              <p className="px-6 text-center text-sm leading-relaxed text-muted-foreground">
                Ao continuar, você concorda com os nossos{' '}
                <a href="" className="underline underline-offset-4">
                  termos serviços
                </a>
                e{' '}
                <a href="" className="underline underline-offset-4">
                  políticas de privacidade
                </a>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </>
  )
}
