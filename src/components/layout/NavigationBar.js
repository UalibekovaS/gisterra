"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function NavigationBar() {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <div className="mt-6 mb-6">
            <header> 
            <div className="hidden md:flex items-center justify-between">
                <Link className="pl-12 flex items-center gap-3" href="/">
                <Image
                            src="/gisterra-logo.png" // Replace with the actual image path
                            alt="GISTerra Logo"
                            width={50} // Set appropriate width
                            height={30} // Set appropriate height
                />
                <Image
                            src="/logo.png" // Replace with the actual image path
                            alt="GISTerra Logo"
                            width={170} // Set appropriate width
                            height={50} // Set appropriate height
                />
                
                </Link>

                <nav className="flex items-center gap-6 text-500 font-semibold ml-auto pr-12" aria-label="Main navigation">
                    <Link href="/#about" className="mt-2 hover:text-700 transition-colors">About</Link>
                    <Link href="/#contact" className="mt-2 hover:text-700 transition-colors">Contact</Link>
                    
                    {/* Get Started Button */}
                    <Link 
                        href="/register" 
                        className="groupflex items-center justify-center bg-500 text-white px-4 py-2 rounded-full transition-all duration-300 ease-in-out inline-flex items-center hover:bg-700 transition-colors"
                        onMouseEnter={() => setIsHovered(true)} // Set hover state
                        onMouseLeave={() => setIsHovered(false)} // Reset hover state
                    >
                        {/* Button text */}
                        <span className="relative leading-none text-base transition-all duration-300 ease-in-out" style={{ top: '4px' }}>
                            Get Started
                        </span>

                        {/* Arrow initially hidden with width 0 */}
                        <span 
                            className={`text-xl relative font-bold transition-all duration-300 ease-in-out ml-2 
                                ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-1'}`}
                            style={{ 
                                width: isHovered ? 'auto' : '0', // Auto width on hover
                                overflow: 'hidden', // Prevent layout shift
                                whiteSpace: 'nowrap', // Prevent text wrap
                                paddingLeft: isHovered ? '0.1rem' : '0',
                                transform: isHovered ? 'translateY(6px)' : 'translateY(0)', // Add padding when hovered
                            }} 
                        >
                            →
                        </span>
                    </Link>

                    {/* Sign In Button */}
                    <Link 
                        href="/login" 
                        className="border border-500 text-500 px-6 py-2 rounded-full flex items-center justify-center hover:bg-500 hover:text-white transition-colors relative" 
                         // Adjust margin for positioning
                    >
                        {/* Span for the text */}
                        <span className="relative" style={{ top: '4px' }}>
                            Sign In
                        </span>
                    </Link>
                </nav>
            </div>
        </header>
        </div>
    );
}
