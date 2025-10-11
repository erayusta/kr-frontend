
import { useState, useEffect } from 'react';
import apiRequest, { fetchData } from '@/lib/apiRequest';



const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const data = await apiRequest('/auth/me', 'get', {}, true);
          if (data && data.user) {
            setIsLoggedIn(true);
            setProfile(data.user);
          } else {
            // Invalid response
            localStorage.removeItem('token');
            setIsLoggedIn(false);
            setProfile(null);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('[Auth Error]', error.message);
        // Clear invalid token on auth error
        if (error.response && (error.response.status === 401 || error.response.status === 500)) {
          localStorage.removeItem('token');
        }
        setIsLoggedIn(false);
        setProfile(null);
        setLoading(false);
      }
    };

    // Only run on client side
    if (typeof window !== 'undefined') {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  return { isLoggedIn, profile, loading };
};

export default useAuth;
