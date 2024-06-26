import dotenv from "dotenv";

dotenv.config();

interface IEnv {
  PORT?: string;
  PROBE_PORT?: string;
  DB_URI?: string;
  JWT_SECRET?: string;
  NODE_ENV?: string;
  ORIGINS?: (string | RegExp)[];
}

export function getEnv(): IEnv {
  return {
    PORT: process.env.PORT ?? "6400",
    PROBE_PORT: process.env.PROBE_PORT ?? "6174",
    DB_URI: process.env.DB_URI ?? "",
    JWT_SECRET: process.env.JWT_SECRET ?? "",
    NODE_ENV: process.env.NODE_ENV,
    ORIGINS: transformOrigins(process.env.ORIGINS?.split(",")),
  };
}

function transformOrigins(origins?: string[]) {
  if (!origins) return ["http://localhost:3000"];
  return origins.map((o) =>
    o.startsWith("/") ? new RegExp(o.slice(1), "gi") : o
  );
}
