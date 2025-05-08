import { useState } from "react";
import Navbar from "./Navbar";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "../hooks/useAuth";

type Kitchen = {
  id: string;
  name: string;
  cuisine: string;
  distance: string;
  rating: number;
  reviews: number;
  imageUrl: string;
};

type OrderItem = {
  name: string;
  quantity: number;
};

type Order = {
  id: string;
  orderNumber: string;
  kitchen: string;
  status: "pending" | "in_progress" | "delivered" | "cancelled";
  orderedAt: string;
  estimatedDelivery: string;
  items: OrderItem[];
  total: number;
  progress: number;
};

type HistoryOrder = {
  id: string;
  orderNumber: string;
  kitchen: string;
  date: string;
  total: number;
  status: "delivered" | "cancelled";
};

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [featuredKitchens] = useState<Kitchen[]>([
    {
      id: "1",
      name: "Thai Basil Kitchen",
      cuisine: "Thai",
      distance: "0.8 miles away",
      rating: 4,
      reviews: 124,
      imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300"
    },
    {
      id: "2",
      name: "Saigon Street",
      cuisine: "Vietnamese",
      distance: "1.2 miles away",
      rating: 5,
      reviews: 89,
      imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300"
    },
  ]);

  const [currentOrder] = useState<Order>({
    id: "1",
    orderNumber: "A5782",
    kitchen: "Thai Basil Kitchen",
    status: "in_progress",
    orderedAt: "12:15 PM",
    estimatedDelivery: "12:50 PM",
    items: [
      { name: "Pad Thai - Chicken", quantity: 1 },
      { name: "Green Curry - Medium Spicy", quantity: 1 },
      { name: "Thai Iced Tea", quantity: 1 },
    ],
    total: 32.45,
    progress: 30,
  });

  const [orderHistory] = useState<HistoryOrder[]>([
    {
      id: "1",
      orderNumber: "A5775",
      kitchen: "Saigon Street",
      date: "Apr 28, 2023",
      total: 27.95,
      status: "delivered",
    },
    {
      id: "2",
      orderNumber: "A5768",
      kitchen: "Thai Basil Kitchen",
      date: "Apr 25, 2023",
      total: 34.50,
      status: "delivered",
    },
  ]);

  const handleViewMenu = (kitchenId: string) => {
    console.log(`View menu for kitchen ${kitchenId}`);
  };

  const handleTrackOrder = () => {
    console.log("Track order");
  };

  const handleOrderAgain = (orderId: string) => {
    console.log(`Order again ${orderId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Navbar title={`Welcome, ${user?.name || 'Customer'}!`} />

      {/* Featured Kitchens */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold neon-green-text mb-6">Featured Kitchens</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredKitchens.map((kitchen) => (
            <div key={kitchen.id} className="bg-muted rounded-lg overflow-hidden">
              <img 
                src={kitchen.imageUrl} 
                alt={kitchen.name} 
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-1">{kitchen.name}</h3>
                <p className="text-sm text-gray-400 mb-2">{kitchen.cuisine} • {kitchen.distance}</p>
                <div className="flex items-center mb-4">
                  <div className="text-primary">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>{i < kitchen.rating ? "★" : "☆"}</span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-400 ml-1">({kitchen.reviews})</span>
                </div>
                <Button 
                  className="w-full py-2 bg-secondary text-black font-medium rounded-md hover:bg-opacity-90"
                  onClick={() => handleViewMenu(kitchen.id)}
                >
                  View Menu
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Orders */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold neon-orange-text mb-6">Current Orders</h2>
        <Card className="bg-muted p-6 rounded-lg">
          <CardContent className="p-0">
            <div className="border-b border-gray-700 pb-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{currentOrder.kitchen}</h3>
                  <p className="text-sm text-gray-400">Order #{currentOrder.orderNumber} • Placed at {currentOrder.orderedAt}</p>
                </div>
                <Badge 
                  variant="outline"
                  className="bg-yellow-500 bg-opacity-20 text-yellow-500"
                >
                  {currentOrder.status === "in_progress" ? "In Progress" : 
                   currentOrder.status === "delivered" ? "Delivered" : 
                   currentOrder.status === "pending" ? "Pending" : "Cancelled"}
                </Badge>
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Items:</h4>
                <ul className="text-sm text-gray-400">
                  {currentOrder.items.map((item, index) => (
                    <li key={index}>{item.quantity}x {item.name}</li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-300">
                  Estimated delivery: <span className="text-secondary">{currentOrder.estimatedDelivery}</span>
                </p>
                <span className="text-lg font-bold neon-orange-text">${currentOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1 pr-4">
                <h4 className="text-sm font-medium text-gray-300 mb-1">Delivery Progress</h4>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block text-secondary">
                        Preparing
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-gray-400">
                        On the way
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-gray-400">
                        Delivered
                      </span>
                    </div>
                  </div>
                  <Progress value={currentOrder.progress} className="h-2 bg-gray-700" indicatorClassName="bg-secondary" />
                </div>
              </div>
              <Button 
                className="px-4 py-2 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-700"
                onClick={handleTrackOrder}
              >
                Track Order
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order History */}
      <div>
        <h2 className="text-2xl font-bold neon-green-text mb-6">Order History</h2>
        <Card className="bg-muted rounded-lg">
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Kitchen</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {orderHistory.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">#{order.orderNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.kitchen}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${order.total.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge 
                          variant="outline"
                          className="bg-secondary bg-opacity-20 text-secondary"
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Button 
                          variant="ghost"
                          className="text-primary hover:text-opacity-80"
                          onClick={() => handleOrderAgain(order.id)}
                        >
                          Order Again
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
