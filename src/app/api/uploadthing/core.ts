import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/infrastructure/auth/auth";

const f = createUploadthing();

// FileRouter para o Vizin
export const ourFileRouter = {
  // Rota de upload para imagens de serviço
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    // Middleware de autenticação
    .middleware(async () => {
      try {
        console.log("[UPLOADTHING DEBUG] Iniciando middleware de upload...");
        const session = await auth();
        console.log("[UPLOADTHING DEBUG] Sessão recuperada:", !!session);

        // Se não estiver logado, lança erro para impedir o upload
        if (!session?.user) {
          console.error("[UPLOADTHING DEBUG] Tentativa de upload não autorizada!");
          throw new Error("Unauthorized");
        }

        // O que retornar aqui fica disponível no onUploadComplete
        return { userId: session.user.id };
      } catch (error) {
        console.error("[UPLOADTHING DEBUG] Erro no middleware:", error);
        throw error;
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload completo para o usuário:", metadata.userId);
      console.log("URL do arquivo:", file.url);

      // Retornamos os metadados para o frontend se necessário
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
