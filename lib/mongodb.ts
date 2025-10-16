import { MongoClient, ServerApiVersion } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let client: MongoClient;

if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient;
  };

  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri, options);
  }

  client = globalWithMongo._mongoClient;
} else {
  client = new MongoClient(uri, options);
}

/**
 * Get a clean connection (will close stale ones)
 */
export async function getMongoClient() {
  try {
    // Try connecting
    await client.connect();
    return client;
  } catch (err) {
    console.error("MongoDB connection failed. Retrying...", err);

    // Close stale connection
    try {
      await client.close();
    } catch (err: any) {
      return err
    }

    // Create new client and connect again
    client = new MongoClient(uri, options);
    await client.connect();
    return client;
  }
}

export default client;
