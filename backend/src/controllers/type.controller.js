import Type from "../models/type.model.js";

export const getTypes = async (req, res) => {
    try {
        const types = await Type.find({}).sort({ createdAt: 1 });
        res.status(200).json({ success: true, data: types });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch types" });
    }
};

export const createType = async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ success: false, message: "Type Name is required" });
    }
    try {
        const existing = await Type.findOne({ name: name.trim() });
        if (existing) {
            return res.status(400).json({ success: false, message: "Type already exists" });
        }
        const type = new Type({ name: name.trim() });
        await type.save();
        res.status(201).json({ success: true, message: "Type created", data: type });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateType = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ success: false, message: "Type Name is required" });
    }
    try {
        const updated = await Type.findByIdAndUpdate(
            id,
            { name: name.trim() },
            { new: true }
        );
        if (!updated) return res.status(404).json({ success: false, message: "Type not found" });
        res.status(200).json({ success: true, message: "Type updated successfully", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update type" });
    }
};

export const deleteType = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Type.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ success: false, message: "Type not found" });
        res.status(200).json({ success: true, message: "Type deleted", data: deleted });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete type" });
    }
};
