'use client'

import { UploadDropzone } from '@/lib/uploadthing'
import { useState } from 'react'
import Image from 'next/image'

interface ServiceImageDropzoneProps {
  onUploadComplete: (url: string, key: string) => void
  onUploadError: (error: Error) => void
  onUploadBegin?: () => void
  initialImageUrl?: string
}

export function ServiceImageDropzone({
  onUploadComplete,
  onUploadError,
  onUploadBegin,
  initialImageUrl
}: ServiceImageDropzoneProps) {
  const [imageUrl, setImageUrl] = useState<string | undefined>(initialImageUrl)
  const [isUploading, setIsUploading] = useState(false)

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {isUploading ? (
        <div className="w-full h-full min-h-[200px] flex flex-col items-center justify-center border-muted border-2 border-dashed rounded-lg bg-muted/10 animate-pulse">
          <svg className="animate-spin h-8 w-8 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm font-medium text-muted-foreground">Enviando imagem...</span>
        </div>
      ) : imageUrl ? (
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
          onBeforeUploadBegin={(files) => {
            setIsUploading(true)
            onUploadBegin?.()
            return files
          }}
          onUploadBegin={() => {
            // Also keep this as a fallback
            setIsUploading(true)
            onUploadBegin?.()
          }}
          onClientUploadComplete={res => {
            setIsUploading(false)
            if (res && res.length > 0) {
              const file = res[0]
              setImageUrl(file.ufsUrl)
              onUploadComplete(file.ufsUrl, file.key)
            }
          }}
          onUploadError={(error: Error) => {
            setIsUploading(false)
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
