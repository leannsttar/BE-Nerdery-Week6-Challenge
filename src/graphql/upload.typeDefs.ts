import { gql } from "apollo-server-express";

export const uploadTypeDefs = gql`
  type S3UploadConfig {
    uploadUrl: String!
    key: String!
  }

  type Mutation {
    getPresignedUrl(filename: String!, filetype: String!): S3UploadConfig!
  }
`;
