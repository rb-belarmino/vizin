import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UploadStorageUseCase } from '@/core/use-cases/upload-storage';

const mockDeleteFiles = vi.fn();

vi.mock('uploadthing/server', () => {
  return {
    UTApi: vi.fn().mockImplementation(function() {
      return {
        deleteFiles: mockDeleteFiles,
      };
    })
  };
});

describe('Upload Storage Use Case', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should return immediately if no imageKey is provided', async () => {
    const useCase = new UploadStorageUseCase();
    await useCase.deleteImage('');

    expect(mockDeleteFiles).not.toHaveBeenCalled();
  });

  it('should successfully delete image using UTApi', async () => {
    mockDeleteFiles.mockResolvedValue({ success: true });

    const useCase = new UploadStorageUseCase();
    await useCase.deleteImage('image-key-123');

    expect(mockDeleteFiles).toHaveBeenCalledWith('image-key-123');
    expect(console.log).toHaveBeenCalledWith('Successfully deleted image image-key-123 from UploadThing');
  });

  it('should handle and log errors during deletion', async () => {
    const error = new Error('UploadThing API error');
    mockDeleteFiles.mockRejectedValue(error);

    const useCase = new UploadStorageUseCase();
    await useCase.deleteImage('image-key-123');

    expect(mockDeleteFiles).toHaveBeenCalledWith('image-key-123');
    expect(console.error).toHaveBeenCalledWith('Failed to delete image image-key-123 from UploadThing:', error);
  });
});
