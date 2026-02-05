"use server";

import { db } from "@/db";
import { productDeals, products, categories } from "@/db/schema"; // Categories for filtering
import { revalidatePath } from "next/cache";
import { eq, and, gt, desc, ilike, or } from "drizzle-orm";

// 1. Fetch Products for Selection Sheet (Search & Filter support)
export async function getProductsForDealSelector(query: string = "") {
  // Simple search logic on Title or Category Name
  // Note: Complex join queries Drizzle mein thode alag hote hain,
  // abhi hum simple products fetch karke JS se filter karenge ya direct title search.

  const allProducts = await db.query.products.findMany({
    with: {
      category: true,
      subCategory: true,
    },
    orderBy: [desc(products.createdAt)],
  });

  // Search Filter
  if (!query) return allProducts;

  const lowerQuery = query.toLowerCase();
  return allProducts.filter(
    (p) =>
      p.title.toLowerCase().includes(lowerQuery) ||
      p.category?.name.toLowerCase().includes(lowerQuery) ||
      p.subCategory?.name.toLowerCase().includes(lowerQuery),
  );
}

// 2. Fetch Active Deals
export async function getActiveDeals() {
  const now = new Date();

  return await db.query.productDeals.findMany({
    where: and(
      eq(productDeals.isActive, true),
      gt(productDeals.expiresAt, now), // Sirf wo jo expire nahi huye
    ),
    with: {
      product: {
        with: {
          brand: true, // Brand name chahiye card ke liye
        },
      },
    },
    orderBy: [desc(productDeals.createdAt)],
  });
}

// 3. Toggle/Update Deal List
export async function updateTodaysDeal(selectedProductIds: string[]) {
  try {
    const now = new Date();
    const expiry = new Date(now.getTime() + 24 * 60 * 60 * 1000); // +24 Hours

    // Transaction: Clear old deals or specific logic?
    // Requirement: Admin select karega aur save karega.
    // Best approach: Jo list aayi hai, sirf wahi active rahe, baaki hat jayein.

    await db.transaction(async (tx) => {
      // 1. Delete all existing active deals (Clean slate approach)
      // Note: Production mein 'soft delete' ya 'update isActive=false' behtar hota hai,
      // par simple rakhne ke liye hum purane hata kar naye dalenge.
      await tx.delete(productDeals);

      // 2. Insert new selections
      if (selectedProductIds.length > 0) {
        const values = selectedProductIds.map((id) => ({
          productId: id,
          expiresAt: expiry,
          isActive: true,
        }));
        await tx.insert(productDeals).values(values);
      }
    });

    revalidatePath("/admin/todays-deal");
    revalidatePath("/"); // Update Homepage
    return { success: "Deals updated successfully (24h timer set)" };
  } catch (error) {
    console.error(error);
    return { error: "Failed to update deals" };
  }
}

// 4. Fetch Deals for User Side (Public)
export async function getTodaysDealsForUser() {
  const now = new Date();
  
  return await db.query.productDeals.findMany({
    where: and(
      eq(productDeals.isActive, true),
      gt(productDeals.expiresAt, now)
    ),
    with: {
      product: {
        with: {
          brand: true, // Brand name chahiye
        }
      }
    },
    orderBy: [desc(productDeals.createdAt)],
  });
}