import UserTask from '../../models/UserTask';  // Correct import for default export
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

// Connect to the MongoDB database
async function connectToDatabase() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to the database");
  }
}

// CREATE Task and Assign User
export async function POST(req) {
  const { userId, taskId, taskName } = await req.json();  // Parse JSON body
  
  // Validate the input data
  if (!userId || !taskId || !taskName) {
    return NextResponse.json({ error: 'UserId, TaskId, and TaskName are required' }, { status: 400 });
  }

  try {
    await connectToDatabase();  // Ensure DB connection is established

    // Step 1: Create the UserTask document (user-task relation)
    const newUserTask = new UserTask({
      user_id: userId,
      task_id: taskId,
      title: taskName,
      status: 'pending',  // Default status
    });

    // Save the UserTask document
    await newUserTask.save();

    // Step 2: Find the task in the tasks collection and update its assigned status
    // Convert taskId to ObjectId since taskId is a string and _id is an ObjectId
    const task = await mongoose.model('Task').findById(taskId);
    
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Update the task to assign it to the user and change its status to 'assigned'
    task.assignedTo = userId;  // Assuming 'assignedTo' is the field for user ID in tasks collection
    task.status = 'assigned';  // Set the task status to 'assigned'

    // Save the updated task
    await task.save();

    return NextResponse.json(newUserTask, { status: 200 });  // Send back the saved UserTask document
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Error creating task' }, { status: 500 });
  }
}
