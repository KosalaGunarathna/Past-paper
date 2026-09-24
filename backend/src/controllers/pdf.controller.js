import PDF from "../models/pdf.model.js";

// @desc Get all PDFs with filtering and population
export const getPDFs = async (req, res) => {
    try {
        const { subjectId, year, typeId, medium, search } = req.query;
        let query = {};

        if (subjectId) query.subjectId = subjectId;
        if (year) query.year = parseInt(year);
        if (typeId) query.typeId = typeId;
        if (medium) query.medium = medium;
        if (search) {
            const isNumericYear = !isNaN(search) && search.trim().length === 4;
            if (isNumericYear) {
                query.$or = [
                    { title: { $regex: search, $options: "i" } },
                    { year: parseInt(search) }
                ];
            } else {
                query.$or = [
                    { title: { $regex: search, $options: "i" } },
                    { medium: { $regex: search, $options: "i" } }
                ];
            }
        }

        const pdfs = await PDF.find(query)
            .populate({
                path: "subjectId",
                select: "name levelId streamIds",
                populate: [
                    { path: "levelId", select: "name" },
                    { path: "streamIds", select: "name" }
                ]
            })
            .populate("typeId", "name")
            .sort({ year: -1, createdAt: -1 });

        res.status(200).json({ success: true, count: pdfs.length, data: pdfs });
    } catch (error) {
        console.error("Error fetching PDFs:", error);
        res.status(500).json({ success: false, message: "Failed to fetch PDF records" });
    }
};

// @desc Get single PDF by ID
export const getPDFById = async (req, res) => {
    try {
        const { id } = req.params;
        const pdf = await PDF.findById(id)
            .populate("subjectId")
            .populate("typeId");

        if (!pdf) {
            return res.status(404).json({ success: false, message: "PDF document not found" });
        }

        res.status(200).json({ success: true, data: pdf });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to retrieve PDF" });
    }
};

// @desc Create / Upload new PDF (Admin only)
export const createPDF = async (req, res) => {
    const { title, year, part, medium, fileUrl, fileSize, subjectId, typeId } = req.body;

    if (!title || !year || !fileUrl || !subjectId || !typeId) {
        return res.status(400).json({ 
            success: false, 
            message: "Title, Year, File URL, Subject, and Document Type are required" 
        });
    }

    try {
        const newPDF = new PDF({
            title,
            year: parseInt(year),
            part: part || "Full Paper",
            medium: medium || "Sinhala",
            fileUrl,
            fileSize: fileSize || "1.2 MB",
            subjectId,
            typeId
        });

        await newPDF.save();
        const populated = await PDF.findById(newPDF._id)
            .populate({
                path: "subjectId",
                select: "name levelId streamIds",
                populate: [
                    { path: "levelId", select: "name" },
                    { path: "streamIds", select: "name" }
                ]
            })
            .populate("typeId", "name");

        res.status(201).json({ 
            success: true, 
            message: "Past paper PDF published successfully", 
            data: populated 
        });
    } catch (error) {
        console.error("Error creating PDF:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to create PDF record" });
    }
};

// @desc Update PDF (Admin only)
export const updatePDF = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updated = await PDF.findByIdAndUpdate(id, updateData, { new: true })
            .populate({
                path: "subjectId",
                select: "name levelId streamIds",
                populate: [
                    { path: "levelId", select: "name" },
                    { path: "streamIds", select: "name" }
                ]
            })
            .populate("typeId", "name");

        if (!updated) {
            return res.status(404).json({ success: false, message: "PDF document not found" });
        }

        res.status(200).json({ success: true, message: "PDF record updated", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update PDF" });
    }
};


// @desc Delete PDF (Admin only)
export const deletePDF = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await PDF.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "PDF document not found" });
        }

        res.status(200).json({ success: true, message: "PDF record deleted successfully", data: deleted });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete PDF" });
    }
};
