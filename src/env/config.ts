import dotenv from "dotenv";

dotenv.config();

interface IEnv {
  PORT?: string;
  PROBE_PORT?: string;
  DB_URI?: string;
  JWT_SECRET?: string;
  SYS_ADM_SECRET?: string;
  NODE_ENV?: string;
  ORIGINS?: (string | RegExp)[];
  OCTO_PK?: string;
  OCTO_APP_ID: number;
  OCTO_INST_ID: number;
  GIT_REPO_OWNER?: string;
  GIT_REPO_NAME?: string;
  TOKEN_TTL?: string;
}

export function getEnv(): IEnv {
  return {
    PORT: process.env.PORT ?? "6400",
    PROBE_PORT: process.env.PROBE_PORT ?? "6174",
    DB_URI: process.env.DB_URI ?? "",
    JWT_SECRET: process.env.JWT_SECRET ?? "",
    SYS_ADM_SECRET: process.env.SYS_ADM_SECRET ?? "",
    NODE_ENV: process.env.NODE_ENV,
    OCTO_PK: process.env.OCTO_PK,
    OCTO_APP_ID: parseInt(process.env.OCTO_APP_ID ?? ""),
    OCTO_INST_ID: parseInt(process.env.OCTO_INST_ID ?? ""),
    ORIGINS: transformOrigins(process.env.ORIGINS?.split(",")),
    GIT_REPO_OWNER: process.env.GIT_REPO_OWNER ?? "",
    GIT_REPO_NAME: process.env.GIT_REPO_NAME ?? "",
    TOKEN_TTL: process.env.TOKEN_TTL ?? "",
  };
}

function transformOrigins(origins?: string[]) {
  if (!origins) return ["http://localhost:3000"];
  return origins.map((o) =>
    o.startsWith("/") ? new RegExp(o.slice(1), "gi") : o
  );
}
