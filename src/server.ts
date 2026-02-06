import express, { Application, Request } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ApolloServer } from 'apollo-server-express';
import { GraphQLError } from 'graphql';
import { productTypeDefs } from './graphql/product.typeDefs';
import { productResolvers } from './resolvers/products.resolver';
import { uploadTypeDefs } from './graphql/upload.typeDefs';
import { uploadResolvers } from './resolvers/upload.resolver';
import { validateApiKeyFromHeader } from './middlewares/api-key.middleware';
import cookieParser from 'cookie-parser';
import { ApiKeyService } from './services/api-key.service';

import { GraphQLContext } from './interfaces/context.interface';

dotenv.config();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

async function start() {
  const app: Application = express();
  app.use(cors());

  // PUBLIC: get API key by client id
  app.get('/api/key/:clientId', express.json(), async (req, res) => {
    const clientId = req.params.clientId;
    if (!clientId) return res.status(400).json({ message: 'Missing clientId' });
    const apiKey = await ApiKeyService.findByClientId(clientId);
    if (!apiKey) return res.status(404).json({ message: 'API key not found' });
    return res.json({ key: apiKey.key, expiration: apiKey.expiration });
  });

  // GraphQL server
  const server = new ApolloServer({
    typeDefs: [productTypeDefs, uploadTypeDefs],
    resolvers: [productResolvers, uploadResolvers],
    context: async ({ req }: { req: Request }): Promise<GraphQLContext> => {
      // Validate api key from headers
      const apiKey = await validateApiKeyFromHeader(req);

      if (!apiKey) {
        throw new GraphQLError('Missing or invalid API key', {
        extensions: {
          code: 'UNAUTHENTICATED',
          http: { status: 401 }
        }
      })
      }

      return { apiKey };
    },
  });

  await server.start();
  server.applyMiddleware({ app: app as any, path: '/graphql' });

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
  });
}

start().catch((e) => {
  console.error(e);
  process.exit(1);
});
