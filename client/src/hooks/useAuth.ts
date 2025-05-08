import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useToast } from "./use-toast";

interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { toast } = useToast();

  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }

      if (data.session) {
        setIsAuthenticated(true);
        
        // Get user details including role
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('email', data.session.user.email)
          .single();
        
        if (userError) {
          throw userError;
        }
        
        setUser({
          id: data.session.user.id,
          email: data.session.user.email!,
          role: userData.role,
          name: userData.name || userData.email.split('@')[0],
        });
        
        setUserRole(userData.role);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setUserRole(null);
      }
    } catch (error: any) {
      console.error("Auth check error:", error.message);
      setIsAuthenticated(false);
      setUser(null);
      setUserRole(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    
    // Set up listener for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          await checkAuth();
        } else if (event === "SIGNED_OUT") {
          setIsAuthenticated(false);
          setUser(null);
          setUserRole(null);
        }
      }
    );
    
    return () => {
      // Clean up the subscription
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [checkAuth]);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      await checkAuth();
      return { data, error: null };
    } catch (error: any) {
      console.error("Login error:", error.message);
      return { data: null, error };
    }
  };

  const signup = async (email: string, password: string, role: string) => {
    try {
      // First, create the auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      // Then, add user to our users table with the role
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          { email, role, name: email.split('@')[0] },
        ]);
      
      if (insertError) {
        throw insertError;
      }
      
      return { data, error: null };
    } catch (error: any) {
      console.error("Signup error:", error.message);
      return { data: null, error };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setIsAuthenticated(false);
      setUser(null);
      setUserRole(null);
      
      toast({
        title: "Logged out successfully",
      });
      
      return { error: null };
    } catch (error: any) {
      console.error("Logout error:", error.message);
      return { error };
    }
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    userRole,
    login,
    signup,
    logout,
    checkAuth,
  };
}
