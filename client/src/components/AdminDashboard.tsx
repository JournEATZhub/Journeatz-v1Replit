import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "./Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

type StatsType = {
  totalUsers: number;
  totalOrders: number;
  activeKitchens: number;
  activeDrivers: number;
};

type User = {
  id: string;
  email: string;
  role: string;
  created_at: string;
};

export default function AdminDashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState<StatsType>({
    totalUsers: 0,
    totalOrders: 0,
    activeKitchens: 0,
    activeDrivers: 0,
  });

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['/api/users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*');
      
      if (error) throw error;
      return data as User[];
    }
  });

  useEffect(() => {
    if (users) {
      // Calculate stats based on user data
      const kitchens = users.filter(user => user.role === 'kitchen').length;
      const drivers = users.filter(user => user.role === 'driver').length;
      
      setStats({
        totalUsers: users.length,
        totalOrders: Math.floor(Math.random() * 1000) + 500, // This would come from actual order data
        activeKitchens: kitchens,
        activeDrivers: drivers
      });
    }
  }, [users]);

  const handleEditUser = (userId: string) => {
    toast({
      title: "Edit User",
      description: `Editing user with ID: ${userId}`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    toast({
      title: "Delete User",
      description: `This would delete user with ID: ${userId}`,
      variant: "destructive",
    });
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Navbar title="Admin Dashboard" />
        <div className="bg-destructive/20 p-4 rounded-md text-white">
          Error loading dashboard: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Navbar title="Admin Dashboard" />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-muted p-6 rounded-lg border border-primary neon-orange-border">
          <h3 className="text-lg font-medium text-gray-300">Total Users</h3>
          <p className="text-3xl font-bold neon-orange-text">
            {isLoading ? "..." : stats.totalUsers}
          </p>
        </div>
        <div className="bg-muted p-6 rounded-lg border border-secondary neon-green-border">
          <h3 className="text-lg font-medium text-gray-300">Total Orders</h3>
          <p className="text-3xl font-bold neon-green-text">
            {isLoading ? "..." : stats.totalOrders}
          </p>
        </div>
        <div className="bg-muted p-6 rounded-lg border border-primary neon-orange-border">
          <h3 className="text-lg font-medium text-gray-300">Active Kitchens</h3>
          <p className="text-3xl font-bold neon-orange-text">
            {isLoading ? "..." : stats.activeKitchens}
          </p>
        </div>
        <div className="bg-muted p-6 rounded-lg border border-secondary neon-green-border">
          <h3 className="text-lg font-medium text-gray-300">Active Drivers</h3>
          <p className="text-3xl font-bold neon-green-text">
            {isLoading ? "..." : stats.activeDrivers}
          </p>
        </div>
      </div>

      {/* User Management */}
      <Card className="bg-muted rounded-lg mb-8">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4 neon-orange-text">User Management</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-300">
                      Loading users...
                    </td>
                  </tr>
                ) : users && users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        #{user.id.slice(0, 6)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Badge 
                          variant="outline"
                          className={
                            user.role === "admin" 
                              ? "bg-primary bg-opacity-20 text-primary" 
                              : user.role === "driver"
                              ? "bg-blue-500 bg-opacity-20 text-blue-500"
                              : user.role === "kitchen"
                              ? "bg-purple-500 bg-opacity-20 text-purple-500"
                              : "bg-secondary bg-opacity-20 text-secondary"
                          }
                        >
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <Button 
                          variant="ghost" 
                          className="text-secondary hover:text-opacity-80 mr-3"
                          onClick={() => handleEditUser(user.id)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="text-destructive hover:text-opacity-80"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-300">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
