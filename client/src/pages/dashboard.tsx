import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useLocation } from "wouter";
import AdminDashboard from "../components/AdminDashboard";
import DriverDashboard from "../components/DriverDashboard";
import KitchenDashboard from "../components/KitchenDashboard";
import CustomerDashboard from "../components/CustomerDashboard";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { isAuthenticated, isLoading, userRole } = useAuth();
  const [, setLocation] = useLocation();
  const [isLoadingRole, setIsLoadingRole] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/auth");
    } else if (!isLoading && userRole) {
      setIsLoadingRole(false);
    }
  }, [isAuthenticated, isLoading, userRole, setLocation]);

  if (isLoading || isLoadingRole) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  switch (userRole) {
    case "admin":
      return <AdminDashboard />;
    case "driver":
      return <DriverDashboard />;
    case "kitchen":
      return <KitchenDashboard />;
    default:
      return <CustomerDashboard />;
  }
}
