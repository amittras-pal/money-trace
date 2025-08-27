import dotenv from "dotenv";

dotenv.config();

interface IEnv {
  PORT?: string;
  PROBE_PORT?: string;
  DB_URI?: string;
  SYS_ADM_SECRET?: string;
  NODE_ENV?: string;
  ORIGINS?: (string | RegExp)[];
  OCTO_PK?: string;
  OCTO_APP_ID: number;
  OCTO_INST_ID: number;
  GIT_REPO_OWNER?: string;
  GIT_REPO_NAME?: string;
  // Auth related env vars.
  ACCESS_TOKEN_PK?: string;
  ACCESS_TOKEN_TTL?: string;
  REFRESH_TOKEN_PK?: string;
  REFRESH_TOKEN_TTL?: string;
}

interface IBackupEnv {
  BACKUP_CLUSTER_URL?: string;
}

export function getEnv(): IEnv {
  return {
    PORT: process.env.PORT ?? "6400",
    PROBE_PORT: process.env.PROBE_PORT ?? "6174",
    DB_URI: process.env.DB_URI ?? "",
    SYS_ADM_SECRET: process.env.SYS_ADM_SECRET ?? "",
    NODE_ENV: process.env.NODE_ENV,
    OCTO_PK: process.env.OCTO_PK,
    OCTO_APP_ID: parseInt(process.env.OCTO_APP_ID ?? ""),
    OCTO_INST_ID: parseInt(process.env.OCTO_INST_ID ?? ""),
    ORIGINS: [process.env.ORIGINS ?? ""],
    GIT_REPO_OWNER: process.env.GIT_REPO_OWNER ?? "",
    GIT_REPO_NAME: process.env.GIT_REPO_NAME ?? "",
    ACCESS_TOKEN_PK: process.env.ACCESS_TOKEN_PK ?? "",
    ACCESS_TOKEN_TTL: process.env.ACCESS_TOKEN_TTL ?? "",
    REFRESH_TOKEN_PK: process.env.REFRESH_TOKEN_PK ?? "",
    REFRESH_TOKEN_TTL: process.env.REFRESH_TOKEN_TTL ?? "",
  };
}

export function getBackupEnv(): IBackupEnv {
  return {
    BACKUP_CLUSTER_URL: process.env.BACKUP_CLUSTER_URL,
  };
}
