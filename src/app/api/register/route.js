import mongoose from "mongoose";
import { User } from "../../models/User";
import bcrypt from "bcrypt";

// Connect to the MongoDB database
async function connectToDatabase() {
    if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to the database");
    }
}

// Validate passwords
function validatePasswords(password, password2) {
    if (!password || password.length < 5) {
        return { valid: false, error: "Password must be at least 5 characters long." };
    }
    if (password !== password2) {
        return { valid: false, error: "Passwords do not match." };
    }
    return { valid: true };
}

// Hash password
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

export async function POST(req) {
    try {
        // Ensure database connection
        await connectToDatabase();

        // Parse the request body
        const body = await req.json();
        console.log("Received body:", body);

        // Destructure input data
        const { password, password2, name, email } = body;
        console.log("Received passwords:", { password, password2 });

        // Validate passwords
        const { valid, error } = validatePasswords(password, password2);
        if (!valid) {
            return new Response(JSON.stringify({ error }), { status: 400 });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return new Response(
                JSON.stringify({ error: "Email already exists. Please log in." }),
                { status: 400 }
            );
        }

        // Hash the password
        body.password = await hashPassword(password);

        // Create the user
        console.log("Creating user with data:", body);
        const createdUser = await User.create(body);
        console.log("User created:", createdUser);

        // Return the created user response
        return new Response(JSON.stringify(createdUser), { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
}
