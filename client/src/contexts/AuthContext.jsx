/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { clearDemoSession, setDemoSession, shouldUseLocalData } from '../services/localStore';

const AuthContext = createContext();
const DEMO_ADMIN_EMAIL = 'admin@vehiclerental.com';
const DEMO_ADMIN_PASSWORD = 'admin123';
const DEMO_ADMIN_USER = {
  id: 'demo-admin',
  name: 'Admin User',
  email: DEMO_ADMIN_EMAIL,
  role: 'admin',
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const getAdminProfile = async (userId) => {
  if (!userId || !supabase) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, role')
    .eq('id', userId)
    .eq('role', 'admin')
    .single();

  if (error || !data) return null;

  // Normalize full_name → name so the rest of the app stays consistent
  return { ...data, name: data.full_name };
};

export const AuthProvider = ({ children }) => {
  const hasDemoSession = shouldUseLocalData();
  const [isAuthenticated, setIsAuthenticated] = useState(hasDemoSession);
  const [user, setUser] = useState(hasDemoSession ? DEMO_ADMIN_USER : null);
  const [profile, setProfile] = useState(hasDemoSession ? DEMO_ADMIN_USER : null);
  const [loading, setLoading] = useState(Boolean(supabase && !hasDemoSession));

  const setAdminSession = async (sessionUser) => {
    const adminProfile = await getAdminProfile(sessionUser?.id);

    if (!adminProfile) {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setIsAuthenticated(false);
      return false;
    }

    setUser(sessionUser);
    setProfile(adminProfile);
    setIsAuthenticated(true);
    return true;
  };

  const setDemoAdminSession = () => {
    setDemoSession();
    setUser(DEMO_ADMIN_USER);
    setProfile(DEMO_ADMIN_USER);
    setIsAuthenticated(true);
  };

  useEffect(() => {
    let mounted = true;

    if (shouldUseLocalData()) {
      return () => {
        mounted = false;
      };
    }

    if (!supabase) {
      return () => {
        mounted = false;
      };
    }

    supabase.auth
      .getSession()
      .then(async ({ data: { session } }) => {
        if (!mounted) return;

        if (session?.user) {
          await setAdminSession(session.user);
        } else {
          setUser(null);
          setProfile(null);
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        if (!mounted) return;
        setUser(null);
        setProfile(null);
        setIsAuthenticated(false);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      setLoading(true);
      if (session?.user) {
        await setAdminSession(session.user);
      } else {
        setUser(null);
        setProfile(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail === DEMO_ADMIN_EMAIL && password === DEMO_ADMIN_PASSWORD) {
      setDemoAdminSession();
      return { success: true, user: DEMO_ADMIN_USER };
    }

    if (!supabase) {
      return {
        success: false,
        error: 'Supabase is not configured. Use the demo admin credentials shown below.',
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      const isAdmin = await setAdminSession(data.user);

      if (!isAdmin) {
        return { success: false, error: 'Access denied. This account is not an admin.' };
      }

      return { success: true, user: data.user };
    } catch {
      return { success: false, error: 'An unexpected error occurred.' };
    }
  };

  const logout = async () => {
    clearDemoSession();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, profile, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
