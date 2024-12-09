import mongoose from "mongoose";
import { UserPoints } from "../../models/UserPoints"; // Import the UserPoints model

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
    const url = new URL(req.url, `http://${req.headers.host}`);  // Creating a complete URL from the request
    const userId = url.searchParams.get('userId'); // Extracting the userId from the query params
    console.log(userId);

    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID is required" }), { status: 400 });
    }

    // Connect to the database
    await connectToDatabase();

    // Fetch the user's points from the UserPoints collection
    let userPoints = await UserPoints.findOne({ userId });

    // If no user points found, create a new record with default points and rank
    if (!userPoints) {
      userPoints = new UserPoints({
        userId,
        points: 120,  // Default simulated points
        rank: 'Silver', // Default rank
      });

      // Save the new record to the database
      await userPoints.save();
    }

    // Return the points and rank of the user
    return new Response(
      JSON.stringify({
        points: userPoints.points,
        rank: userPoints.rank,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
