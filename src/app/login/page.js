'use client';
import Image from "next/image";

export default function LoginPage() {
    return (
        <section className="flex items-center justify-center min-h-screen bg-gray-100">
            <form className="w-128 mx-auto bg-white p-12 rounded-lg shadow-md"> {/* Increased max width */}
                <h1 className="text-center text-primary text-4xl mb-6 font-bold">Login</h1>
                <div className="mb-6">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                    />
                </div>
                <div className="mb-6">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-500 text-white px-4 py-3 rounded-md transition-colors duration-300 hover:bg-700 font-semibold"
                >
                    Login
                </button>
                <div className="my-4 text-center text-gray-500">
                    or login with provider
                </div>
                <button
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
