import { Types } from "mongoose";

export interface IBackupTimestamp {
  _id?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
