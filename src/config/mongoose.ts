import mongoose from "mongoose";
import data from "../data/categories.json";
import Category from "../models/category.model";

// TODO: move into utilities if this works properly...
// Seed the category data inot the db if not vailable.
const seedCategories = async () => {
  const categories = await Category.count({});
  if (categories === 0) {
    const seedData = [...data.categories];
    Category.insertMany(seedData);
  }
};

// From Mongoose official docs: https://mongoosejs.com/docs/lambda.html
let conn: any = null;
export const connectMongo = async (URI: string) => {
  if (conn === null) {
    mongoose.set("strictQuery", false);
    conn = mongoose
      .connect(URI, {
        serverSelectionTimeoutMS: 5000,
      })
      .then(() => {
        seedCategories();
        return mongoose;
      })
      .catch((e) => console.error(e));

    // awaiting connection after assigning to the "conn" variable
    // to avoid multiple function calls creating new connections
    await conn;
  }

  return conn;
};
