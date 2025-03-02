import mongoose, { Schema } from 'mongoose';
const MenstrualDataSchema = new Schema({
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
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});
export default mongoose.model('MenstrualData', MenstrualDataSchema);
