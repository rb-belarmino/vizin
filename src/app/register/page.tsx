'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner' // Impotando o Sonner no Cadastro

import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/presentation/components/ui/card'
import { registerUser } from '@/app/actions/auth-actions'

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const fullName = (formData.get('fullName') as string).trim()
    const email = (formData.get('email') as string).trim()
    const block = (formData.get('block') as string).trim()
    const number = (formData.get('number') as string).trim()
    const password = (formData.get('password') as string).trim()

    if (!fullName || !email || !block || !number || !password) {
      toast.warning('Atenção', {
        description: 'Por favor, preencha todos os campos do formulário.'
      })
      return
    }

    if (password.length < 6) {
      toast.warning('Senha fraca', {
        description: 'A senha deve ter no mínimo 6 caracteres.'
      })
      return
    }

    setIsLoading(true)

    // Call the server action to insert the user in DB
    const response = await registerUser(formData)

    if (response.error) {
      // Se o email já existir no banco, a action vai retornar o erro aqui.
      toast.error('Erro no cadastro', {
        description: response.error
      })
      setIsLoading(false)
      return
    }

    // If registration succeeded, automatically sign them in
    const signInResult = await signIn('credentials', {
      email,
      password,
      redirect: false
    })

    if (signInResult?.error) {
      toast.error('Conta criada, mas falhou no login automático.', {
        description: 'Por favor, faça login manualmente.'
      })
      router.push('/login?registered=true')
    } else {
      toast.success('Cadastro finalizado!', {
        description: 'Sua conta Vizin foi criada com sucesso.'
      })
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50 p-4">
      <Card className="w-full max-w-lg shadow-lg border-0">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Criar sua conta Vizin
          </CardTitle>
          <CardDescription>
            Cadastre-se para acessar os serviços do seu condomínio.
          </CardDescription>
        </CardHeader>

        {/* noValidate para desligar validação nativa feia */}
        <form onSubmit={onSubmit} noValidate>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="fullName"
                className="text-sm font-medium leading-none"
              >
                Nome completo
              </label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Ex: João da Silva"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium leading-none"
              >
                E-mail
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nome@exemplo.com"
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="block"
                  className="text-sm font-medium leading-none"
                >
                  Bloco / Torre
                </label>
                <Input
                  id="block"
                  name="block"
                  type="text"
                  placeholder="Ex: A, B, 1, 2..."
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="number"
                  className="text-sm font-medium leading-none"
                >
                  Nº do Apartamento
                </label>
                <Input
                  id="number"
                  name="number"
                  type="text"
                  placeholder="Ex: 101, 1403..."
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium leading-none"
              >
                Senha
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Mínimo de 6 caracteres"
                disabled={isLoading}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                'Finalizar Cadastro'
              )}
            </Button>

            <p className="px-8 text-center text-sm text-muted-foreground">
              Já possui uma conta?{' '}
              <Link
                href="/login"
                className="font-semibold text-primary hover:underline"
              >
                Faça login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
