import { model, Schema } from "mongoose";
import { IUser } from "../types/user";

const userSchema = new Schema<IUser>(
  {
    userName: { type: "string", required: true, trim: true },
    email: { type: "string", required: true, trim: true, unique: true },
    pin: { type: "string", required: true },
    timeZone: { type: "string", required: true },
    editWindow: { type: "number", required: true, default: 7 },
    color: { type: "string", required: false, default: "indigo" },
  },
  { timestamps: true }
);

const User = model<IUser>("User", userSchema);

export default User;
