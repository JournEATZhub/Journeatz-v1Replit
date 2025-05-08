import { pgTable, text, serial, integer, boolean, uuid, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users Table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("customer"),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  role: true,
  name: true,
});

// Drivers Table
export const drivers = pgTable("drivers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  name: text("name").notNull(),
  phoneNumber: text("phone_number"),
  licenseNumber: text("license_number"),
  vehicleType: text("vehicle_type"),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDriverSchema = createInsertSchema(drivers).pick({
  userId: true,
  name: true,
  phoneNumber: true,
  licenseNumber: true,
  vehicleType: true,
  status: true,
});

// Kitchens Table
export const kitchens = pgTable("kitchens", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  name: text("name").notNull(),
  address: text("address"),
  contactNumber: text("contact_number"),
  cuisineType: text("cuisine_type"),
  isOpen: boolean("is_open").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertKitchenSchema = createInsertSchema(kitchens).pick({
  userId: true,
  name: true,
  address: true,
  contactNumber: true,
  cuisineType: true,
  isOpen: true,
});

// Menu Items Table
export const menuItems = pgTable("menu_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  kitchenId: uuid("kitchen_id").references(() => kitchens.id),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(), // Price in cents
  category: text("category"),
  status: text("status").default("available"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMenuItemSchema = createInsertSchema(menuItems).pick({
  kitchenId: true,
  name: true,
  description: true,
  price: true,
  category: true,
  status: true,
});

// Customers Table
export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  name: text("name").notNull(),
  phoneNumber: text("phone_number"),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCustomerSchema = createInsertSchema(customers).pick({
  userId: true,
  name: true,
  phoneNumber: true,
  address: true,
});

// Orders Table
export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: uuid("customer_id").references(() => customers.id),
  kitchenId: uuid("kitchen_id").references(() => kitchens.id),
  driverId: uuid("driver_id").references(() => drivers.id),
  status: text("status").default("pending"),
  items: jsonb("items").notNull(), // Array of order items
  totalAmount: integer("total_amount").notNull(), // Total in cents
  deliveryAddress: text("delivery_address").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  customerId: true,
  kitchenId: true,
  driverId: true,
  status: true,
  items: true,
  totalAmount: true,
  deliveryAddress: true,
});

// Define types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Driver = typeof drivers.$inferSelect;
export type InsertDriver = z.infer<typeof insertDriverSchema>;

export type Kitchen = typeof kitchens.$inferSelect;
export type InsertKitchen = z.infer<typeof insertKitchenSchema>;

export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
