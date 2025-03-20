import { createContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: number;
  email: string;
  name: string;
  surname: string;
  user_type: 'admin' | 'user';
}

export interface TokenData {
  access: string;
  refresh: string;
}

interface AuthContextType {
  user: User | null;
  login: (tokenData: TokenData, userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  getToken: () => Promise<string | null>;
  isLoading: boolean;
  isAdmin: () => boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data on mount
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error loading auth state:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshToken = async (): Promise<string | null> => {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) return null;

    try {
      const response = await fetch("http://localhost:8000/api/auth/token/refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ refresh }),
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data: TokenData = await response.json();
      // Store both tokens since ROTATE_REFRESH_TOKENS is true
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      return data.access;
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
      return null;
    }
  };

  const login = (tokenData: TokenData, userData: User) => {
    localStorage.setItem("access", tokenData.access);
    localStorage.setItem("refresh", tokenData.refresh);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    setUser(null);
  };

  const getToken = async (): Promise<string | null> => {
    const token = localStorage.getItem("access");
    if (!token) return null;

    // Since access token expires in 5 minutes, we should refresh proactively
    // Let's refresh if we're within 30 seconds of expiration
    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const timeUntilExpiry = expirationTime - currentTime;

      if (timeUntilExpiry < 30000) { // 30 seconds
        return await refreshToken();
      }

      return token;
    } catch (error) {
      console.error("Token validation failed:", error);
      return await refreshToken();
    }
  };

  const isAdmin = () => {
    return user?.user_type === 'admin';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        getToken,
        isLoading,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 