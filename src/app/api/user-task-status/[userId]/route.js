import mongoose from 'mongoose';
import UserTask from '../../../models/UserTask';

// Connect to the MongoDB database
async function connectToDatabase() {
    if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to the database");
    }
}

export async function GET(req, { params }) {
    const { userId } = params; // Extract the userId from the dynamic route

    try {
        // Connect to the database
        await connectToDatabase();

        // Fetch the user's task
        const userTask = await UserTask.findOne({ user_id: userId, status: 'pending' });
        console.log(userTask);

        if (!userTask) {
            // If no task is found, return a 404 response
            return new Response(JSON.stringify({ message: 'User has no assigned tasks.' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // If a task is found, return its details
        const taskDetails = {
            status: userTask.status,
            task: {
                _id: userTask.task_id,
                title: userTask.title,
                status: userTask.status,
            },
        };

        return new Response(JSON.stringify(taskDetails), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching user task status:', error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
