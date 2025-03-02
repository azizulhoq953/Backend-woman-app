import MenstrualData from '../models/MenstrualData';
// @desc    Record menstrual data
// @route   POST /api/menstrual
// @access  Private
export const recordMenstrualData = async (req, res) => {
    try {
        const { date, flow, symptoms, mood, notes } = req.body;
        const userId = req.user?.id;
        if (!date || !flow) {
            return res.status(400).json({
                success: false,
                message: 'Please provide date and flow data',
            });
        }
        const newEntry = new MenstrualData({
            user: userId,
            date,
            flow,
            symptoms,
            mood,
            notes,
        });
        await newEntry.save();
        res.status(201).json({
            success: true,
            data: newEntry,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
};
// @desc    Get menstrual data for a user
// @route   GET /api/menstrual
// @access  Private
export const getMenstrualData = async (req, res) => {
    try {
        const userId = req.user?.id;
        const data = await MenstrualData.find({ user: userId }).sort({ date: -1 });
        res.status(200).json({
            success: true,
            data,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
};
// @desc    Delete a menstrual record
// @route   DELETE /api/menstrual/:id
// @access  Private
export const deleteMenstrualData = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const record = await MenstrualData.findOneAndDelete({ _id: id, user: userId });
        if (!record) {
            return res.status(404).json({
                success: false,
                message: 'Record not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Record deleted successfully',
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
};
