import mongoose from "mongoose";

// Define the schema for UserPoints
const userPointsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // This will reference the 'User' model
    required: true,
  },
  points: {
    type: Number,
    default: 0,
    required: true,
  },
  rank: {
    type: String,
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
    default: 'Bronze',
  },
});

const UserPoints = mongoose.models.UserPoints || mongoose.model("UserPoints", userPointsSchema);

export { UserPoints };
