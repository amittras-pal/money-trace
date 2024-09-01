import morgan from "morgan";
import { getEnv } from "../env/config";

const { NODE_ENV } = getEnv();

const morganConfig = morgan(NODE_ENV === "development" ? "dev" : "tiny", {
  skip: (_req, res) =>
    NODE_ENV === "development" ? false : res.statusCode < 400,
});

export default morganConfig;
