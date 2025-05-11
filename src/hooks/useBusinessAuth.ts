import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

interface AuthHookReturn {
  login: (email: string, password: string) => Promise<string | null>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean | null;
}

const TOKEN_KEY = 'business-token';
const TOKEN_EXPIRATION_KEY = 'business-token-expiration';
const TOKEN_EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 1 day in milliseconds

export const useBusinessAuth = (): AuthHookReturn => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem(TOKEN_KEY);
      const expiration = localStorage.getItem(TOKEN_EXPIRATION_KEY);
      const now = Date.now();

      if (token && expiration && parseInt(expiration) > now) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(TOKEN_EXPIRATION_KEY);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<string | null> => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        const data = await response.json(); 
        toast({
          title: "Success",
          description: "Login successful",
          variant: "default",
        });
        setIsAuthenticated(true); 
        const expirationTime = Date.now() + TOKEN_EXPIRATION_TIME;
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(TOKEN_EXPIRATION_KEY, expirationTime.toString());
        router.push('/business-owner');
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
  
  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Registration successful",
          variant: "default",
        });
        router.push('/business-owner/login');
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || 'Registration failed',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error during registration:', error);
      toast({
        title: "Error",
        description: 'An error occurred while registering',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { login, register, loading, isAuthenticated };
};
