import dotenv from "dotenv";

dotenv.config();

interface IEnv {
  PORT: string | undefined;
  DB_URI: string | undefined;
  JWT_SECRET: string | undefined;
  NODE_ENV: string | undefined;
}

export function getEnv(): IEnv {
  return {
    PORT: process.env.PORT,
    DB_URI: process.env.DB_URI ?? "",
    JWT_SECRET: process.env.JWT_SECRET ?? "",
    NODE_ENV: process.env.NODE_ENV,
  };
}
