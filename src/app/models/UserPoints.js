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

// Pre-save middleware to update rank based on points
userPointsSchema.pre('save', function(next) {
  if (this.isModified('points')) {
    if (this.points >= 300) {
      this.rank = 'Platinum';
    } else if (this.points >= 200) {
      this.rank = 'Gold';
    } else if (this.points >= 100) {
      this.rank = 'Silver';
    } else {
      this.rank = 'Bronze';
    }
  }
  next(); // Proceed to save the document
});

const UserPoints = mongoose.models.UserPoints || mongoose.model("UserPoints", userPointsSchema);

export { UserPoints };
