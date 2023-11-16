import data from "../data/categories.json";
import Category from "../models/category.model";

// TODO: try moving this to a 'prestart'/'poststart' npm script.
// Seed the category data inot the db if not vailable.
export const seedCategoriesIfNotPresent = async () => {
  const categories = await Category.count({});
  if (categories === 0) {
    console.log("Populating Categories since none is present.");
    const seedData = [...data.categories];
    Category.insertMany(seedData);
  }
};
