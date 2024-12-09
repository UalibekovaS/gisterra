'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import NavigationBar from "@/components/layout/NavigationBar";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session, status } = useSession(); // Get session data
  const router = useRouter(); // Initialize the router
  const [loading, setLoading] = useState(true); // Local loading state to handle session check

  useEffect(() => {
    // Wait for session loading to complete
    if (status === "loading") return;

    // If there's no session, stay on the current page
    if (!session) {
      setLoading(false);
      return;
    }

    // If the user is logged in, redirect based on their role
    if (session.user) {
      if (session.user.role === "user") {
        router.push("/user-dashboard"); // Redirect to user dashboard
      } else if (session.user.role === "organizer") {
        router.push("/organizer-dashboard"); // Redirect to organizer dashboard
      }
    }

    // Set loading to false once session is checked
    setLoading(false);
  }, [session, status, router]);

  // Show loading state while the session is being checked
  if (loading || status === "loading") {
    return <div>Loading...</div>; // Or a loading spinner, if you'd prefer
  }

  return (
    <div className="min-h-screen">
      <NavigationBar />
      <div className="relative">
        {/* Background Image */}
        <div
          className="h-[calc(100vh-64px)] bg-cover bg-center"
          style={{ backgroundImage: "url('main-page.png')" }}
        ></div>

        {/* Overlay Container with Welcome Text */}
        <div className="absolute inset-0 flex justify-center items-center">
          <div
            className="text-white text-6xl font-bold bg-black bg-opacity-85 p-12 rounded-3xl shadow-lg w-[35%] h-[55%] text-center"
            style={{ transform: "translateY(-50px)" }}
          >
            <div className="mb-4">Welcome</div>
            <div className="mb-4">to</div>
            <div>GISTerra</div>
            <Link
              href="/register"
              className="group flex items-center justify-center bg-500 text-white px-5 py-5 rounded-full transition-all duration-300 ease-in-out inline-flex items-center hover:bg-700 transition-colors"
            >
              <span
                className="relative leading-none text-2xl transition-all duration-300 ease-in-out"
                style={{ top: "5px" }}
              >
                Let's Start
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
