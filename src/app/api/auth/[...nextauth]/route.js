import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { NextResponse } from 'next/server';

const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        // Add other providers as needed
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
