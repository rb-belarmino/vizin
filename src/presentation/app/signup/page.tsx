"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { registerUserAction } from "@/infrastructure/actions/auth-actions";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/presentation/components/ui/form";

const signupSchema = z.object({
  fullName: z.string().min(1, "O nome completo é obrigatório"),
  email: z.string().email("E-mail inválido"),
  unitNumber: z.string().min(1, "O número da unidade é obrigatório").regex(/^\d+$/, "Apenas números são permitidos"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      unitNumber: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      // Chama a Server Action do backend
      const result = await registerUserAction(data);
      
      if (!result.success) {
        setErrorMsg(result.message);
        return;
      }

      // Faz login automático após o cadastro
      const signInResult = await signIn("credentials", {
        redirect: false,
        email: result.data?.email,
        password: result.data?.password,
      });

      if (signInResult?.error) {
        setErrorMsg("Conta criada, mas erro no login automático. Faça o login manualmente.");
      } else {
        router.push("/dashboard");
      }
      
    } catch (error) {
      console.error(error);
      setErrorMsg("Ocorreu um erro interno. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-indigo-600">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
            Criar Conta
          </CardTitle>
          <CardDescription>
            Cadastre-se para anunciar seus serviços no Vizin
          </CardDescription>
        </CardHeader>
        <CardContent>
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm font-medium text-center">
              {errorMsg}
            </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome completo" {...field} />
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
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unitNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número da Unidade (Apartamento)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 106" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors mt-6"
                disabled={isLoading}
              >
                {isLoading ? "Cadastrando..." : "Cadastrar"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center border-t p-4">
          <p className="text-sm text-slate-600">
            Já tem conta?{" "}
            <Link href="/login" className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline">
              Entre aqui
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
