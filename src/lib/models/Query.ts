import mongoose from "mongoose";

const QuerySchema = new mongoose.Schema(
  {
    Name: String,
    Email: String,
    Subject: String,
    Message: String,
  },
  { timestamps: true }
);

export default mongoose.models.Query || mongoose.model("Query", QuerySchema);