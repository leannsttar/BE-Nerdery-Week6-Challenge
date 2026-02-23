import "reflect-metadata";
import express, { Application, Request } from "express";
import cors from "cors";
import { envConfig } from "./config/env.config";
import { ApolloServer } from "apollo-server-express";
import { GraphQLError } from "graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { applyMiddleware } from "graphql-middleware";

import { productTypeDefs } from "./graphql/product.type-defs";
import { productResolvers } from "./resolvers/products.resolver";
import { uploadTypeDefs } from "./graphql/upload.type-defs";
import { uploadResolvers } from "./resolvers/upload.resolver";
import { validateApiKeyFromHeader } from "./middlewares/api-key.middleware";
import { errorMiddleware } from "./middlewares/error-handler.middleware";

import { ApiKeyService } from "./services/api-key.service";

import { GraphQLContext } from "./interfaces/context.interface";

const PORT = envConfig.PORT || 4000;

async function start() {
  const app: Application = express();
  app.use(cors());

  // PUBLIC: get API key by client id
  app.get("/api/key/:clientId", express.json(), async (req, res) => {
    const clientId = req.params.clientId;
    if (!clientId) return res.status(400).json({ message: "Missing clientId" });
    const apiKey = await ApiKeyService.findByClientId(clientId);
    if (!apiKey) return res.status(404).json({ message: "API key not found" });
    return res.json({ key: apiKey.key, expiration: apiKey.expiration });
  });

  const schema = makeExecutableSchema({
    typeDefs: [productTypeDefs, uploadTypeDefs],
    resolvers: [productResolvers, uploadResolvers],
  });

  const schemaWithMiddleware = applyMiddleware(schema, errorMiddleware);

  // GraphQL server
  const server = new ApolloServer({
    schema: schemaWithMiddleware,
    context: async ({ req }: { req: Request }): Promise<GraphQLContext> => {
      // Validate api key from headers
      const apiKey = await validateApiKeyFromHeader(req);

      if (!apiKey) {
        throw new GraphQLError("Missing or invalid API key", {
          extensions: {
            code: "UNAUTHENTICATED",
            http: { status: 401 },
          },
        });
      }

      return { apiKey };
    },
  });

  await server.start();
  server.applyMiddleware({ app: app as any, path: "/graphql" });

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(
      `GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`,
    );
  });
}

start().catch((e) => {
  console.error(e);
  process.exit(1);
});
