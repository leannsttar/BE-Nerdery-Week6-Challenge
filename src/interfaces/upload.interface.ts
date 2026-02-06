export interface GetPresignedUrlArgs {
  filename: string;
  filetype: string;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  key: string;
}