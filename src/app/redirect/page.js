'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const RedirectPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  console.log("Session role:", session?.role);
  useEffect(() => {
    // Prevent redirect while session is still loading
    if (status === 'loading') return;

    if (!session) {
      // Redirect to login if no session is found
      router.push('/login');
    } else if (session.role === 'organizer') {
      // Redirect to organizer dashboard
      router.push('/organizer-dashboard');
    } else {
      // Redirect to user dashboard
      router.push('/user-dashboard');
    }
  }, [session, status, router]);

  return <p>Redirecting...</p>;
};

export default RedirectPage;
