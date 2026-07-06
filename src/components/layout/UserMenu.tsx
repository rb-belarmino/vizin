"use client"

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { LogOut, User, LayoutDashboard, ChevronDown } from 'lucide-react'

export function UserMenu({ 
  userName,
  userEmail,
  signOutAction 
}: { 
  userName: string,
  userEmail?: string | null,
  signOutAction?: () => void 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const initial = userName?.charAt(0).toUpperCase() ?? '?'
  const displayName = userName ?? userEmail ?? 'Usuário'

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 group hover:bg-muted/50 p-1 pr-2 rounded-full transition-colors cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      >
        <div className="w-7 h-7 rounded-full brand-gradient flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
          <span className="text-white text-[11px] font-bold">
            {initial}
          </span>
        </div>
        <span className="hidden sm:inline font-medium transition-colors">
          {displayName}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-card p-1 shadow-xl animate-scale-in flex flex-col gap-1 z-50 transform origin-top-right transition-all ring-1 ring-black/5 dark:ring-white/10">
          <div className="px-3 py-2.5 border-b border-border/50 mb-1 flex flex-col gap-0.5">
            <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
            {userEmail && <p className="text-xs text-muted-foreground truncate">{userEmail}</p>}
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-primary/5 hover:text-primary transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <LayoutDashboard className="w-4 h-4 text-primary/70" />
            Painel de serviços
          </Link>
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-primary/5 hover:text-primary transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <User className="w-4 h-4 text-primary/70" />
            Meu Perfil
          </Link>
          
          {signOutAction && (
            <>
              <div className="my-1 border-t border-border/50" />
              <form action={signOutAction} className="w-full">
                <button
                  type="submit"
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  )
}
