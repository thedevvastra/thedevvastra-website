"use server";

import { db } from "@/db";
import { orders, profiles, orderItems, products } from "@/db/schema"; // ✅ Ensure all are imported
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// 1. Fetch All Orders
export async function getAllOrders() {
  try {
    const allOrders = await db
      .select({
        id: orders.id,
        displayId: orders.displayId,
        totalAmount: orders.totalAmount,
        status: orders.status,
        paymentMethod: orders.paymentMethod,
        paymentStatus: orders.paymentStatus,
        createdAt: orders.createdAt,
        cancelledBy: orders.cancelledBy,
        cancelReason: orders.cancelReason,
        shippingAddress: orders.shippingAddress,
        user: {
          fullName: profiles.fullName,
          email: profiles.email,
          phone: profiles.phone,
          avatarUrl: profiles.avatarUrl, // ✅ For Avatar in Table
        },
      })
      .from(orders)
      .leftJoin(profiles, eq(orders.userId, profiles.id))
      .orderBy(desc(orders.createdAt));

    return { success: true, data: allOrders };
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    return { success: false, error: "Failed to fetch orders" };
  }
}

// 2. Update Order Status
export async function updateOrderStatus(orderId: string, newStatus: string) {
  try {
    await db
      .update(orders)
      .set({
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId));

    revalidatePath("/admin/orders");
    return { success: true, message: "Order status updated" };
  } catch (error) {
    console.error("Update Status Error:", error);
    return { success: false, error: "Failed to update status" };
  }
}

// ✅ 3. Get Single Order Details (Fixed Query)
export async function getOrderDetails(orderId: string) {
  try {
    // Drizzle Query using Relations
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        user: true, // Requires ordersRelations
        orderItems: {
          // Requires ordersRelations
          with: {
            product: true, // Requires orderItemsRelations
          },
        },
      },
    });

    if (!order) return { success: false, error: "Order not found" };

    return { success: true, data: order };
  } catch (error) {
    console.error("Fetch Order Details Error:", error);
    return { success: false, error: "Failed to fetch details" };
  }
}

// ✅ 4. Admin Cancel Order with Reason
export async function cancelOrderAdmin(orderId: string, reason: string) {
  try {
    await db
      .update(orders)
      .set({ 
        status: "Cancelled",
        cancelledBy: "admin",
        cancelReason: reason,
        updatedAt: new Date() 
      })
      .where(eq(orders.id, orderId));

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("Admin Cancel Error:", error);
    return { success: false, error: "Failed to cancel order" };
  }
}