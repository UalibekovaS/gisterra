import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

const client = new MongoClient(process.env.MONGO_URL);

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Connect to the database
        await client.connect();
        const database = client.db('test');
        const usersCollection = database.collection('users');

        // Find user by email
        const user = await usersCollection.findOne({ email: credentials.email });
        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          // Return user object with name, role, and userId included
          return { 
            name: user.name,
            email: user.email,    // Add name here
            role: user.role, 
            userId: user._id.toString() 
          };
        }
        return null; // Return null if the user is not found or password doesn't match
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      // When the user logs in or signs up, add name, userId, and role to the token
      if (user) {
        token.email = user.email;
        token.name = user.name; // Add user's name to the token
        token.role = user.role || 'user'; // Default to 'user' if no role
        token.userId = user.userId; // Save userId to the token
      }

      if (account) {
        token.accessToken = account.access_token; // Save the access token
      }

      return token;
    },
    async session({ session, token }) {
      // Attach the name, role, and userId to the session object
      session.accessToken = token.accessToken;
      session.name = token.name;  // Add name to the session
      session.role = token.role || 'user';
      session.userId = token.userId; // Add userId to the session
      return session;
    },
  },
  pages: {
    signIn: '/../login', // Custom sign-in page
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
