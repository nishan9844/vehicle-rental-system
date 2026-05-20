import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // LOAD SESSION
  useEffect(() => {
    async function loadSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Session load error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // LOGIN
  async function login({ email, password }) {
    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      // CHECK ADMIN ROLE
      const { data: profile, error: profileError } =
        await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

      if (profileError) {
        return {
          success: false,
          error: profileError.message,
        };
      }

      // BLOCK NON-ADMINS
      if (
        String(profile?.role || "").toLowerCase() !==
        "admin"
      ) {
        await supabase.auth.signOut();

        return {
          success: false,
          error:
            "Access denied. Admin account required.",
        };
      }

      return {
        success: true,
        user: data.user,
      };
    } catch (err) {
      console.error("Login error:", err);

      return {
        success: false,
        error: err.message,
      };
    }
  }

  // LOGOUT
  async function logout() {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// CUSTOM HOOK
export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;