import mongoose from "mongoose";
import { User } from "../../models/User"; // Import the User model
import { UserPoints } from "../../models/UserPoints"; // Import the UserPoints model
import { UserTask } from "../../models/UserTask"; // Import the UserTask model

// Function to connect to the database
async function connectToDatabase() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to the database");
  }
}

// Named export for the GET method
export async function GET(req) {
  try {
    // Retrieve userId from query params using URLSearchParams
    const url = new URL(req.url, `http://${req.headers.host}`); // Create a complete URL from the request
    const userId = url.searchParams.get("userId"); // Extract userId from the query params

    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID is required" }), { status: 400 });
    }

    // Connect to the database
    await connectToDatabase();

    // Fetch the user's details from the User collection
    const user = await User.findById(userId).select("name email");
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // Fetch the user's points and rank from the UserPoints collection
    let userPoints = await UserPoints.findOne({ userId });
    if (!userPoints) {
      // Create a new record with default points and rank if not found
      userPoints = new UserPoints({
        userId,
        points: 120, // Default simulated points
        rank: "Bronze", // Default rank
      });

      await userPoints.save();
    }

    // Fetch the user's completed tasks from the UserTask collection
    const completedTasks = await UserTask.find({ user_id: userId, status: "completed" }).select("title");

    // Return the user's details, points, rank, and completed tasks
    return new Response(
      JSON.stringify({
        name: user.name,
        email: user.email,
        points: userPoints.points,
        rank: userPoints.rank,
        completedTasks: completedTasks.map(task => task.title), // Return a list of task names
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
