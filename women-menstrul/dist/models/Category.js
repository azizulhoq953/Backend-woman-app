// src/models/Category.ts
import mongoose, { Schema } from 'mongoose';
const CategorySchema = new Schema({
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
}, {
    timestamps: true,
});
export default mongoose.model('Category', CategorySchema);
