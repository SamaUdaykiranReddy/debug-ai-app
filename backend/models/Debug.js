import mongoose from "mongoose";

const debugSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    codeSnippet: {
      type: String,
      default: "",
    },
    errorMessage: { type: String, default: "" },
    solution: { type: String, default: "" },
    fixedCode: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "solved", "fixed"],
      default: "pending",
    },
  },

  {
    timestamps: true,
  },
);

export default mongoose.model("Debug", debugSchema);
