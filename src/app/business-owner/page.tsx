'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardPage from '@/components/DashboardPage';

const BusinessOwnerPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); 
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage

        if (token) {
          const response = await fetch('/api/status', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`, // Include token in Authorization header
            },
          });

          const data = await response.json();

          if (data.authenticated) {
            setIsAuthenticated(true);
            router.push('/business-dashboard'); // Redirect to DashboardPage after login
          } else {
            setIsAuthenticated(false);
            router.push('/business-owner/login'); // Redirect to login if not authenticated
          }
        } else {
          setIsAuthenticated(false);
          router.push('/business-owner/login'); // Redirect to login if no token
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
        setIsAuthenticated(false);
        router.push('/business-owner/login'); // Redirect to login on error
      }
    };

    checkAuth();
  }, [router]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Show loading state while checking auth
  }

  return isAuthenticated ? <DashboardPage /> : null;
};

export default BusinessOwnerPage;