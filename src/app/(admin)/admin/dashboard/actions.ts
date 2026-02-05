"use server";

import { db } from "@/db";
import {
  orders,
  profiles,
  products,
  categories,
  orderItems,
} from "@/db/schema";
import { sql, gte, sum, count, desc, eq, and } from "drizzle-orm";

export async function getDashboardStats(range: string) {
  // 1. Calculate Date Range (Fixing the logic)
  const now = new Date();
  let startDate = new Date();

  if (range === "30d") {
    startDate.setDate(now.getDate() - 30);
  } else if (range === "all") {
    startDate = new Date(0); // 1970 (Beginning of time)
  } else {
    // Default to 7 days
    startDate.setDate(now.getDate() - 7);
  }

  // 2. Main Stats (Revenue, Orders, etc.)
  const revenueData = await db
    .select({
      totalRevenue: sum(orders.totalAmount),
      totalOrders: count(orders.id),
    })
    .from(orders)
    .where(gte(orders.createdAt, startDate));

  const totalUsers = await db
    .select({ count: count(profiles.id) })
    .from(profiles)
    .where(gte(profiles.createdAt, startDate)); // Users joined in this period

  const totalProducts = await db
    .select({ count: count(products.id) })
    .from(products); // Inventory remains total

  // 3. Graph Data: Revenue Over Time (Area Chart)
  const timelineOrders = await db
    .select({
      createdAt: orders.createdAt,
      amount: orders.totalAmount,
    })
    .from(orders)
    .where(gte(orders.createdAt, startDate))
    .orderBy(orders.createdAt);

  // Group by Date
  const graphMap = new Map<string, number>();
  timelineOrders.forEach((order) => {
    const dateKey = new Date(order.createdAt).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    });
    graphMap.set(dateKey, (graphMap.get(dateKey) || 0) + order.amount);
  });
  const graphData = Array.from(graphMap.entries()).map(([name, total]) => ({
    name,
    total,
  }));

  // 4. Pie Chart: Orders by Status
  const statusDataRaw = await db
    .select({
      status: orders.status,
      count: count(orders.id),
    })
    .from(orders)
    .where(gte(orders.createdAt, startDate))
    .groupBy(orders.status);

  // Define colors for statuses
  const COLORS: Record<string, string> = {
    "Order Placed": "#3b82f6", // Blue
    Processing: "#f59e0b", // Orange
    Shipped: "#8b5cf6", // Purple
    Delivered: "#10b981", // Green
    Cancelled: "#ef4444", // Red
  };

  const pieData = statusDataRaw.map((item) => ({
    name: item.status,
    value: item.count,
    fill: COLORS[item.status || "Order Placed"] || "#94a3b8",
  }));

  // 5. Recent Orders Table
  const recentOrders = await db.query.orders.findMany({
    orderBy: [desc(orders.createdAt)],
    limit: 6,
    with: { user: true },
  });

  return {
    revenue: revenueData[0]?.totalRevenue || 0,
    ordersCount: revenueData[0]?.totalOrders || 0,
    usersCount: totalUsers[0]?.count || 0,
    productsCount: totalProducts[0]?.count || 0,
    graphData,
    pieData,
    recentOrders,
  };
}
