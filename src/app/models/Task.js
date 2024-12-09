import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['not assigned', 'assigned', 'waiting for approval', 'completed'],
    default: 'not assigned',
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Assuming you have a User model.
    default: null,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Organizer (creator) of the task
    required: true,
  },
}, {
  timestamps: true,  // To store created and updated times.
});

export const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);

export default Task; 