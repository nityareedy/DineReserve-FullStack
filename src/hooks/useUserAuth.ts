import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

interface AuthHookReturn {
  login: (email: string, password: string) => Promise<string | null>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean | null;
}

const USER_TOKEN_KEY = 'user-token';
const USER_TOKEN_EXPIRATION_KEY = 'user-token-expiration';
const TOKEN_EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 1 day in milliseconds

export const useUserAuth = (): AuthHookReturn => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem(USER_TOKEN_KEY);
        const expiration = localStorage.getItem(USER_TOKEN_EXPIRATION_KEY);
        const now = Date.now();

        if (token && expiration && parseInt(expiration) > now) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem(USER_TOKEN_KEY);
          localStorage.removeItem(USER_TOKEN_EXPIRATION_KEY);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<string | null> => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/loginUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        toast({
          title: "Success",
          description: "Login successful",
          variant: "default",
        });
        setIsAuthenticated(true);
        const expirationTime = Date.now() + TOKEN_EXPIRATION_TIME;
        localStorage.setItem(USER_TOKEN_KEY, data.token);
        localStorage.setItem(USER_TOKEN_EXPIRATION_KEY, expirationTime.toString());
        router.push('/restaurants');
        return data.token;
      } else {
        toast({
          title: "Error",
          description: data.error || 'Login failed',
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
      const response = await fetch('/api/auth/registerUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Registration successful",
          variant: "default",
        });
        router.push('/user/login');
      } else {
        toast({
          title: "Error",
          description: data.error || 'Registration failed',
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