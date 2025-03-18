import mongoose, { Schema } from "mongoose";

export interface ICategory extends Document {
    name: string;
  }

const CategorySchema: Schema = new Schema(
    {
        name: { type: String, required: true, unique: true },
    },
    { timestamps: true }
);

export default mongoose.model("Category", CategorySchema);