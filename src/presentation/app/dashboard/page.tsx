import prisma from "@/infrastructure/db/client";
import { auth } from "@/infrastructure/auth/auth";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/presentation/components/logout-button";
import { Button } from "@/presentation/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/presentation/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/presentation/components/ui/table";
import { Badge } from "@/presentation/components/ui/badge";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  
  // @ts-ignore - a tipagem customizada do id está no session
  const userId = session?.user?.id;

  if (!session || !userId) {
    redirect("/login");
  }

  const services = await prisma.service.findMany({
    where: { userId: userId as string },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Olá, Ap {session?.user?.unitNumber || "101"}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie seus serviços anunciados no Vizin.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
            <Link href="/dashboard/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Anunciar Novo Serviço
            </Link>
          </Button>
          <LogoutButton />
        </div>
      </div>

      <Card className="shadow-sm border-border">
        <CardHeader>
          <CardTitle>Meus Serviços</CardTitle>
          <CardDescription>
            Você tem {services.length} serviço(s) cadastrado(s).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              Você ainda não possui serviços cadastrados.
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Visibilidade</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.title}</TableCell>
                      <TableCell>{service.serviceType}</TableCell>
                      <TableCell>{service.priceInfo || "-"}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={service.isPublic ? "default" : "secondary"}
                          className={service.isPublic ? "bg-emerald-500 hover:bg-emerald-600" : ""}
                        >
                          {service.isPublic ? "Público" : "Oculto"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-indigo-600">
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
