'use client'

import { UploadDropzone } from '@/lib/uploadthing'
import { useState } from 'react'
import Image from 'next/image'

interface ServiceImageDropzoneProps {
  onUploadComplete: (url: string, key: string) => void
  onUploadError: (error: Error) => void
  initialImageUrl?: string
}

export function ServiceImageDropzone({
  onUploadComplete,
  onUploadError,
  initialImageUrl
}: ServiceImageDropzoneProps) {
  const [imageUrl, setImageUrl] = useState<string | undefined>(initialImageUrl)

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {imageUrl ? (
        <div className="relative w-full h-full min-h-[200px] rounded-lg overflow-hidden border border-border group">
          <Image
            src={imageUrl}
            alt="Service Portfolio Image"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={() => setImageUrl(undefined)}
              className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md hover:bg-destructive/90 transition-colors font-medium shadow-sm"
            >
              Remover Imagem
            </button>
          </div>
        </div>
      ) : (
        <UploadDropzone
          endpoint="imageUploader"
          onClientUploadComplete={res => {
            if (res && res.length > 0) {
              const file = res[0]
              setImageUrl(file.ufsUrl)
              onUploadComplete(file.ufsUrl, file.key)
            }
          }}
          onUploadError={(error: Error) => {
            onUploadError(error)
          }}
          content={{
            button: 'Escolher imagem',
            label: 'Arraste a imagem ou clique para selecionar',
            allowedContent: 'Imagens até 2MB (JPG, PNG)',
          }}
          appearance={{
            container:
              'w-full h-full min-h-[200px] border-muted border-2 border-dashed rounded-lg bg-muted/5 hover:bg-muted/10 transition-colors flex flex-col items-center justify-center py-8 cursor-pointer',
            uploadIcon: 'text-muted-foreground w-12 h-12 mb-4',
            label: 'text-foreground font-medium text-lg',
            allowedContent: 'text-muted-foreground text-sm mt-2',
            button:
              'bg-primary text-primary-foreground hover:bg-primary/90 mt-4 text-sm px-6'
          }}
        />
      )}
    </div>
  )
}
