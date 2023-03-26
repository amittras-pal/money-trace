import mongoose from "mongoose";

// From Mongoose official docs: https://mongoosejs.com/docs/lambda.html
let conn: any = null;
export const connectMongo = async (URI: string) => {
  if (conn === null) {
    mongoose.set("strictQuery", false);
    conn = mongoose
      .connect(URI, {
        serverSelectionTimeoutMS: 5000,
      })
      .then(() => mongoose)
      .catch((e) => console.error(e));

    // awaiting connection after assigning to the "conn" variable
    // to avoid multiple function calls creating new connections
    await conn;
  }

  return conn;
};
