'use client';  // Ensure this is at the top of the file

import { useSession, signOut } from 'next-auth/react'; // Import signOut from next-auth to log out
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import styles from './UserDashboard.module.css'; // Import a custom CSS module for styling

const UserDashboard = () => {
  const { data: session } = useSession();
  const [points, setPoints] = useState(0); // State to store user's points
  const [rank, setRank] = useState('Bronze'); // State to store user's rank
  const router = useRouter(); // Initialize useRouter hook for navigation
  
  useEffect(() => {
    // Fetch the user's points and calculate their rank when the component mounts
    if (session && session.userId) {
      const fetchUserPoints = async () => {
        const response = await fetch(`/api/get-user-points?userId=${session.userId}`);
        const data = await response.json();
        const userPoints = data.points || 0;
      
        setPoints(userPoints);
        setRank(data.rank || 'Bronze'); // Use rank from response, default to 'Bronze'

        // Determine the rank based on the points (if not already set by backend)
        if (userPoints >= 300) {
          setRank('Platinum');
        } else if (userPoints >= 200) {
          setRank('Gold');
        } else if (userPoints >= 100) {
          setRank('Silver');
        } else {
          setRank('Bronze');
        }
      };

      fetchUserPoints();
    }
  }, [session]);

  if (!session) {
    return <p>You need to be logged in to view this page.</p>;
  }

  const progress = (points / 300) * 100; // Calculate progress percentage (assuming 300 is the max points for Platinum)

  const goToGisTerra = () => {
    if (session) {
      const userId = session.userId;  // Get userId from the session or context
      const gameUrl = `http://localhost:3000/GisTerra/index.html?userId=${userId}`;
      window.location.href = gameUrl;  // Redirect to the game page with the userId in the URL
    } else {
      console.error('User not authenticated');
    }
  };

  // Handle logout and redirect to the main page
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.card}>
        <h1 className={styles.title}>User Dashboard</h1>
        <div className={styles.userInfo}>
          <p className={styles.greeting}>Welcome, {session.user.name}!</p>
          <div className={styles.rank}>
            <span className={styles.rankBadge}>{rank}</span>
          </div>
        </div>

        <div className={styles.pointsContainer}>
          <p className={styles.points}>Your Points: {points}</p>
          <div className={styles.progressBarContainer}>
            <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className={styles.rankInfo}>
          <p className={styles.rankDescription}>
            <strong>Rank Description:</strong>
            <ul>
              <li>Bronze: 0 - 99 points</li>
              <li>Silver: 100 - 199 points</li>
              <li>Gold: 200 - 299 points</li>
              <li>Platinum: 300+ points</li>
            </ul>
          </p>
        </div>

        <div className={styles.buttons}>
          <button className={styles.goToGisTerraButton} onClick={goToGisTerra}>Go to GisTerra</button>
          <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
