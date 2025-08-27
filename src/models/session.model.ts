import { model, Schema } from "mongoose";
import { ISession } from "../types/session";

const sessionSchema = new Schema<ISession>({
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  userAgent: { type: String, required: true },
  deviceId: { type: String, required: true },
  refreshTokenHash: { type: String },
  createdAt: { type: Date, default: Date.now },
  expireAt: { type: Date, required: true },
  revoked: { type: Boolean, default: false },
});

const Session = model("Session", sessionSchema);
export default Session;
