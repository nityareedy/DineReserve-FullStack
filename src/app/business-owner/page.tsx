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
        let token = localStorage.getItem('business-token') || localStorage.getItem('user-token');
        if (token) {
          const response = await fetch('/api/status', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          const data = await response.json();

          if (data.authenticated) {
            setIsAuthenticated(true);
            router.push('/business-dashboard');
          } else {
            setIsAuthenticated(false);
            router.push('/business-owner/login');
          }
        } else {
          setIsAuthenticated(false);
          router.push('/business-owner/login');
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
        setIsAuthenticated(false);
        router.push('/business-owner/login');
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