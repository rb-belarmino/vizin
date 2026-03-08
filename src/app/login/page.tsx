'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
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
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner' // Impotando o Sonner no Login

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()

    // --- Nova Validação de UX (Campos Vazios) ---
    if (!trimmedEmail) {
      toast.warning('Atenção', {
        description: 'Por favor, preencha o seu endereço de e-mail.'
      })
      return
    }

    if (!trimmedPassword) {
      toast.warning('Atenção', {
        description: 'Por favor, preencha a sua senha.'
      })
      return
    }

    setIsLoading(true)

    const result = await signIn('credentials', {
      email: trimmedEmail,
      password: trimmedPassword,
      redirect: false
    })

    if (result?.error) {
      toast.error('Acesso negado', {
        description:
          'Credenciais inválidas. Verifique seu e-mail e senha e tente novamente.'
      })
      setIsLoading(false)
    } else {
      toast.success('Login realizado com sucesso!', {
        description: 'Redirecionando para o painel...'
      })
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50 p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Bem-vindo ao Vizin
          </CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar o portal do morador.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium leading-none"
              >
                E-mail
              </label>
              <Input
                id="email"
                type="email"
                placeholder="nome@exemplo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium leading-none"
                >
                  Senha
                </label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>

            <p className="px-8 text-center text-sm text-muted-foreground">
              Não tem uma conta ainda?{' '}
              <Link
                href="/register"
                className="font-semibold text-primary hover:underline"
              >
                Cadastre-se
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
