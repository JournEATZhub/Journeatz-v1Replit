import { useState } from "react";
import Navbar from "./Navbar";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type DeliveryStatus = "pending" | "in_progress" | "delivered";

type Delivery = {
  id: string;
  orderNumber: string;
  pickupName: string;
  pickupAddress: string;
  deliveryAddress: string;
  status: DeliveryStatus;
  amount: number;
  pickupTime: string;
  deliveryETA: string;
};

export default function DriverDashboard() {
  const { toast } = useToast();
  const [isAvailable, setIsAvailable] = useState(true);
  const [currentDelivery, setCurrentDelivery] = useState<Delivery>({
    id: "1",
    orderNumber: "A5782",
    pickupName: "Thai Basil Kitchen",
    pickupAddress: "123 Thai St, Downtown",
    deliveryAddress: "1234 Main St, Apt 5B",
    status: "in_progress",
    amount: 18.50,
    pickupTime: "12:30 PM",
    deliveryETA: "12:50 PM",
  });

  const [stats] = useState({
    todayDeliveries: 8,
    totalEarnings: "$126.50",
    avgRating: 4.8,
  });

  const handleAvailabilityChange = (checked: boolean) => {
    setIsAvailable(checked);
    toast({
      title: checked ? "You are now available" : "You are now unavailable",
      description: checked 
        ? "You will receive new delivery requests" 
        : "You won't receive new delivery requests",
    });
  };

  const handleNavigate = () => {
    toast({
      title: "Navigation Started",
      description: "Opening navigation to destination...",
    });
  };

  const handleCallCustomer = () => {
    toast({
      title: "Calling Customer",
      description: "Initiating call to customer...",
    });
  };

  const handleMarkDelivered = () => {
    setCurrentDelivery({ ...currentDelivery, status: "delivered" });
    toast({
      title: "Delivery Completed",
      description: "Order has been marked as delivered!",
      variant: "default",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Navbar title="Driver Dashboard" />

      {/* Current Status */}
      <Card className="bg-muted rounded-lg mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-2xl font-bold neon-green-text">
              Current Status
            </CardTitle>
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-300">Available</span>
              <Switch 
                checked={isAvailable} 
                onCheckedChange={handleAvailabilityChange}
                className="data-[state=checked]:bg-secondary"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black p-4 rounded-lg border border-gray-800">
              <h3 className="text-lg font-medium text-gray-300 mb-2">Today's Deliveries</h3>
              <p className="text-3xl font-bold neon-green-text">{stats.todayDeliveries}</p>
            </div>
            <div className="bg-black p-4 rounded-lg border border-gray-800">
              <h3 className="text-lg font-medium text-gray-300 mb-2">Total Earnings</h3>
              <p className="text-3xl font-bold neon-orange-text">{stats.totalEarnings}</p>
            </div>
            <div className="bg-black p-4 rounded-lg border border-gray-800">
              <h3 className="text-lg font-medium text-gray-300 mb-2">Avg. Rating</h3>
              <p className="text-3xl font-bold neon-green-text">{stats.avgRating}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Delivery */}
      <Card className="bg-muted rounded-lg mb-8">
        <CardContent className="p-6">
          <CardTitle className="text-2xl font-bold mb-4 neon-orange-text">
            Current Delivery
          </CardTitle>
          <div className="bg-black p-6 rounded-lg border border-gray-800">
            <div className="flex flex-col md:flex-row justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Order #{currentDelivery.orderNumber}</h3>
                <p className="text-gray-400 mb-1">Pickup: {currentDelivery.pickupName}</p>
                <p className="text-gray-400">Delivery: {currentDelivery.deliveryAddress}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <Badge 
                  variant="outline"
                  className={
                    currentDelivery.status === "delivered" 
                      ? "bg-secondary bg-opacity-20 text-secondary" 
                      : currentDelivery.status === "in_progress"
                      ? "bg-yellow-500 bg-opacity-20 text-yellow-500"
                      : "bg-blue-500 bg-opacity-20 text-blue-500"
                  }
                >
                  {currentDelivery.status === "in_progress" ? "In Progress" : 
                   currentDelivery.status === "delivered" ? "Delivered" : "Pending"}
                </Badge>
                <p className="text-lg font-bold neon-green-text mt-2">${currentDelivery.amount.toFixed(2)}</p>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-4">
              <div className="flex items-center mb-4">
                <div className="relative">
                  <div className="h-4 w-4 rounded-full bg-secondary"></div>
                  <div className="absolute top-4 left-1.5 h-10 border-l-2 border-gray-700"></div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">Pickup</p>
                  <p className="text-sm text-gray-400">{currentDelivery.pickupName} - {currentDelivery.pickupTime}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-4 w-4 rounded-full bg-primary"></div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">Delivery</p>
                  <p className="text-sm text-gray-400">{currentDelivery.deliveryAddress} - ETA {currentDelivery.deliveryETA}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-4">
              <Button 
                className="flex-1 py-2 bg-secondary text-black font-medium rounded-md hover:bg-opacity-90"
                onClick={handleNavigate}
                disabled={currentDelivery.status === "delivered"}
              >
                Navigate
              </Button>
              <Button 
                className="flex-1 py-2 bg-gray-800 text-white font-medium rounded-md hover:bg-gray-700"
                onClick={handleCallCustomer}
                disabled={currentDelivery.status === "delivered"}
              >
                Call Customer
              </Button>
              <Button 
                className="flex-1 py-2 bg-primary text-black font-medium rounded-md hover:bg-opacity-90"
                onClick={handleMarkDelivered}
                disabled={currentDelivery.status === "delivered"}
              >
                {currentDelivery.status === "delivered" ? "Delivered" : "Mark Delivered"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
