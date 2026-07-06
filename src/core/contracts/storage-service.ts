export interface IStorageService {
  deleteImage(imageKey: string): Promise<void>;
}
