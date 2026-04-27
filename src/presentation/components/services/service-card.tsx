"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/presentation/components/ui/card";
import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import { MessageCircle, Globe, UtensilsCrossed, Hammer, BookOpen, Sparkles, HeartPulse, Package } from "lucide-react";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { cn } from "@/presentation/lib/utils";
import Image from "next/image";
import ShareButton from "@/presentation/components/share-button";

export const categoryColors: Record<string, string> = {
  Gastronomia: "bg-orange-100 text-orange-700 border-orange-200",
  Reformas: "bg-blue-100 text-blue-700 border-blue-200",
  Aulas: "bg-purple-100 text-purple-700 border-purple-200",
  Beleza: "bg-pink-100 text-pink-700 border-pink-200",
  Saúde: "bg-red-100 text-red-700 border-red-200",
  Outros: "bg-slate-100 text-slate-700 border-slate-200",
};

export const categoryIcons: Record<string, any> = {
  Gastronomia: UtensilsCrossed,
  Reformas: Hammer,
  Aulas: BookOpen,
  Beleza: Sparkles,
  Saúde: HeartPulse,
  Outros: Package,
};

interface ServiceCardProps {
  service: {
    id: string;
    title: string;
    description: string;
    category: string;
    serviceType: string;
    priceInfo?: string | null;
    whatsapp?: string | null;
    website?: string | null;
    imageUrl?: string | null;
    instagram?: string | null;
    facebook?: string | null;
  };
}

export function ServiceCard({ service }: ServiceCardProps) {
  const Icon = categoryIcons[service.category] || categoryIcons.Outros;
  const colorClass = categoryColors[service.category] || categoryColors.Outros;

  return (
    <Card className="flex flex-col h-full border-border/50 hover:shadow-lg transition-all duration-300 group overflow-hidden">
      {/* Service Image Section */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden border-b">
        {service.imageUrl ? (
          <Image
            src={service.imageUrl}
            alt={service.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className={cn(
            "flex flex-col items-center justify-center h-full transition-colors duration-500",
            colorClass
          )}>
            <Icon className="h-12 w-12 opacity-40 animate-pulse" />
            <span className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Vizin</span>
          </div>
        )}
      </div>

      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <div className="flex gap-2">
            <Badge 
              className={cn(
                "font-medium border shadow-none flex items-center gap-1.5",
                colorClass
              )}
            >
              <Icon size={14} data-testid="category-icon" />
              {service.category}
            </Badge>
            <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium border-transparent">
              {service.serviceType}
            </Badge>
          </div>
          {service.priceInfo && (
            <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold">
              {service.priceInfo}
            </Badge>
          )}
        </div>
        <CardTitle className="text-xl line-clamp-1">
          {service.title}
        </CardTitle>
        <CardDescription className="line-clamp-3 mt-2 text-sm">
          {service.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2 pt-4 border-t bg-muted/20">
        {service.whatsapp && (
          <Button
            variant="outline"
            size="icon"
            className="text-emerald-500 border-emerald-500 hover:bg-emerald-50"
            asChild
            data-testid="whatsapp-button"
          >
            <a
              href={`https://wa.me/${service.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact on WhatsApp"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
          </Button>
        )}

        {service.website && (
          <Button variant="outline" size="icon" className="text-indigo-600 border-indigo-200" asChild>
            <a href={service.website} target="_blank" rel="noopener noreferrer">
              <Globe className="h-5 w-5" />
            </a>
          </Button>
        )}

        {service.instagram && (
          <Button variant="ghost" size="icon" className="text-pink-600" asChild>
            <a href={`https://instagram.com/${service.instagram}`} target="_blank" rel="noopener noreferrer">
              <FaInstagram className="h-5 w-5" />
            </a>
          </Button>
        )}

        <ShareButton 
          title={service.title} 
          id={service.id} 
        />
      </CardFooter>
    </Card>
  );
}
