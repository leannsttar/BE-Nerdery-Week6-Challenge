import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3, bucketName } from "../config/s3.config";
import { v4 as uuidv4 } from 'uuid';

import { GetPresignedUrlArgs, PresignedUrlResponse } from "../interfaces/uploads/upload-resolver.interface";

export const uploadResolvers = {
  Mutation: {
    getPresignedUrl: async (
      _: unknown, 
      { filename, filetype }: GetPresignedUrlArgs
    ): Promise<PresignedUrlResponse> => {
      
      if (!bucketName) {
        throw new Error("Server Error: BUCKET_NAME configuration is missing")
      }

      const key = `uploads/${uuidv4()}-${filename}`
      
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        ContentType: filetype,
      })

      const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 })

      return { uploadUrl, key }
    },
  },
};