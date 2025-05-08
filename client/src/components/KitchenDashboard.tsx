import { useState } from "react";
import Navbar from "./Navbar";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

type OrderItem = {
  name: string;
  quantity: number;
  notes?: string;
};

type Order = {
  id: string;
  orderNumber: string;
  status: "new" | "in_progress" | "ready" | "completed" | "cancelled";
  orderedAt: string;
  items: OrderItem[];
};

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  status: "available" | "unavailable";
  emoji: string;
};

export default function KitchenDashboard() {
  const { toast } = useToast();
  const [isKitchenOpen, setIsKitchenOpen] = useState(true);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "1",
      orderNumber: "A5782",
      status: "new",
      orderedAt: "12:15 PM",
      items: [
        { name: "Pad Thai - Chicken", quantity: 1 },
        { name: "Green Curry - Medium Spicy", quantity: 1 },
        { name: "Thai Iced Tea", quantity: 1 },
      ],
    },
    {
      id: "2",
      orderNumber: "A5780",
      status: "in_progress",
      orderedAt: "12:00 PM",
      items: [
        { name: "Pineapple Fried Rice", quantity: 2 },
        { name: "Tom Yum Soup", quantity: 1 },
        { name: "Thai Iced Coffee", quantity: 2 },
      ],
    },
  ]);

  const [menuItems] = useState<MenuItem[]>([
    {
      id: "1",
      name: "Pad Thai",
      description: "Rice noodles, egg, tofu, bean sprouts",
      price: 12.99,
      category: "Noodles",
      status: "available",
      emoji: "🍜",
    },
    {
      id: "2",
      name: "Green Curry",
      description: "Coconut milk, green curry paste, vegetables",
      price: 14.99,
      category: "Curry",
      status: "available",
      emoji: "🍚",
    },
  ]);

  const handleKitchenStatusChange = (checked: boolean) => {
    setIsKitchenOpen(checked);
    toast({
      title: checked ? "Kitchen is now open" : "Kitchen is now closed",
      description: checked 
        ? "You will receive new orders" 
        : "You won't receive new orders",
    });
  };

  const handleAcceptOrder = (orderId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: "in_progress" } 
        : order
    ));
    toast({
      title: "Order Accepted",
      description: "Order has been accepted and is now in progress",
    });
  };

  const handleDeclineOrder = (orderId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: "cancelled" } 
        : order
    ));
    toast({
      title: "Order Declined",
      description: "Order has been declined",
      variant: "destructive",
    });
  };

  const handleMarkReady = (orderId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: "ready" } 
        : order
    ));
    toast({
      title: "Order Ready",
      description: "Order has been marked as ready for pickup",
    });
  };

  const handleAddMenuItem = () => {
    toast({
      title: "Add Menu Item",
      description: "This would open a form to add a new menu item",
    });
  };

  const handleEditMenuItem = (menuItemId: string) => {
    toast({
      title: "Edit Menu Item",
      description: `This would edit menu item with ID: ${menuItemId}`,
    });
  };

  const handleRemoveMenuItem = (menuItemId: string) => {
    toast({
      title: "Remove Menu Item",
      description: `This would remove menu item with ID: ${menuItemId}`,
      variant: "destructive",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Navbar title="Kitchen Dashboard" />

      {/* Orders Queue */}
      <Card className="bg-muted rounded-lg mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <CardTitle className="text-2xl font-bold neon-orange-text">
              Orders Queue
            </CardTitle>
            <div>
              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-300">Kitchen Status</span>
                <Switch 
                  checked={isKitchenOpen} 
                  onCheckedChange={handleKitchenStatusChange}
                  className="data-[state=checked]:bg-secondary"
                />
              </div>
              <Badge 
                variant="outline"
                className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-secondary bg-opacity-20 text-secondary mt-2"
              >
                {isKitchenOpen ? "Kitchen Open" : "Kitchen Closed"}
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div key={order.id} className="bg-black p-4 rounded-lg border border-gray-800">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">#{order.orderNumber}</h3>
                      <p className="text-sm text-gray-400">Ordered: {order.orderedAt}</p>
                    </div>
                    <Badge 
                      variant="outline"
                      className={
                        order.status === "new" 
                          ? "bg-yellow-500 bg-opacity-20 text-yellow-500" 
                          : order.status === "in_progress"
                          ? "bg-blue-500 bg-opacity-20 text-blue-500"
                          : order.status === "ready"
                          ? "bg-secondary bg-opacity-20 text-secondary"
                          : "bg-red-500 bg-opacity-20 text-red-500"
                      }
                    >
                      {order.status === "new" ? "New Order" : 
                       order.status === "in_progress" ? "In Progress" : 
                       order.status === "ready" ? "Ready" : "Cancelled"}
                    </Badge>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Items:</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      {order.items.map((item, index) => (
                        <li key={index}>{item.quantity}x {item.name}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    {order.status === "new" && (
                      <>
                        <Button 
                          className="flex-1 py-2 bg-secondary text-black text-sm font-medium rounded-md hover:bg-opacity-90"
                          onClick={() => handleAcceptOrder(order.id)}
                        >
                          Accept Order
                        </Button>
                        <Button 
                          className="flex-1 py-2 bg-gray-800 text-white text-sm font-medium rounded-md hover:bg-gray-700"
                          onClick={() => handleDeclineOrder(order.id)}
                        >
                          Decline
                        </Button>
                      </>
                    )}
                    {order.status === "in_progress" && (
                      <Button 
                        className="flex-1 py-2 bg-primary text-black text-sm font-medium rounded-md hover:bg-opacity-90"
                        onClick={() => handleMarkReady(order.id)}
                      >
                        Mark Ready
                      </Button>
                    )}
                    {order.status === "ready" && (
                      <Badge variant="outline" className="w-full py-2 bg-blue-500 bg-opacity-20 text-blue-500 text-center">
                        Waiting for pickup
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-400 py-8">
                No orders in queue
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Menu Management */}
      <Card className="bg-muted rounded-lg">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <CardTitle className="text-2xl font-bold neon-green-text">
              Menu Management
            </CardTitle>
            <Button 
              className="px-4 py-2 bg-secondary text-black rounded-md hover:bg-opacity-90"
              onClick={handleAddMenuItem}
            >
              Add New Item
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {menuItems.length > 0 ? (
                  menuItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center text-primary">
                            {item.emoji}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{item.name}</div>
                            <div className="text-sm text-gray-400">{item.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge 
                          variant="outline"
                          className={
                            item.status === "available" 
                              ? "bg-secondary bg-opacity-20 text-secondary" 
                              : "bg-red-500 bg-opacity-20 text-red-500"
                          }
                        >
                          {item.status === "available" ? "Available" : "Unavailable"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <Button 
                          variant="ghost" 
                          className="text-secondary hover:text-opacity-80 mr-3"
                          onClick={() => handleEditMenuItem(item.id)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="text-destructive hover:text-opacity-80"
                          onClick={() => handleRemoveMenuItem(item.id)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                      No menu items found
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
