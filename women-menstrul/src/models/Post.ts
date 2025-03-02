import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  title: string;
  category: mongoose.Schema.Types.ObjectId;
  description: string;
  image: string;
  likes: mongoose.Schema.Types.ObjectId[];
  comments: {
    _id: mongoose.Types.ObjectId; // ✅ Explicitly defining `_id`
    user: mongoose.Schema.Types.ObjectId;
    text: string;
    name: string;
    createdAt: Date;
  }[];

  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Category',
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          auto: true, // Ensures each comment gets an ID
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        text: {
          type: String,
          required: true,
        },
        name: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IPost>('Post', PostSchema);
