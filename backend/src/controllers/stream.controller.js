import Stream from "../models/stream.model.js";

export const getStreams = async (req, res) => {
    try {
        const streams = await Stream.find({}).sort({ createdAt: 1 });
        res.status(200).json({ success: true, data: streams });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch streams" });
    }
};

export const createStream = async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ success: false, message: "Stream Name is required" });
    }
    try {
        const existing = await Stream.findOne({ name: name.trim() });
        if (existing) {
            return res.status(400).json({ success: false, message: "Stream already exists" });
        }
        const stream = new Stream({ name: name.trim() });
        await stream.save();
        res.status(201).json({ success: true, message: "Stream created", data: stream });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateStream = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ success: false, message: "Stream Name is required" });
    }
    try {
        const updated = await Stream.findByIdAndUpdate(
            id,
            { name: name.trim() },
            { new: true }
        );
        if (!updated) return res.status(404).json({ success: false, message: "Stream not found" });
        res.status(200).json({ success: true, message: "Stream updated successfully", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update stream" });
    }
};

export const deleteStream = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Stream.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ success: false, message: "Stream not found" });
        res.status(200).json({ success: true, message: "Stream deleted", data: deleted });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete stream" });
    }
};
