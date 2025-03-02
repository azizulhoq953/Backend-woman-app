// src/models/Order.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  user: mongoose.Schema.Types.ObjectId;
  products: {
    product: mongoose.Schema.Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
  }[];
  paymentMethod: string;
  paymentInfo: {
    transactionId: string;
    phone: string;
    name: string;
    address: string;
  };
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentInfo: {
      transactionId: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IOrder>('Order', OrderSchema);