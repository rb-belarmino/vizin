"use client";

import { useState } from "react";
import { Listing } from "@/core/entities/listing";
import { EditListingModal } from "./EditListingModal";

interface DashboardListingActionsProps {
  listing: Listing;
}

/**
 * Client wrapper that manages the edit modal open state for a single listing.
 * Required because the parent dashboard/page.tsx is a Server Component and
 * cannot hold local React state.
 */
export function DashboardListingActions({ listing }: DashboardListingActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        id={`edit-listing-${listing.id}`}
        onClick={() => setIsEditOpen(true)}
        className="mt-1 w-full rounded-md border border-primary/30 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/5 transition-colors"
      >
        Editar
      </button>

      <EditListingModal
        listing={listing}
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />
    </>
  );
}
