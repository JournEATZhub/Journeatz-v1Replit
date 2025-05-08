import Auth from "../components/Auth";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <Auth />;
}
