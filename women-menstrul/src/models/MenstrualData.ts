import mongoose, { Schema, Document } from 'mongoose';

export interface IMenstrualData extends Document {
  user: mongoose.Schema.Types.ObjectId;
  date: Date;
  flow: 'light' | 'medium' | 'heavy';
  symptoms?: string[];
  mood?: string;
  notes?: string;
  createdAt: Date;
}

const MenstrualDataSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    flow: {
      type: String,
      enum: ['light', 'medium', 'heavy'],
      required: true,
    },
    symptoms: {
      type: [String],
    },
    mood: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export default mongoose.model<IMenstrualData>('MenstrualData', MenstrualDataSchema);
