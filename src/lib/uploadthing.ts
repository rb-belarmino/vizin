import { generateUploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/infrastructure/storage/uploadthing";

export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
