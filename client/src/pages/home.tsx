import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/useAuth";
import Logo from "../components/Logo";

export default function Home() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, setLocation]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <Logo className="mx-auto w-64 h-64" />
        
        <h1 className="text-4xl md:text-5xl font-bold mt-6 mb-4 neon-orange-text">
          Welcome to JournEATZ
        </h1>
        
        <p className="max-w-md mx-auto text-xl text-gray-300 mb-8">
          Your premier food delivery platform connecting amazing kitchens, efficient drivers, and hungry customers.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            onClick={() => setLocation("/auth")}
            className="px-8 py-3 bg-primary text-black font-bold text-lg rounded-md hover:bg-opacity-90 transition-all shadow-[0_0_15px_#FFA500]"
          >
            Log In
          </Button>
          
          <Button 
            onClick={() => setLocation("/auth")}
            variant="outline"
            className="px-8 py-3 border-2 border-secondary text-secondary font-bold text-lg rounded-md hover:bg-secondary hover:bg-opacity-10 transition-all shadow-[0_0_15px_#00FF00]"
          >
            Sign Up
          </Button>
        </div>
      </div>

      <div className="mt-12 text-center text-gray-400 text-sm">
        <p>© 2023 JournEATZ. All rights reserved.</p>
      </div>
    </div>
  );
}
