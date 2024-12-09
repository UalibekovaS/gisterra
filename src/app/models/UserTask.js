import mongoose from 'mongoose';

// Define the Task Schema
const userTaskSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',  // Assuming you have a User model
    },
    task_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      minlength: 3,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const UserTask = mongoose.models.UserTask || mongoose.model('UserTask', userTaskSchema);

export default UserTask;  // Default export
