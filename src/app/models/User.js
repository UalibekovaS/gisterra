import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['user', 'organizer'], // Define possible roles
    default: 'user', // Default role is 'user'
    required: true 
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export { User };
