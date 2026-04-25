"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Textarea } from "@/presentation/components/ui/textarea";
import { Switch } from "@/presentation/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/presentation/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/presentation/components/ui/card";

// Formata o valor digitado para exibir (XX) XXXXX-XXXX
const formatWhatsApp = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
};

const serviceSchema = z.object({
  title: z.string().min(3, "O título precisa ter pelo menos 3 caracteres."),
  description: z.string().min(10, "A descrição precisa ser mais detalhada (mínimo 10 caracteres)."),
  serviceType: z.enum(["A domicílio", "No meu apê", "Portaria"], {
    required_error: "Selecione o tipo de atendimento",
  }),
  socialLink: z.string().url("URL inválida").optional().or(z.literal("")),
  whatsapp: z.string().optional().or(z.literal("")),
  isPublic: z.boolean().default(true),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

export default function NewServicePage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      description: "",
      serviceType: undefined,
      socialLink: "",
      whatsapp: "",
      isPublic: true,
    },
  });

  const onSubmit = async (data: ServiceFormValues) => {
    setIsLoading(true);
    try {
      // Limpa a máscara do WhatsApp (deixa apenas números) antes de enviar para a Action
      const payload = {
        ...data,
        whatsapp: data.whatsapp ? data.whatsapp.replace(/\D/g, "") : null,
      };

      console.log("Submitting service payload:", payload);

      // TODO: Conectar com a Action real do Backend quando disponível
      // const result = await createServiceAction(payload);
      
      // Simulação da Action
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Serviço anunciado com sucesso!");
      router.push("/dashboard");
      router.refresh();
      
    } catch (error) {
      console.error(error);
      toast.error("Ocorreu um erro ao salvar o serviço.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 max-w-3xl">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4 -ml-4 text-slate-500 hover:text-slate-900">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Dashboard
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg border-t-4 border-t-indigo-600">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-900">Anunciar Novo Serviço</CardTitle>
          <CardDescription>
            Preencha os detalhes do serviço que você deseja oferecer aos seus vizinhos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título do Serviço <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Manicure, Aulas de Inglês, Conserto de PC..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva detalhadamente o que você faz..." 
                        className="resize-none h-32"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Seja claro e atraente para convencer seus vizinhos.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Atendimento <span className="text-red-500">*</span></FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione como você atende" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="A domicílio">A domicílio (no apê do cliente)</SelectItem>
                        <SelectItem value="No meu apê">No meu apê</SelectItem>
                        <SelectItem value="Portaria">Portaria (entrega/retirada)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp (Opcional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="(11) 99999-9999" 
                          {...field} 
                          onChange={(e) => {
                            const formatted = formatWhatsApp(e.target.value);
                            field.onChange(formatted);
                          }}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>Para contato direto</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="socialLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link Útil / Rede Social (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: https://instagram.com/seu_perfil" {...field} />
                      </FormControl>
                      <FormDescription>Instagram, Portfólio, etc.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-slate-50">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base font-medium">
                        Publicar Serviço
                      </FormLabel>
                      <FormDescription>
                        Deixe ativado para que o serviço fique visível na Vitrine Pública.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-emerald-500"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8"
                  disabled={isLoading}
                >
                  {isLoading ? "Salvando..." : "Anunciar Serviço"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
