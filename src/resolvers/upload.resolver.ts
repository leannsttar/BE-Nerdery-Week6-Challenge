import { StorageService } from "../services/storage.service";
import { GetPresignedUrlArgs, PresignedUrlResponse } from "../interfaces/uploads/upload.interface";


export const uploadResolvers = {
  Mutation: {
    getPresignedUrl: async (
      _: unknown, 
      { filename, filetype }: GetPresignedUrlArgs
    ): Promise<PresignedUrlResponse> => {
      return StorageService.getPresignedUrl(filename, filetype);
    },
  },
};