import mongoose, { Schema, Document } from "mongoose";

export interface IAdmin extends Document {
    name: string;
    email: string;
    password: string;
    role: "admin";
}

const AdminSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, default: "admin" },
    },
    { timestamps: true }
);

export default mongoose.model<IAdmin>("Admin", AdminSchema);
