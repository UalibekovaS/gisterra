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
                return { email: user.email };
              }
              return null; // Return null if the user is not found or password doesn't match
            },
          }),
        ],
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token; // Save the access token for later use
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken; // Attach the access token to the session
            return session;
        },
    },
    pages: {
        signIn: '/../login', // Custom sign-in page
    },
    // Additional NextAuth.js options can be configured here
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }
