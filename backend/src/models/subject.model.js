import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true // jaise: "Combined Mathematics", "Buddhism"
    },
    levelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Level",
        required: true
    },
    streamIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stream"
    }]
}, {
    timestamps: true
});

const Subject = mongoose.model("Subject", subjectSchema);
export default Subject;