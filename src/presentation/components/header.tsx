import Link from "next/link";
import { auth } from "@/infrastructure/auth/auth";
import { Button } from "@/presentation/components/ui/button";

export default async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 max-w-7xl">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-indigo-600 tracking-tight">Vizin</span>
          </Link>
        </div>

        <nav className="flex items-center gap-4">
          {session?.user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-700 hidden sm:inline-block">
                Olá, Ap {session.user.unitNumber || "101"}
              </span>
              <Button variant="default" className="bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
                <Link href="/dashboard">
                  Dashboard
                </Link>
              </Button>
            </div>
          ) : (
            <Button variant="outline" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50" asChild>
              <Link href="/login">
                Entrar
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
