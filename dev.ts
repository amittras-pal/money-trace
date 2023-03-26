import app from "./src";
import { connectMongo } from "./src/config/mongoose";
import { getEnv } from "./src/env/config";

const { PORT, DB_URI = "" } = getEnv();
connectMongo(DB_URI);

app.listen(PORT, (): void => {
  console.info(`Dev server started at: http://localhost:${PORT}`);
});
