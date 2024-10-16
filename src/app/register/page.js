'use client';
import Image from "next/image";
import { useState } from 'react';
import Link from "next/link";
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [creatingUser, setCreatingUser] = useState(false);
    const [userCreated, setUserCreated] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    async function handleFormSubmit(ev) {
        ev.preventDefault();
        setCreatingUser(true);
        setErrorMessage('');
        setUserCreated(false);
        
        if (password !== password2) {
            setErrorMessage("Passwords do not match.");
            setCreatingUser(false);
            return;
        }

        const response = await fetch('/api/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password, password2 }),
            headers: { 'Content-Type': 'application/json' }
        });
        console.log(response);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData);
            setErrorMessage(errorData.error || "An error has occurred. Please try again later.");
        } else {
            setUserCreated(true);
            // Clear the fields after successful registration
            setName('');
            setEmail('');
            setPassword('');
            setPassword2('');
        }        
        setCreatingUser(false);        
    }

    return (
        <section className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleFormSubmit} className="w-128 mx-auto bg-white p-12 rounded-lg shadow-md">
                <h1 className="text-center text-primary text-4xl mb-6 font-bold">Register</h1>

                {userCreated && (
                    <div className="my-4 text-center text-green-600">
                        User has been successfully created.<br />Now you can{' '}
                        <Link className="underline" href={'/login'}>Login</Link>
                    </div>
                )}
                {errorMessage && (
                    <div className="my-4 text-center text-red-600">{errorMessage}</div>
                )}

                <div className="mb-6">
                    <input
                        disabled={creatingUser}
                        type="text"
                        name="name"
                        value={name}
                        onChange={ev => setName(ev.target.value)}
                        placeholder="Full Name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                    />
                </div>
                <div className="mb-6">
                    <input
                        disabled={creatingUser}
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
                        disabled={creatingUser}
                        type="password"
                        name="password"
                        value={password}
                        onChange={ev => setPassword(ev.target.value)}
                        placeholder="Password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                    />
                </div>
                <div className="mb-6">
                    <input
                        disabled={creatingUser}
                        type="password"
                        name="password2"
                        value={password2}
                        onChange={ev => setPassword2(ev.target.value)}
                        placeholder="Repeat Password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                    />
                </div>
                <button
                    disabled={creatingUser}
                    type="submit"
                    className="w-full bg-500 text-white px-4 py-3 rounded-md transition-colors duration-300 hover:bg-700 font-semibold" 
                >
                    Register
                </button>
                <div className="my-4 text-center text-gray-500">
                    or register with provider
                </div>
                <button
                    disabled={creatingUser}
                    onClick={() => {
                        setCreatingUser(true);
                        signIn('google', { callbackUrl: '/game' })
                            .catch((error) => {
                                console.error('Google sign-in error:', error);
                                setErrorMessage("Google sign-in failed. Please try again.");
                            })
                            .finally(() => {
                                setCreatingUser(false);
                            });
                    }}
                    type="button"
                    className="flex items-center justify-center w-full bg-gray-100 px-4 py-3 rounded-md transition-colors duration-300 hover:bg-gray-200"
                >
                    <Image src={'/google.png'} alt={'Google Logo'} width={24} height={24} />
                    <span className="ml-2">Register with Google</span>
                </button>
                <div className="text-center my-4 text-gray-500">
                    Existing account? <Link className="underline" href={'/login'}>Login Here &raquo;</Link>
                </div>
            </form>
        </section>
    );
}
