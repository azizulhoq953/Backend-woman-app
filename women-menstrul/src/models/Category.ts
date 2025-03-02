// src/models/Category.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  type: 'blog' | 'marketplace';
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ['blog', 'marketplace'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICategory>('Category', CategorySchema);