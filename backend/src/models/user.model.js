import mongoose from "mongoose";
import bcrypt from "bcrypt";


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true },

    email: { 
        type: String,
        required: true,
        unique: true },

    password: { 
        type: String,
        required: true },
    
    imagePath: {
        type: String,
        required: false },
    
    role: {
        type: String,
        required: false,
        default: "user"
    }

},{
    timestamps: true 
});

// 🔒 Hash password before saving
userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    next();
});

// 🔐 Compare password method
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User=mongoose.model("User", userSchema);
export default User;