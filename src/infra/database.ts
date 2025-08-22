import { Client, type QueryConfig } from "pg";
import { ServiceError } from "./errors";

async function query(queryObject: QueryConfig | string) {
  let client: Client | undefined;

  try {
    client = await getNewClient();
    const result = await client.query(queryObject);

    return result;
  } catch (error) {
    const serviceErrorObject = new ServiceError({
      cause: error,
      message: "Erro na conexão com o Database ou na Query.",
    });

    throw serviceErrorObject;
  } finally {
    await client?.end();
  }
}

async function getNewClient() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? true : false,
  });
  await client.connect();

  return client;
}

const database = {
  query,
  getNewClient,
};

export default database;
