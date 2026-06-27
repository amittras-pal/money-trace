const app = require("./build/index");
const { connectMongo } = require("./build/config/mongoose");

connectMongo(process.env.DB_URI);
app.default.listen(process.env.PORT ?? 3000, () => {
  console.log("Server Started...");
});
