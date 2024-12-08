import { Task } from '../../models/Task';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route.js";
import mongoose from 'mongoose';
import { NextResponse } from 'next/server'; // Correct way to return JSON in Next.js

// Connect to the MongoDB database
async function connectToDatabase() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to the database");
  }
}

// CREATE Task
export async function POST(req) {
  const { title, description, userId, role } = await req.json();  // Use req.json() to parse JSON body

  if (!title || !description || !userId || !role) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  try {
    await connectToDatabase();  // Ensure DB connection is established

    const newTask = new Task({
      title,
      description,
      assignedTo: null,
      createdBy: userId,  // Insert userId into the task
      role,               // Insert role into the task
      status: 'not assigned',  // Default status
      createdAt: new Date(),
    });

    // Save task to MongoDB
    const savedTask = await newTask.save();

    return NextResponse.json(savedTask, { status: 200 }); // Return the created task
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Error creating task' }, { status: 500 });
  }
}




export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('createdBy');  // Extract userId from query params

  try {
    await connectToDatabase();  // Ensure DB connection is established

    // If userId is provided, filter by createdBy, otherwise fetch all tasks
    const tasks = userId
      ? await Task.find({ createdBy: userId }).exec()  // Filter tasks by createdBy
      : await Task.find().exec();  // Fetch all tasks if no createdBy filter

    return NextResponse.json(tasks, { status: 200 });  // Return the list of tasks
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Error fetching tasks' }, { status: 500 });
  }
}


