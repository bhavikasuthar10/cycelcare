import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on page load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        // We'll use our stats/insights route as a "check"
        // If it succeeds, the user is authenticated
        const res = await api.get('/auth/me'); // We might need to add this route to backend
        setUser(res.data.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading , logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
const logout = async () => {
  try {
    await api.post('/auth/logout');
    setUser(null);
  } catch (err) {
    console.error("Logout failed", err);
  }
};