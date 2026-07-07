import { UploadDropzone } from "./src/lib/uploadthing"
import React from 'react'

export function Test() {
  return <UploadDropzone endpoint="imageUploader" config={{ mode: "auto" }} />
}
