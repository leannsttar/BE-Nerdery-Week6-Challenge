import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3, bucketName, bucketRegion } from "../config/s3.config";
import { v4 as uuidv4 } from 'uuid';

import { PresignedUrlResponse } from "../interfaces/uploads/upload.interface";

export const StorageService = {
  async getPresignedUrl(filename: string, filetype: string): Promise<PresignedUrlResponse> {
    if (!bucketName) {
      throw new Error("Server Error: BUCKET_NAME configuration is missing");
    }

    const key = `uploads/${uuidv4()}-${filename}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: filetype,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    return { uploadUrl, key };
  },

  getPublicUrl(key: string | null) {
    if (!key) return null;
    if (key.startsWith("http")) return key;

    return `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${key}`;
  }
};
