'use client'

import React from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const categories = [
  { id: 'Gastronomia', emoji: '🍽️' },
  { id: 'Reformas', emoji: '🔨' },
  { id: 'Aulas', emoji: '📚' },
  { id: 'Beleza', emoji: '💇' },
  { id: 'Saúde', emoji: '🏥' },
  { id: 'Outros', emoji: '⭐' }
]

export function CategoryPills() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get('category')

  const handleSelect = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (currentCategory === categoryId) {
      params.delete('category')
    } else {
      params.set('category', categoryId)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const clearCategory = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('category')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Filtrar por categoria"
    >
      <button
        onClick={clearCategory}
        id="category-all-btn"
        aria-pressed={!currentCategory}
        className={cn(
          'px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border',
          !currentCategory
            ? 'brand-gradient text-white border-transparent shadow-md scale-105'
            : 'bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
        )}
      >
        Todos
      </button>
      {categories.map(cat => {
        const isActive = currentCategory === cat.id
        return (
          <button
            key={cat.id}
            onClick={() => handleSelect(cat.id)}
            id={`category-${cat.id.toLowerCase()}-btn`}
            aria-pressed={isActive}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border flex items-center gap-1.5',
              isActive
                ? 'brand-gradient text-white border-transparent shadow-md scale-105'
                : 'bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground hover:scale-105'
            )}
          >
            <span role="img" aria-hidden="true">
              {cat.emoji}
            </span>
            {cat.id}
          </button>
        )
      })}
    </div>
  )
}
