import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Job title is required'],
        trim: true
    },
    company: { type: String, required: true },
    status: { type: String, enum: ["pending", "interview", "rejected", "offered"], default: "pending" },
    appliedDate: { type: Date, default: Date.now },
    userId: { type: String, required: true, index: true },
    salary: { type: Number },
    location: { type: String },
}, { timestamps: true })

JobSchema.index({ title: 'text', company: 'text' })

export default mongoose.models.Job || mongoose.model("Job", JobSchema)