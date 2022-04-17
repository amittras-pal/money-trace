const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    if (process.env.NODE_ENV === "development")
      console.log(
        `Mongo DB Connected: ${connection.connection.host}`.black.bgGreen
      );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDb;
