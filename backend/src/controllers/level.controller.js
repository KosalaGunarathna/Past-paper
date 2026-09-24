import Level from "../models/level.model.js";

// @desc Get all levels
export const getLevels = async (req, res) => {
    try {
        const levels = await Level.find({}).sort({ createdAt: 1 });
        res.status(200).json({ success: true, count: levels.length, data: levels });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch levels" });
    }
};

// @desc Create new level
export const createLevel = async (req, res) => {
    const { name } = req.body;
    if (!name || !name.trim()) {
        return res.status(400).json({ success: false, message: "Level Name is required" });
    }
    try {
        const existing = await Level.findOne({ name: name.trim() });
        if (existing) {
            return res.status(400).json({ success: false, message: "Level already exists" });
        }
        const level = new Level({ name: name.trim() });
        await level.save();
        res.status(201).json({ success: true, message: "Level created successfully", data: level });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || "Failed to create level" });
    }
};

// @desc Update level
export const updateLevel = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if (!name || !name.trim()) {
        return res.status(400).json({ success: false, message: "Level Name is required" });
    }
    try {
        const updated = await Level.findByIdAndUpdate(
            id,
            { name: name.trim() },
            { new: true }
        );
        if (!updated) return res.status(404).json({ success: false, message: "Level not found" });
        res.status(200).json({ success: true, message: "Level updated successfully", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update level" });
    }
};

// @desc Delete level
export const deleteLevel = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Level.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ success: false, message: "Level not found" });
        res.status(200).json({ success: true, message: "Level deleted successfully", data: deleted });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete level" });
    }
};
