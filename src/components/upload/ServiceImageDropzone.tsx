'use client';

import { UploadDropzone } from "@/lib/uploadthing";
import { useState } from "react";
import Image from "next/image";

interface ServiceImageDropzoneProps {
  onUploadComplete: (url: string, key: string) => void;
  onUploadError: (error: Error) => void;
  initialImageUrl?: string;
}

export function ServiceImageDropzone({
  onUploadComplete,
  onUploadError,
  initialImageUrl,
}: ServiceImageDropzoneProps) {
  const [imageUrl, setImageUrl] = useState<string | undefined>(initialImageUrl);

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4">
      {imageUrl ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border">
          <Image
            src={imageUrl}
            alt="Service Portfolio Image"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
          <button
            type="button"
            onClick={() => setImageUrl(undefined)}
            className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-2 rounded-md hover:bg-destructive/90 transition-colors"
          >
            Remover
          </button>
        </div>
      ) : (
        <UploadDropzone
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            if (res && res.length > 0) {
              const file = res[0];
              setImageUrl(file.ufsUrl);
              onUploadComplete(file.ufsUrl, file.key);
            }
          }}
          onUploadError={(error: Error) => {
            onUploadError(error);
          }}
          appearance={{
            container: "border-muted border-2 border-dashed rounded-lg p-8",
            uploadIcon: "text-muted-foreground",
            label: "text-primary hover:text-primary/80 font-medium",
            allowedContent: "text-muted-foreground text-sm",
            button: "bg-primary text-primary-foreground hover:bg-primary/90",
          }}
        />
      )}
    </div>
  );
}
