import { S3Client } from "@aws-sdk/client-s3";
import { envConfig } from "./env.config";

export const bucketName = envConfig.BUCKET_NAME;
export const bucketRegion = envConfig.BUCKET_REGION;
export const accessKey = envConfig.ACCESS_KEY;
export const secretAccessKey = envConfig.SECRET_ACCESS_KEY;

export const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});
