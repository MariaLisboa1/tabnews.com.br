import { Client } from "pg";
import fs from "fs";
import path from "path";

async function query(queryObject) {
  let client;
  try {
    client = await getNewClient();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await client.end();
  }
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });

  await client.connect();
  return client;
}

export default {
  query,
  getNewClient,
};

function getSSLValues() {
  console.log(process.env.POSTGRES_CA);

  if (process.env.POSTGRES_CA) {
    let caValue = process.env.POSTGRES_CA;

    // Se a variável for um caminho de arquivo (começa com . ou /)
    if (caValue.startsWith("./") || caValue.startsWith("/")) {
      // Resolve o caminho absoluto a partir da raiz do projeto
      const absolutePath = path.resolve(process.cwd(), caValue);
      caValue = fs.readFileSync(absolutePath, "utf-8");
    }

    return {
      rejectUnauthorized: true,
      ca: caValue,
    };
  }

  return process.env.NODE_ENV === "production" ? true : false;
}
