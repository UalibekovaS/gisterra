import { Task } from '../../models/Task';
import { getSession } from 'next-auth/react';
import mongoose from 'mongoose';

async function connectToDatabase() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to the database");
  }
}

export async function PATCH(req, res) {
  const { taskId } = req.query;
  const session = await getSession({ req });
  if (!session || session.role !== 'organizer') {
    return res.status(403).json({ error: 'Only organizers can approve tasks' });
  }

  const { status } = req.body;
  if (!['pending', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    await connectToDatabase();

    const task = await Task.findByIdAndUpdate(
      taskId,
      { status },
      { new: true }
    ).populate('assignedTo', 'name');
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update task' });
  }
}
