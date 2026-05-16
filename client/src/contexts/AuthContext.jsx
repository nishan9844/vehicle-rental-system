import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthContext: Initializing authentication check');
    // Check if user is logged in on app start
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');
    
    console.log('AuthContext: Token found:', !!token);
    console.log('AuthContext: User data found:', !!userData);
    
    if (token && userData) {
      try {
        setIsAuthenticated(true);
        const parsedUser = JSON.parse(userData);
        if (parsedUser.name === 'Administrator') {
          parsedUser.name = 'Nishan';
        }
        setUser(parsedUser);
        console.log('AuthContext: User authenticated successfully');
      } catch (error) {
        console.error('AuthContext: Error parsing user data:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      }
    }
    setLoading(false);
    console.log('AuthContext: Authentication check completed');
  }, []);

  const login = async (credentials) => {
    console.log('AuthContext: Login attempt with:', credentials.email);
    try {
      // For demo purposes, accept hardcoded credentials
      // In production, this would be an API call
      if (credentials.email === 'admin@vehiclerental.com' && credentials.password === 'admin123') {
        const userData = {
          email: credentials.email,
          name: 'Nishan',
          role: 'admin'
        };
        
        const token = btoa(JSON.stringify(userData));
        
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminUser', JSON.stringify(userData));
        
        setIsAuthenticated(true);
        setUser(userData);
        console.log('AuthContext: Login successful');
        return { success: true };
      } else {
        console.log('AuthContext: Invalid credentials');
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
