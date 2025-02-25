import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    partnerId?: string;
    lastMensDate?: Date;
    nextMensDate?: Date;
    cycleLength: number;
    questions: string[];
    role: "user" | "admin";
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    partnerId: { type: String },
    lastMensDate: { type: Date },
    nextMensDate: { type: Date },
    cycleLength: { type: Number, default: 28 }, // Default 28-day cycle
    questions: { type: [String], default: [] },
    role: { type: String, enum: ["user", "admin"], default: "user" },
});

export default mongoose.model<IUser>("User", UserSchema);
