import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import {UserTask} from '../../models/UserTask';
import Task from '../../models/Task';
import { UserPoints } from '../../models/UserPoints';  // Import UserPoints model

async function connectToDatabase() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to the database");
  }
}

export async function POST(req) {  
    const { userId, taskId, taskStatus, userTaskStatus } = await req.json();
  
    if (!userId || !taskId || !taskStatus || !userTaskStatus) {
      return NextResponse.json({ error: 'UserId, TaskId, taskStatus, and userTaskStatus are required' }, { status: 400 });
    }
  
    try {
      await connectToDatabase();

      console.log(taskId);
      console.log(userId);

      // Find UserTask
      const userTask = await UserTask.findOne({ task_id: taskId });
      if (!userTask) {
        return NextResponse.json({ error: 'UserTask not found' }, { status: 404 });
      }
  
      // Update UserTask status
      userTask.status = userTaskStatus;
      await userTask.save();
  
      // Find Task
      const task = await Task.findById(taskId);
      if (!task) {
        return NextResponse.json({ error: 'Task not found' }, { status: 404 });
      }
  
      // Update Task status
      task.status = taskStatus;
      await task.save();
  
      // If taskStatus is 'completed', add points to the user
      if (taskStatus === 'completed') {
        // Find or create UserPoints for the user
        let userPoints = await UserPoints.findOne({ userId });
        if (!userPoints) {
          // Create a new UserPoints document if not found
          userPoints = new UserPoints({ userId, points: 0 });
        }
  
        // Add 20 points to the user
        userPoints.points += 20;
  
        // Update user's rank if necessary (you can adjust the rank calculation based on points)
        if (userPoints.points >= 200) {
          userPoints.rank = 'Gold';
        } else if (userPoints.points >= 100) {
          userPoints.rank = 'Silver';
        } else if (userPoints.points >= 0) {
          userPoints.rank = 'Bronze';
        } else {
          userPoints.rank = 'Platinum'; // Example rank logic, you can modify this
        }
  
        // Save the updated UserPoints
        await userPoints.save();
      }
  
      return NextResponse.json({ message: 'Task and UserTask statuses updated successfully' }, { status: 200 });
    } catch (error) {
      console.error('Error updating task and user-task statuses:', error);
      return NextResponse.json({ error: 'Error updating task and user-task statuses' }, { status: 500 });
    }
}
