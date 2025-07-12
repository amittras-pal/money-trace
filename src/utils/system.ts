import { Db, MongoClient } from "mongodb";

export async function cloneCollection(
  sourceDb: Db,
  targetDb: Db,
  collName: string
) {
  const documents = await sourceDb.collection(collName).find().toArray();
  await targetDb.collection(collName).deleteMany();
  const result = await targetDb.collection(collName).insertMany(documents);
  return { [`${collName}_inserted`]: result.insertedCount };
}

export function getDbClient(URI: string) {
  const url = new URL(URI);
  url.searchParams.set("authSource", "admin");
  return new MongoClient(getURLString(url));
}

function getURLString(url: URL) {
  return `${url.protocol}//${url.username}:${url.password}@${
    url.hostname
  }/?${url.searchParams.toString()}`;
}
