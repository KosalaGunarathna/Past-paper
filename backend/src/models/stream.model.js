import mongoose from "mongoose";

const streamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true // jaise: "Physical Science", "Math", "SFT"
    }
}, {
    timestamps: true
});

const Stream = mongoose.model("Stream", streamSchema);
export default Stream;