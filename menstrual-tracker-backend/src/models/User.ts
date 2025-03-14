// import mongoose, { Schema, Document } from "mongoose";

// export interface IUser extends Document {
//   name: string;
//   email: string;
//   password: string;
//   menstrualLastDay?: Date;
//   expectedNextDate?: Date;
//   partnerId?: string;
//   role: "user" | "admin";
// }

// const UserSchema: Schema = new Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     menstrualLastDay: { type: Date },
//     expectedNextDate: { type: Date },
//     partnerId: { type: String },
//     role: { type: String, default: "user" },
//   },
//   { timestamps: true }
// );

// export default mongoose.model<IUser>("User", UserSchema);


import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  // menstrualLastDay?: Date;
  // expectedNextDate?: Date;
  partnerId?: string;
  resetOtp?: string;
  otpExpire?: Number;
  profileImageUrl?: string;
  role: "user" | "admin";
  createdAt?: Date;
  updatedAt?: Date;
}

// Function to generate a unique 7-character partnerId
const generatePartnerId = async (): Promise<string> => {
  let partnerId: string = "";
  let isUnique = false;

  while (!isUnique) {
    partnerId = Math.random().toString(36).substr(2, 7); // Generate a random 7-char string
    const existingUser = await mongoose.model<IUser>("User").findOne({ partnerId });
    if (!existingUser) {
      isUnique = true;
    }
  }

  return partnerId;
};

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // menstrualLastDay: { type: Date },
    // expectedNextDate: { type: Date },
    partnerId: { type: String, unique: true, default: () => Math.random().toString(36).substr(2, 7) }, // ✅ Unique 7-char ID
    profileImageUrl:{type: String},

    role: { type: String, default: "user" },
    resetOtp: { type: String }, // Store OTP here
    otpExpire: { type: Date }, // Store OTP expiry date here
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
