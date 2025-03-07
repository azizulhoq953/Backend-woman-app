import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  userId: string;
  title: string;
  category: string;
  description: string;
  image: string;
  likes: number;
  comments: number;
}

const PostSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IPost>("Post", PostSchema);
