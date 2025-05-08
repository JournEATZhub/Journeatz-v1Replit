import { createContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  userRole: string | null;
  login: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signup: (email: string, password: string, role: string) => Promise<{ data: any; error: any }>;
  logout: () => Promise<{ error: any }>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      setIsLoading(true);
      try {
        console.log("Checking auth status from provider...");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          throw error;
        }

        console.log("Session data:", data);

        if (data.session) {
          setIsAuthenticated(true);
          
          // Get user data from the user metadata
          const user = data.session.user;
          const userMeta = user.user_metadata || {};
          
          console.log("User metadata:", userMeta);
          
          // Construct user object from session data and metadata
          const userData = {
            id: user.id,
            email: user.email!,
            role: userMeta.role || 'customer',
            name: userMeta.name || user.email!.split('@')[0],
          };
          
          console.log("Setting user data:", userData);
          
          setUser(userData);
          setUserRole(userData.role);
        } else {
          console.log("No active session found");
          setIsAuthenticated(false);
          setUser(null);
          setUserRole(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
        setUser(null);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session);
        
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          if (session) {
            setIsAuthenticated(true);
            const user = session.user;
            const userMeta = user.user_metadata || {};
            
            const userData = {
              id: user.id,
              email: user.email!,
              role: userMeta.role || 'customer',
              name: userMeta.name || user.email!.split('@')[0],
            };
            
            setUser(userData);
            setUserRole(userData.role);
          }
        } else if (event === "SIGNED_OUT") {
          setIsAuthenticated(false);
          setUser(null);
          setUserRole(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting to log in with:", email);
      
      // For testing, let's try the pre-set credentials from the SQL file
      const testCredentials = [
        { email: "admin@journeatz.com", password: "Admin2020!" },
        { email: "driver@journeatz.com", password: "Driver2020!" },
        { email: "kitchen@journeatz.com", password: "Kitchen2020!" },
        { email: "customer@journeatz.com", password: "Customer2020!" }
      ];
      
      const isTestAccount = testCredentials.some(cred => 
        cred.email.toLowerCase() === email.toLowerCase() && cred.password === password
      );
      
      console.log("Is test account:", isTestAccount);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Login error from Supabase:", error);
        
        // If this is a test account, let's attempt to sign up first
        if (isTestAccount) {
          console.log("Attempting to create test account first");
          const role = email.split('@')[0].toLowerCase();
          
          const { error: signupError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                role,
                name: email.split('@')[0]
              }
            }
          });
          
          if (signupError) {
            console.error("Test account signup failed:", signupError);
            throw error; // Throw original error if signup also fails
          }
          
          // Try logging in again after signup
          const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (retryError) {
            throw retryError;
          }
          
          return { data: retryData, error: null };
        }
        
        throw error;
      }
      
      return { data, error: null };
    } catch (error: any) {
      console.error("Login error:", error.message);
      return { data: null, error };
    }
  };

  const signup = async (email: string, password: string, role: string) => {
    try {
      console.log("Attempting to sign up with:", { email, role });
      
      // First, create the auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            name: email.split('@')[0]
          }
        }
      });
      
      if (error) {
        console.error("Auth signup error:", error);
        throw error;
      }
      
      // Insert directly into users table is not needed - Supabase creates the user
      console.log("User signed up successfully:", data);
      
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

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        userRole,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}