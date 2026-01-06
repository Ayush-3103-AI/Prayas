import { useEffect, useState } from 'react';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'agent' | 'admin';
  onNavigate: (page: string) => void;
}

export function PrivateRoute({ children, requiredRole, onNavigate }: PrivateRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        onNavigate('landing');
        setIsLoading(false);
        return;
      }

      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          onNavigate('landing');
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        const userRole = data.data?.user?.role || data.data?.agent?.role || data.data?.admin?.role;

        if (requiredRole && userRole !== requiredRole) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          onNavigate('landing');
          setIsLoading(false);
          return;
        }

        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        onNavigate('landing');
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [requiredRole, onNavigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}



