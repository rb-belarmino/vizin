'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/presentation/components/ui/button'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => signOut({ callbackUrl: '/' })}
      className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sair
    </Button>
  )
}
