import mongoose, { Schema, Document } from "mongoose";

interface INotification extends Document {
  userId: string;
  message: string;
  createdAt: Date;
  read: boolean;
}

const NotificationSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model<INotification>("Notification", NotificationSchema);
export default Notification;
