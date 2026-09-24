import mongoose from "mongoose";

const languageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

const Language = mongoose.model("Language", languageSchema);
export default Language;