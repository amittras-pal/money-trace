import { Types } from "mongoose";

export type IUser = {
  // Identification.
  _id?: Types.ObjectId;
  userName: string;
  email: string;
  // Metadata.
  timeZone: string;
  editWindow: number;
  color?: string;
  seenChangelog: boolean;
  // Sessions Tracking.
  lastActive: Date | null;
  lastLogin: Date | null;
  // Security
  pin?: string;
  recoveryChallenge?: string | null;
  recoveryAnswer?: string | null;
};
