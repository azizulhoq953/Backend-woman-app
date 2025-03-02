import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export interface IUser extends Document {
_id: mongoose.Types.ObjectId; 
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  verificationToken: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  menstrualTrackingId: string; // Unique ID for partner access
  lastMenstrualDay: Date;
  cycleDuration: number;
  periodDuration: number;
  symptoms: string[];
  createdAt: Date;
  updatedAt: Date;
  isAdmin: boolean;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    menstrualTrackingId: {
      type: String,
      default: () => uuidv4(),
      unique: true,
    },
    lastMenstrualDay: {
      type: Date,
    },
    cycleDuration: {
      type: Number,
      default: 28,
    },
    periodDuration: {
      type: Number,
      default: 5,
    },
    symptoms: {
      type: [String],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);