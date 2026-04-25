"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/presentation/components/ui/input";
import { Badge } from "@/presentation/components/ui/badge";
import { cn } from "@/presentation/lib/utils";

const CATEGORIES = [
  "Todos",
  "Gastronomia",
  "Reformas",
  "Aulas",
  "Beleza",
  "Saúde",
  "Outros",
];

export default function HomeFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "Todos";
  const currentSearch = searchParams.get("search") || "";

  const [searchTerm, setSearchTerm] = useState(currentSearch);

  // Debounced Search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleFilterChange("search", searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value && value !== "Todos") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Reset page if needed, but here we don't have pagination yet
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto mb-10">
      {/* Search Input */}
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
        <Input
          placeholder="O que você está procurando hoje? (ex: Manicure, Bolo, Aula...)"
          className="pl-10 h-12 text-lg shadow-sm border-slate-200 focus-visible:ring-indigo-600 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleFilterChange("category", cat)}
            className="focus:outline-none"
          >
            <Badge
              variant={currentCategory === cat ? "default" : "outline"}
              className={cn(
                "px-4 py-1.5 text-sm font-medium cursor-pointer transition-all",
                currentCategory === cat
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white border-transparent shadow-md scale-105"
                  : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50"
              )}
            >
              {cat}
            </Badge>
          </button>
        ))}
      </div>
    </div>
  );
}
