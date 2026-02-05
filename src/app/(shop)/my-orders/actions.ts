"use server";

import { db } from "@/db";
import { orders, orderItems, products, profiles } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function getUserOrders() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  try {
    const userOrders = await db.query.orders.findMany({
      where: eq(orders.userId, user.id),
      orderBy: [desc(orders.createdAt)],
      with: {
        orderItems: {
          with: {
            product: true,
          },
        },
      },
    });

    return userOrders;
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    return [];
  }
}

export async function cancelOrder(orderId: string, reason: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  try {
    // 1. Verify Order belongs to User
    const order = await db.query.orders.findFirst({
      where: and(eq(orders.id, orderId), eq(orders.userId, user.id)),
    });

    if (!order) return { error: "Order not found" };

    // Prevent cancellation if already shipped/delivered (Optional logic)
    if (
      ["Shipped", "Out for Delivery", "Delivered", "Cancelled"].includes(
        order.status,
      )
    ) {
      return { error: "Order cannot be cancelled at this stage." };
    }

    // 2. Update Status
    await db
      .update(orders)
      .set({
        status: "Cancelled",
        cancelledBy: "customer",
        cancelReason: reason,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId));

    revalidatePath("/my-orders");
    revalidatePath("/admin/orders"); // Notify Admin
    return { success: true };
  } catch (error) {
    console.error("Cancel Error:", error);
    return { error: "Failed to cancel order." };
  }
}