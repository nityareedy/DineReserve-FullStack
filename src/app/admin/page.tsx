'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminDashboard from '@/components/AdminDashboardPage';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); 
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token'); 

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
            router.push('/admin-dashboard'); 
          } else {
            setIsAuthenticated(false);
            router.push('/admin/login'); 
          }
        } else {
          setIsAuthenticated(false);
          router.push('/admin/login'); 
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
        setIsAuthenticated(false);
        router.push('/admin/login'); 
      }
    };

    checkAuth();
  }, [router]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; 
  }

  return isAuthenticated ? <AdminDashboard /> : null;
};

export default AdminPage;