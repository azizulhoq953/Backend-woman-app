import mongoose, { Schema } from 'mongoose';
const PostSchema = new Schema({
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
}, {
    timestamps: true,
});
export default mongoose.model('Post', PostSchema);
