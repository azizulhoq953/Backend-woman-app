// src/models/Product.ts
import mongoose, { Schema } from 'mongoose';
const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category',
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    image: {
        type: String,
        required: true,
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0,
    },
}, {
    timestamps: true,
});
export default mongoose.model('Product', ProductSchema);
