import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const clientsToSeed = [
    { name: "Client A", email: "clientA@example.com" },
    { name: "Client B", email: "clientB@example.com" },
    { name: "Client C", email: "clientC@example.com" },
  ];

  const [clientA, clientB, clientC] = await Promise.all(
    clientsToSeed.map((client) =>
      prisma.client.upsert({
        where: { email: client.email },
        update: {},
        create: client,
      }),
    ),
  );

  // Create API keys for the clients
  // Set expiration to one year from now
  const now = new Date();
  const inOneYear = new Date(now);
  inOneYear.setFullYear(inOneYear.getFullYear() + 1);

  const apiKeysToSeed = [
    {
      clientId: clientA.id,
      key: "api_key_clientA_1",
      expiration: inOneYear,
    },
    {
      clientId: clientB.id,
      key: "api_key_clientB_1",
      expiration: inOneYear,
    },
    {
      clientId: clientC.id,
      key: "api_key_clientC_1",
      expiration: inOneYear,
    },
  ];

  await Promise.all(
    apiKeysToSeed.map((apiKey) =>
      prisma.apiKey.upsert({
        where: { key: apiKey.key },
        update: {},
        create: apiKey,
      }),
    ),
  );

  // Create  example products for clients
  const productsToSeed = [
    {
      clientId: clientA.id,
      name: "Sample Product A",
      description: "A sample product for Client A",
      stock: 100,
      price: 19.99,
    },
    {
      clientId: clientA.id,
      name: "Premium Widget A",
      description: "High-end widget for Client A",
      stock: 50,
      price: 49.99,
    },
    {
      clientId: clientB.id,
      name: "Standard Gadget B",
      description: "Standard gadget for Client B",
      stock: 200,
      price: 29.99,
    },
    {
      clientId: clientC.id,
      name: "Deluxe Tool C",
      description: "Professional tool for Client C",
      stock: 15,
      price: 199.99,
    },
  ];

  await Promise.all(
    productsToSeed.map((product) =>
      prisma.product.upsert({
        where: {
          clientId_name: {
            clientId: product.clientId,
            name: product.name,
          },
        },
        update: {},
        create: product,
      }),
    ),
  );

  console.log("Seed finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
