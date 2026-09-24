import Subject from "../models/subject.model.js";
import PDF from "../models/pdf.model.js";
import User from "../models/user.model.js";
import Level from "../models/level.model.js";
import Stream from "../models/stream.model.js";

// @desc Get overview stats for admin panel
export const getAdminStats = async (req, res) => {
    try {
        const [totalSubjects, totalPDFs, totalUsers, totalLevels, totalStreams, recentPDFs] = await Promise.all([
            Subject.countDocuments(),
            PDF.countDocuments(),
            User.countDocuments(),
            Level.countDocuments(),
            Stream.countDocuments(),
            PDF.find({})
                .sort({ createdAt: -1 })
                .limit(5)
                .populate("subjectId", "name")
                .populate("typeId", "name")
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalSubjects,
                totalPDFs,
                totalUsers,
                totalLevels,
                totalStreams,
                recentPDFs
            }
        });
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({ success: false, message: "Failed to fetch dashboard stats" });
    }
};
