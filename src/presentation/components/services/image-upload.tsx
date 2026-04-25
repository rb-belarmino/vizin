"use client";

import { UploadButton } from "@/presentation/lib/uploadthing";
import { toast } from "sonner";
import Image from "next/image";
import { X, Camera } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  if (value) {
    return (
      <div className="relative h-60 w-full overflow-hidden rounded-lg border">
        <Image
          src={value}
          alt="Upload preview"
          fill
          className="object-cover"
        />
        <Button
          type="button"
          onClick={() => onChange("")}
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 shadow-lg"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50 hover:bg-slate-50 hover:border-indigo-300 transition-all group">
      <div className="bg-white p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
        <Camera className="h-8 w-8 text-slate-400 group-hover:text-indigo-600" />
      </div>
      
      <p className="text-sm font-medium text-slate-600 mb-4 text-center">
        Adicione uma foto bonita do seu serviço<br/>
        <span className="text-xs text-slate-400 font-normal">Tamanho máximo: 4MB</span>
      </p>

      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          if (res?.[0]) {
            const url = res[0].ufsUrl || res[0].url;
            onChange(url);
            toast.success("Foto enviada com sucesso!");
          }
        }}
        onUploadError={(error: Error) => {
          toast.error(`Erro no upload: ${error.message}`);
        }}
        appearance={{
          button: "bg-indigo-600 hover:bg-indigo-700 ut-uploading:cursor-not-allowed ut-ready:bg-indigo-600",
          allowedContent: "hidden",
        }}
        content={{
          button({ ready }) {
            if (ready) return "Selecionar Imagem";
            return "Carregando...";
          },
        }}
      />
    </div>
  );
}
