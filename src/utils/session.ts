import { sign } from "jsonwebtoken";
import { getEnv } from "../env/config";

export function generateToken(
  type: "access" | "refresh",
  payload: Record<string, any>
) {
  const {
    ACCESS_TOKEN_PK = "",
    ACCESS_TOKEN_TTL = "",
    REFRESH_TOKEN_PK = "",
    REFRESH_TOKEN_TTL = "",
  } = getEnv();

  const privateKey = type === "access" ? ACCESS_TOKEN_PK : REFRESH_TOKEN_PK;
  const expiresIn = type === "access" ? ACCESS_TOKEN_TTL : REFRESH_TOKEN_TTL;

  return sign(payload, privateKey, { expiresIn });
}
