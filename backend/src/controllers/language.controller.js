import Language from "../models/language.model.js";

export const getLanguages = async (req, res) => {
    try {
        const languages = await Language.find({}).sort({ createdAt: 1 });
        res.status(200).json({ success: true, data: languages });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch mediums/languages" });
    }
};

export const createLanguage = async (req, res) => {
    const { name, code } = req.body;
    if (!name) {
        return res.status(400).json({ success: false, message: "Medium/Language name is required" });
    }
    try {
        const existing = await Language.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, "i") } });
        if (existing) {
            return res.status(400).json({ success: false, message: "Medium/Language already exists" });
        }
        const lang = new Language({
            name: name.trim(),
            code: code ? code.trim().toUpperCase() : name.trim().slice(0, 2).toUpperCase()
        });
        await lang.save();
        res.status(201).json({ success: true, message: "Medium/Language created", data: lang });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateLanguage = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, code } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: "Medium/Language name is required" });
        }
        const updated = await Language.findByIdAndUpdate(
            id,
            {
                name: name.trim(),
                ...(code ? { code: code.trim().toUpperCase() } : {})
            },
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ success: false, message: "Medium/Language not found" });
        res.status(200).json({ success: true, message: "Medium/Language updated", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteLanguage = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Language.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ success: false, message: "Medium/Language not found" });
        res.status(200).json({ success: true, message: "Medium/Language deleted", data: deleted });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete medium/language" });
    }
};

