# My Store (GraphQL API)

Express + GraphQL + Prisma (PostgreSQL) + AWS S3

## Requirements

- **Node.js**: v18+ recommended
- **PostgreSQL** (local or remote)
- **Docker** (Recommended for local database setup)
- **AWS Account** (S3 Bucket) for image storage
- **npm** or **yarn**

## Libraries used

- `express` — HTTP server
- `apollo-server-express` — GraphQL server
- `prisma` & `@prisma/client` — ORM
- `class-validator` & `class-transformer` — input validation
- `@aws-sdk/client-s3` & `@aws-sdk/s3-request-presigner` — AWS S3 integration
- `uuid` — IDs & sample seeds
- `dotenv` — environment config
- `cors` — CORS middleware

## Project structure

- `prisma/` — Prisma schema + seed script
- `src/` — application source code
  - `config/` — environment variables & external services config (S3)
  - `dtos/` — input validation classes
    - `products/` — product-specific DTOs
  - `graphql/` — GraphQL type definitions (Schema)
  - `interfaces/` — TypeScript interfaces & shared types
  - `middlewares/` — Express/GraphQL middlewares (Auth, API Key)
  - `resolvers/` — GraphQL resolvers (Controllers)
  - `services/` — business logic & database access
  - `utils/` — helper functions & validators
  - `server.ts` — application entry point
- `nerdery-collection.json` — Postman collection for testing

## Data model

- **Client** — id, name, email
- **Product** — id, clientId, name, description, stock, price, imageUrl, isActive
- **ApiKey** — id, clientId, key, expiration

## Architecture Highlights

### Image Uploads (AWS S3)
This project uses the **Presigned URLs** pattern for secure and efficient image uploads:
1.  **Client** requests a permission (upload URL) via GraphQL mutation `getPresignedUrl`.
2.  **API** validates the request and generates a temporary, secure URL signed by AWS.
3.  **Client** uploads the binary file directly to S3 using that URL.
4.  **Client** creates the product sending the S3 `key` to the API.

---

## Setup / Run

### 1. Clone repo & enter folder
```bash
git clone [https://github.com/leannsttar/BE-Nerdery-Week6-Challenge.git](https://github.com/leannsttar/BE-Nerdery-Week6-Challenge.git)
cd my-store
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Create a .env file
Create a `.env` file in the project root. You must configure both Database and AWS credentials.

```bash

# Database (Default credentials for the Docker container)
DATABASE_URL="postgresql://postgres:postgres@localhost:5434/mystore_db"

# AWS S3 Configuration (Required for Image Uploads)
BUCKET_NAME="your bucket name"
BUCKET_REGION="your region"
ACCESS_KEY="your access key"
SECRET_ACCESS_KEY="your secret"
```

### 4. Start the Database (Docker)
Spin up the PostgreSQL instance using Docker Compose:

```bash
docker compose up -d
```

### 5. Initialize Database & Seed Data
Push the schema to your local database and populate it with initial test data (Clients, Products, API Keys).

```bash
# Push schema to DB
npx prisma db push

# Seed initial data
npm run prisma:seed
```

### 6. Start dev server

```bash
npm run dev
```

The server will start at `http://localhost:4000/graphql`.

---

## Testing & Usage

### Postman Collection
A complete **Postman Collection** (`Enriched_Nerdery_Graph.postman_collection.json`) is included in the root folder. It contains:
- Pre-configured requests for all Queries and Mutations.
- Environment variables setup for easy testing.
- Examples for the S3 Binary Upload flow.

### Authentication
- GraphQL queries require an `x-api-key` in the request header.
- **Get API Key:** You can retrieve a valid API key for the sample clients by hitting the public endpoint: `GET http://localhost:4000/api/key/{clientId}`