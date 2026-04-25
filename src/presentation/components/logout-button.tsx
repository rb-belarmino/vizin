"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/presentation/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-white" onClick={() => signOut({ callbackUrl: "/" })}>
      <LogOut className="mr-2 h-4 w-4" />
      Sair
    </Button>
  );
}
