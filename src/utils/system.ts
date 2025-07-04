import { Db } from "mongodb";

export async function cloneCollection(
  sourceDb: Db,
  targetDb: Db,
  collectionName: string
) {
  const documents = await sourceDb.collection(collectionName).find().toArray();
  await targetDb.collection(collectionName).deleteMany();
  await targetDb.collection(collectionName).insertMany(documents);
  return { [collectionName]: documents.length };
}
