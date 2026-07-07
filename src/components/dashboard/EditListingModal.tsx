"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ServiceImageDropzone } from "@/components/upload/ServiceImageDropzone";
import {
  ListingSchema,
  ListingSchemaType,
} from "@/actions/schemas/listing-schema";
import { updateListingAction } from "@/actions/listing-actions";
import { Listing } from "@/core/entities/listing";

const CATEGORIES = [
  "Gastronomia",
  "Reformas",
  "Aulas",
  "Beleza",
  "Saúde",
  "Outros",
] as const;

interface UploadState {
  url: string;
  key: string;
}

interface EditListingModalProps {
  listing: Listing;
  open: boolean;
  onClose: () => void;
}

export function EditListingModal({
  listing,
  open,
  onClose,
}: EditListingModalProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [uploadState, setUploadState] = useState<UploadState | null>(null);
  const [isUploading] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ListingSchemaType>({
    resolver: zodResolver(ListingSchema) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    defaultValues: {
      title: listing.title,
      description: listing.description,
      categoryId: listing.categoryId,
      priceBaseline: listing.priceBaseline ?? "",
      whatsappNumber: listing.whatsappNumber ?? "",
      instagramHandle: listing.instagramHandle ?? "",
      visibilityStatus: (listing.visibilityStatus as "Public" | "Private") ?? "Public",
      portfolioImageUrl: listing.portfolioImageUrl,
      portfolioImageKey: listing.portfolioImageKey,
    },
  });

  // Reset form when listing changes (e.g., different modal opened)
  useEffect(() => {
    if (open) {
      reset({
        title: listing.title,
        description: listing.description,
        categoryId: listing.categoryId,
        priceBaseline: listing.priceBaseline ?? "",
        whatsappNumber: listing.whatsappNumber ?? "",
        instagramHandle: listing.instagramHandle ?? "",
        visibilityStatus: (listing.visibilityStatus as "Public" | "Private") ?? "Public",
        portfolioImageUrl: listing.portfolioImageUrl,
        portfolioImageKey: listing.portfolioImageKey,
      });
      
    }
  }, [open, listing, reset]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Prevent body scroll while modal open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const currentImageUrl = uploadState?.url ?? listing.portfolioImageUrl;
  const currentImageKey = uploadState?.key ?? listing.portfolioImageKey;

  const onSubmit = async (data: ListingSchemaType) => {
    setServerError(null);
    setSuccessMsg(null);

    const result = await updateListingAction(listing.id, {
      ...data,
      portfolioImageUrl: currentImageUrl,
      portfolioImageKey: currentImageKey,
    });

    if (result.error) {
      setServerError(result.error);
    } else {
      setSuccessMsg("Serviço atualizado com sucesso!");
      router.refresh();
      // Close after short delay so user sees the success message
      setTimeout(() => {
        onClose();
      }, 1200);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "oklch(0 0 0 / 0.5)", backdropFilter: "blur(4px)" }}
      role="dialog"
      aria-modal="true"
      aria-label="Editar serviço"
    >
      {/* Modal panel */}
      <div className="w-full max-w-[900px] max-h-[90vh] overflow-y-auto rounded-2xl bg-card border shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b sticky top-0 bg-card z-10">
          <div>
            <h2 className="text-base font-semibold">Editar serviço</h2>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{listing.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            id="edit-modal-close-btn"
            className="w-7 h-7 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Fechar"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
            </svg>
          </button>
        </div>

        {/* Form body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="px-6 py-5 space-y-5"
          id="edit-listing-form"
        >
          {/* Feedback */}
          {serverError && (
            <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive animate-fade-in">
              {serverError}
            </div>
          )}
          {successMsg && (
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-2 animate-fade-in">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
              </svg>
              {successMsg}
            </div>
          )}

          {/* Current image preview */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Imagem do serviço
            </label>
            <ServiceImageDropzone
              initialImageUrl={currentImageUrl}
              onUploadComplete={(url, key) => {
                setUploadState({ url, key });
                setValue("portfolioImageUrl", url);
                setValue("portfolioImageKey", key);
              }}
              onUploadError={(error) => {
                setServerError(`Erro no upload: ${error.message}`);
              }}
            />
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label htmlFor="edit-title" className="block text-sm font-medium">
              Título <span className="text-destructive">*</span>
            </label>
            <input
              id="edit-title"
              {...register("title")}
              type="text"
              className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label htmlFor="edit-description" className="block text-sm font-medium">
              Descrição <span className="text-destructive">*</span>
            </label>
            <textarea
              id="edit-description"
              {...register("description")}
              rows={4}
              className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Category + Price — 2-col grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="edit-category" className="block text-sm font-medium">
                Categoria <span className="text-destructive">*</span>
              </label>
              <select
                id="edit-category"
                {...register("categoryId")}
                className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-xs text-destructive">{errors.categoryId.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="edit-price" className="block text-sm font-medium">
                Preço base <span className="text-muted-foreground text-xs">(opcional)</span>
              </label>
              <input
                id="edit-price"
                {...register("priceBaseline")}
                type="text"
                placeholder="Ex: A partir de R$ 50"
                className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Contact fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="edit-whatsapp" className="block text-sm font-medium">
                WhatsApp <span className="text-muted-foreground text-xs">(opcional)</span>
              </label>
              <input
                id="edit-whatsapp"
                {...register("whatsappNumber")}
                type="tel"
                placeholder="5511999999999"
                className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="edit-instagram" className="block text-sm font-medium">
                Instagram <span className="text-muted-foreground text-xs">(opcional)</span>
              </label>
              <input
                id="edit-instagram"
                {...register("instagramHandle")}
                type="text"
                placeholder="seuperfil (sem @)"
                className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Visibility */}
          <div className="space-y-1">
            <label htmlFor="edit-visibility" className="block text-sm font-medium">
              Visibilidade
            </label>
            <select
              id="edit-visibility"
              {...register("visibilityStatus")}
              className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="Public">Público — visível no catálogo</option>
              <option value="Private">Privado (rascunho)</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              id="edit-modal-cancel-btn"
              className="flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="edit-listing-submit-btn"
              disabled={isSubmitting || isUploading}
              className="flex-1 rounded-xl brand-gradient text-white px-4 py-2.5 text-sm font-semibold shadow-sm hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar alterações"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
