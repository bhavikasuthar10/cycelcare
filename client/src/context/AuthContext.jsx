import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('cyclecare_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.data.user);
      } catch (err) {
        setUser(null);
        setToken(null);
        localStorage.removeItem('cyclecare_token');
      } finally {
        setLoading(false);
      }
    };
    checkLoggedIn();
  }, [token]);

  const loginWithToken = (newToken, userData) => {
    localStorage.setItem('cyclecare_token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      localStorage.removeItem('cyclecare_token');
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout, loginWithToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);