'use client';
import Image from "next/image";
import { useState } from 'react';
import Link from "next/link";
import { signIn } from 'next-auth/react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loggingIn, setLoggingIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    async function handleLoginSubmit(ev) {
        ev.preventDefault();
        setLoggingIn(true);
        setErrorMessage('');

        const response = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        if (!response.ok) {
            setErrorMessage(response.error || "An error occurred during login.");
        } else {
            // Redirect to the main page upon successful login
            window.location.href = '/game'; // Adjust this path to your main page
        }

        setLoggingIn(false);
    }

    return (
        <section className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleLoginSubmit} className="w-128 mx-auto bg-white p-12 rounded-lg shadow-md"> {/* Increased max width */}
                <h1 className="text-center text-primary text-4xl mb-6 font-bold">Login</h1>
                <div className="mb-6">
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={ev => setEmail(ev.target.value)}
                        placeholder="Email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                    />
                </div>
                <div className="mb-6">
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={ev => setPassword(ev.target.value)}
                        placeholder="Password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                    />
                </div>
                <button
                    disabled={loggingIn}
                    type="submit"
                    className="w-full bg-500 text-white px-4 py-3 rounded-md transition-colors duration-300 hover:bg-700 font-semibold"
                >
                    Login
                </button>
                <div className="text-center my-4 text-gray-500">
                    Don’t have an account? <Link className="underline" href={'/register'}>Register Here &raquo;</Link>
                </div>
                <div className="my-4 text-center text-gray-500">
                    or login with provider
                </div>
                <button
                    disabled={loggingIn}
                    onClick={() => {
                        setLoggingIn(true);
                        signIn('google', { callbackUrl: '/game' })
                            .catch((error) => {
                                console.error('Google sign-in error:', error);
                                setErrorMessage("Google sign-in failed. Please try again.");
                            })
                            .finally(() => {
                                setLoggingIn(false);
                            });
                    }}
                    type="button"
                    className="flex items-center justify-center w-full bg-gray-100 px-4 py-3 rounded-md transition-colors duration-300 hover:bg-gray-200"
                >
                    <Image src={'/google.png'} alt={'Google Logo'} width={24} height={24} />
                    <span className="ml-2">Login with Google</span>
                </button>
            </form>
        </section>
    );
}
