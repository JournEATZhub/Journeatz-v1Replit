import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);
  
  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });
  
  // User routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Order routes
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.post("/api/orders", async (req, res) => {
    try {
      const newOrder = await storage.createOrder(req.body);
      res.status(201).json(newOrder);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.patch("/api/orders/:id", async (req, res) => {
    try {
      const updatedOrder = await storage.updateOrder(req.params.id, req.body);
      res.json(updatedOrder);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Kitchen routes
  app.get("/api/kitchens", async (req, res) => {
    try {
      const kitchens = await storage.getKitchens();
      res.json(kitchens);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Menu routes
  app.get("/api/kitchens/:id/menu", async (req, res) => {
    try {
      const menu = await storage.getKitchenMenu(req.params.id);
      res.json(menu);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  return httpServer;
}
