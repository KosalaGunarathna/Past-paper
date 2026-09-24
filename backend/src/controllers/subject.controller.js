import Subject from "../models/subject.model.js";
import Level from "../models/level.model.js";
import Stream from "../models/stream.model.js";

// @desc Get all subjects (populated with Level and Streams)
export const getSubjects = async (req, res) => {
    try {
        const { levelId, streamId } = req.query;
        let query = {};

        if (levelId) query.levelId = levelId;
        if (streamId) query.streamIds = streamId;

        const subjects = await Subject.find(query)
            .populate("levelId", "id name")
            .populate("streamIds", "id name")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: subjects });
    } catch (error) {
        console.error("Error fetching subjects:", error);
        res.status(500).json({ success: false, message: "Failed to fetch subjects" });
    }
};

// @desc Get single subject by ID
export const getSubjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const subject = await Subject.findById(id)
            .populate("levelId", "id name")
            .populate("streamIds", "id name");

        if (!subject) {
            return res.status(404).json({ success: false, message: "Subject not found" });
        }

        res.status(200).json({ success: true, data: subject });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error retrieving subject" });
    }
};

// @desc Create new subject
export const createSubject = async (req, res) => {
    let { name, levelId, streamIds } = req.body;

    if (!name || !name.trim()) {
        return res.status(400).json({ 
            success: false, 
            message: "Subject Name is required" 
        });
    }

    try {
        if (!levelId) {
            const defaultLevel = await Level.findOne({});
            if (defaultLevel) {
                levelId = defaultLevel._id;
            } else {
                return res.status(400).json({ 
                    success: false, 
                    message: "Level ID is required" 
                });
            }
        }

        const formattedStreams = Array.isArray(streamIds) 
            ? streamIds.filter(Boolean) 
            : (streamIds ? [streamIds] : []);

        const existingSubject = await Subject.findOne({ name: name.trim(), levelId });
        if (existingSubject) {
            return res.status(400).json({ 
                success: false, 
                message: `Subject '${name.trim()}' already exists in this exam level` 
            });
        }

        const newSubject = new Subject({
            name: name.trim(),
            levelId,
            streamIds: formattedStreams
        });

        await newSubject.save();
        const populated = await Subject.findById(newSubject._id)
            .populate("levelId", "name")
            .populate("streamIds", "name");

        res.status(201).json({ 
            success: true, 
            message: "Subject created successfully", 
            data: populated 
        });
    } catch (error) {
        console.error("Error creating subject:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to create subject" });
    }
};

// @desc Update subject (Admin only)
export const updateSubject = async (req, res) => {
    const { id } = req.params;
    const { name, levelId, streamIds } = req.body;

    try {
        const updated = await Subject.findByIdAndUpdate(
            id,
            { name, levelId, streamIds },
            { new: true }
        )
        .populate("levelId", "name")
        .populate("streamIds", "name");


        if (!updated) {
            return res.status(404).json({ success: false, message: "Subject not found" });
        }

        res.status(200).json({ 
            success: true, 
            message: "Subject updated successfully", 
            data: updated 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update subject" });
    }
};

// @desc Delete subject (Admin only)
export const deleteSubject = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await Subject.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Subject not found" });
        }

        res.status(200).json({ 
            success: true, 
            message: "Subject deleted successfully", 
            data: deleted 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete subject" });
    }
};
