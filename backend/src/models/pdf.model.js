import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema({
    title: {
        type: String, // e.g. "2024 - Combined Mathematics Paper 1"
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    part: {
        type: String, // "Paper 1", "Paper 2", "Full Paper"
        default: "Paper 1"
    },
    medium: {
        type: String,
        enum: ["Sinhala", "English", "Tamil"],
        default: "Sinhala",
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    fileSize: {
        type: String,
        default: "1.2 MB"
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true
    },
    typeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Type",
        required: true
    }
}, {
    timestamps: true
});

// Search and filter index
pdfSchema.index({ subjectId: 1, year: 1, medium: 1, typeId: 1 });

const PDF = mongoose.model("PDF", pdfSchema);
export default PDF;