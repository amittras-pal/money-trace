import { model, Schema } from "mongoose";
import { IBackupTimestamp } from "../types/backupTimestamp";

const backupTimestampSchema = new Schema<IBackupTimestamp>(
  {},
  { timestamps: true }
);

const BackupTimestamp = model("BackupTimestamp", backupTimestampSchema);
export default BackupTimestamp;
