import { 
  users, 
  type User, 
  type InsertUser, 
  drivers, 
  type Driver, 
  type InsertDriver,
  kitchens,
  type Kitchen,
  type InsertKitchen,
  menuItems,
  type MenuItem,
  type InsertMenuItem,
  customers,
  type Customer,
  type InsertCustomer,
  orders,
  type Order,
  type InsertOrder
} from "@shared/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";

// Database connection
const connectionString = process.env.DATABASE_URL || "";
const client = postgres(connectionString);
const db = drizzle(client);

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  
  // Driver operations
  getDriver(id: string): Promise<Driver | undefined>;
  getDrivers(): Promise<Driver[]>;
  createDriver(driver: InsertDriver): Promise<Driver>;
  
  // Kitchen operations
  getKitchen(id: string): Promise<Kitchen | undefined>;
  getKitchens(): Promise<Kitchen[]>;
  createKitchen(kitchen: InsertKitchen): Promise<Kitchen>;
  
  // Menu operations
  getMenuItem(id: string): Promise<MenuItem | undefined>;
  getMenuItems(): Promise<MenuItem[]>;
  getKitchenMenu(kitchenId: string): Promise<MenuItem[]>;
  createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem>;
  
  // Customer operations
  getCustomer(id: string): Promise<Customer | undefined>;
  getCustomers(): Promise<Customer[]>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  
  // Order operations
  getOrder(id: string): Promise<Order | undefined>;
  getOrders(): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, orderData: Partial<Order>): Promise<Order>;
}

export class DrizzleStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }
  
  async getUsers(): Promise<User[]> {
    return db.select().from(users);
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }
  
  // Driver operations
  async getDriver(id: string): Promise<Driver | undefined> {
    const result = await db.select().from(drivers).where(eq(drivers.id, id));
    return result[0];
  }
  
  async getDrivers(): Promise<Driver[]> {
    return db.select().from(drivers);
  }
  
  async createDriver(driver: InsertDriver): Promise<Driver> {
    const result = await db.insert(drivers).values(driver).returning();
    return result[0];
  }
  
  // Kitchen operations
  async getKitchen(id: string): Promise<Kitchen | undefined> {
    const result = await db.select().from(kitchens).where(eq(kitchens.id, id));
    return result[0];
  }
  
  async getKitchens(): Promise<Kitchen[]> {
    return db.select().from(kitchens);
  }
  
  async createKitchen(kitchen: InsertKitchen): Promise<Kitchen> {
    const result = await db.insert(kitchens).values(kitchen).returning();
    return result[0];
  }
  
  // Menu operations
  async getMenuItem(id: string): Promise<MenuItem | undefined> {
    const result = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return result[0];
  }
  
  async getMenuItems(): Promise<MenuItem[]> {
    return db.select().from(menuItems);
  }
  
  async getKitchenMenu(kitchenId: string): Promise<MenuItem[]> {
    return db.select().from(menuItems).where(eq(menuItems.kitchenId, kitchenId));
  }
  
  async createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem> {
    const result = await db.insert(menuItems).values(menuItem).returning();
    return result[0];
  }
  
  // Customer operations
  async getCustomer(id: string): Promise<Customer | undefined> {
    const result = await db.select().from(customers).where(eq(customers.id, id));
    return result[0];
  }
  
  async getCustomers(): Promise<Customer[]> {
    return db.select().from(customers);
  }
  
  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const result = await db.insert(customers).values(customer).returning();
    return result[0];
  }
  
  // Order operations
  async getOrder(id: string): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id));
    return result[0];
  }
  
  async getOrders(): Promise<Order[]> {
    return db.select().from(orders);
  }
  
  async createOrder(order: InsertOrder): Promise<Order> {
    const result = await db.insert(orders).values(order).returning();
    return result[0];
  }
  
  async updateOrder(id: string, orderData: Partial<Order>): Promise<Order> {
    const result = await db
      .update(orders)
      .set(orderData)
      .where(eq(orders.id, id))
      .returning();
    
    return result[0];
  }
}

export const storage = new DrizzleStorage();
