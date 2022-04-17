const express = require("express");
const cors = require("cors");
require("colors");
require("dotenv").config();
const path = require("path");
const connectDb = require("./config/db");
const errorHandler = require("./middlewares/error.middleware");

const PORT = process.env.PORT || 5000;
connectDb();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(path.resolve(__dirname, "static")));

app.use("/api/user", require("./routes/user.routes"));
app.use("/api/categories", require("./routes/category.routes"));
app.use("/api/expenses", require("./routes/expense.routes"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server Started on: ", PORT);
});
