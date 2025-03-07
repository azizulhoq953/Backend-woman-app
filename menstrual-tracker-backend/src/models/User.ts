import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  menstrualLastDay?: Date;
  expectedNextDate?: Date;
  partnerId?: string;
  role: "user" | "admin";
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    menstrualLastDay: { type: Date },
    expectedNextDate: { type: Date },
    partnerId: { type: String },
    role: { type: String, default: "user" },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
