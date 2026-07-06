import { UTApi } from "uploadthing/server";
import { IStorageService } from "../contracts/storage-service";

export class UploadStorageUseCase implements IStorageService {
  private utapi: UTApi;

  constructor() {
    this.utapi = new UTApi();
  }

  async deleteImage(imageKey: string): Promise<void> {
    if (!imageKey) return;
    try {
      await this.utapi.deleteFiles(imageKey);
      console.log(`Successfully deleted image ${imageKey} from UploadThing`);
    } catch (error) {
      console.error(`Failed to delete image ${imageKey} from UploadThing:`, error);
    }
  }
}
