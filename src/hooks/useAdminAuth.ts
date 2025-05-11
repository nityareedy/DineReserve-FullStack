import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

interface AuthHookReturn {
  login: (email: string, password: string) => Promise<string | null>;
  loading: boolean;
  isAuthenticated: boolean | null; 
}

const ADMIN_TOKEN_KEY = 'admin-token';
const ADMIN_TOKEN_EXPIRATION_KEY = 'admin-token-expiration';
const TOKEN_EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 1 day in milliseconds

export const useAdminAuth = (): AuthHookReturn => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem(ADMIN_TOKEN_KEY);
      const expiration = localStorage.getItem(ADMIN_TOKEN_EXPIRATION_KEY);
      const now = Date.now();

      if (token && expiration && parseInt(expiration) > now) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        localStorage.removeItem(ADMIN_TOKEN_EXPIRATION_KEY);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<string | null> => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/loginAdmin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        const data = await response.json(); 
        toast({
          description: "Login successful",
        })
        setIsAuthenticated(true); 
        const expirationTime = Date.now() + TOKEN_EXPIRATION_TIME;
        localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
        localStorage.setItem(ADMIN_TOKEN_EXPIRATION_KEY, expirationTime.toString());
        router.push('/admin-dashboard'); 
        return data.token; 
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || 'Login failed',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast({
        title: "Error",
        description: 'An error occurred while logging in',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  
    return null; 
  };
  
  return { login, loading, isAuthenticated };
};
