import { createUploadthing, type FileRouter } from 'uploadthing/next'

const f = createUploadthing()

// Aqui criamos o "Roteador de Arquivos"
export const ourFileRouter = {
  // Vamos criar um "endpoint" chamado serviceImage
  serviceImage: f({
    image: { maxFileSize: '4MB', maxFileCount: 1 }
  }).onUploadComplete(async ({ metadata, file }) => {
    // Este código roda no servidor APÓS a foto chegar na nuvem do Uploadthing
    console.log('Upload finalizado! URL da imagem:', file.url)

    // Eles mandam a URL pronta para nós usarmos no Banco de Dados
    return { uploadedBy: 'vizin-user', url: file.url }
  })
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
