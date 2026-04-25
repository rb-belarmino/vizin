"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import { toast } from "sonner";

interface ShareButtonProps {
  title: string;
  serviceId: string;
}

export default function ShareButton({ title, serviceId }: ShareButtonProps) {
  const handleShare = async () => {
    // Para o MVP, usamos a URL da Home. No futuro, podemos usar uma rota específica /service/[id]
    const shareUrl = window.location.origin + "/?id=" + serviceId;
    const shareData = {
      title: "Vizin - Vitrine de Serviços",
      text: `Veja este serviço no Vizin: ${title}`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copiado para a área de transferência!");
      }
    } catch (error) {
      // Ignora erro se o usuário cancelar o compartilhamento
      if ((error as Error).name !== "AbortError") {
        toast.error("Não foi possível compartilhar o serviço.");
      }
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="ml-auto text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
      onClick={handleShare}
      title="Compartilhar serviço"
    >
      <Share2 className="h-4 w-4" />
    </Button>
  );
}
