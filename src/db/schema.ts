import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  text,
  uuid,
  timestamp,
  index,
  json,
  unique,
} from "drizzle-orm/pg-core";

// 1. PROFILES
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  role: text("role").default("user").notNull(),

  phone: text("phone"),
  addressLine1: text("address_line_1"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  country: text("country").default("India"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 2. HERO SLIDES
export const heroSlides = pgTable("hero_slides", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  ctaText: text("cta_text").default("Explore"),
  ctaLink: text("cta_link").default("/"),
  imageUrl: text("image_url"),
  bgColor: text("bg_color").default("bg-[#FAF8F3]"),
  textColor: text("text_color").default("text-[#2D1B15]"),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// 3. MARQUEE
export const marqueeItems = pgTable("marquee_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  text: text("text").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 4. SETTINGS
export const storeSettings = pgTable("store_settings", {
  id: integer("id").primaryKey().default(1),
  isMarqueeEnabled: boolean("is_marquee_enabled").default(true).notNull(),

  shippingCharge: integer("shipping_charge").default(0).notNull(),
  shippingBy: text("shipping_by").default("Express Courier"), // e.g. FedEx, BlueDart
  shippingDuration: text("shipping_duration").default("5 - 7 Days"),
  freeShippingThreshold: integer("free_shipping_threshold").default(0),

  telegramBotToken: text("telegram_bot_token"),
  telegramChatId: text("telegram_chat_id"),
});

// 5. CATEGORIES
export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    imageUrl: text("image_url"),
    parentId: uuid("parent_id"),
    isFeatured: boolean("is_featured").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    sortOrder: integer("sort_order").default(0),
  },
  (table) => {
    return {
      parentIdx: index("parent_idx").on(table.parentId),
    };
  },
);

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "category_parent",
  }),
  children: many(categories, {
    relationName: "category_parent",
  }),
}));

// 6. BRANDS
export const brands = pgTable("brands", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 7. PRODUCTS
export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Basic Info
  title: text("title").notNull(),
  description: text("description").notNull(),
  highlights: json("highlights").$type<string[]>(),

  // Images
  thumbnailUrl: text("thumbnail_url").notNull(),
  additionalImages: json("additional_images").$type<string[]>(),

  // Pricing & Stock
  sellingPrice: integer("selling_price").notNull(),
  oldPrice: integer("old_price"),
  stock: integer("stock").notNull().default(0),

  // Variants
  colors: json("colors").$type<{ name: string; hex: string }[]>(),
  sizes: json("sizes").$type<string[]>(),

  // Relations IDs
  brandId: uuid("brand_id").references(() => brands.id),
  categoryId: uuid("category_id").references(() => categories.id),
  subCategoryId: uuid("sub_category_id").references(() => categories.id),

  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),

  isMostSelling: boolean("is_most_selling").default(false),
});

// ✅ ADDED: Products Relations (Ye missing tha, isliye error aa raha tha)
export const productsRelations = relations(products, ({ one, many }) => ({
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
    relationName: "product_category",
  }),
  subCategory: one(categories, {
    fields: [products.subCategoryId],
    references: [categories.id],
    relationName: "product_subcategory",
  }),
  deals: many(productDeals),
}));

// 8. DEALS
export const productDeals = pgTable("product_deals", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const productDealsRelations = relations(productDeals, ({ one }) => ({
  product: one(products, {
    fields: [productDeals.productId],
    references: [products.id],
  }),
}));

export const saleBanners = pgTable("sale_banners", {
  id: uuid("id").defaultRandom().primaryKey(),
  imageUrl: text("image_url").notNull(),
  ctaText: text("cta_text").notNull(),
  ctaLink: text("cta_link").notNull(),
  btnColor: text("btn_color").default("#000000"), // Store Hex Code
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const wishlists = pgTable(
  "wishlists",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(), // Link to Auth User
    productId: uuid("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => ({
    unq: unique().on(t.userId, t.productId), // User can't add same product twice
  }),
);

// 2. Cart Table
export const carts = pgTable("carts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  productId: uuid("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  quantity: integer("quantity").default(1).notNull(),
  color: text("color"), // Selected Color
  size: text("size"), // Selected Size
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ✅ NEW: REVIEWS TABLE
export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(), // Links to Auth User (Profile)
  productId: uuid("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),

  rating: integer("rating").notNull(), // 1 to 5
  comment: text("comment"),

  // Admin Interaction
  adminReply: text("admin_reply"),
  isLoved: boolean("is_loved").default(false),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ✅ NEW: RELATIONS
export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(profiles, {
    fields: [reviews.userId],
    references: [profiles.id],
  }),
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
}));

// 5. ORDERS
export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  displayId: text("display_id").notNull(), // e.g. ORD-12345 (Customer ke liye)
  userId: uuid("user_id").references(() => profiles.id, {
    onDelete: "cascade",
  }),

  status: text("status").default("Order Placed").notNull(),
  // Statuses: "Order Placed", "Confirmed", "Shipped", "Out for Delivery", "Delivered", "Cancelled"

  cancelledBy: text("cancelled_by"), // 'customer' | 'admin'
  cancelReason: text("cancel_reason"),

  totalAmount: integer("total_amount").notNull(),

  // Address ka snapshot (Taaki future mein user address change kare to purana order affect na ho)
  shippingAddress: json("shipping_address").notNull(),

  paymentMethod: text("payment_method").default("COD"),
  paymentStatus: text("payment_status").default("Pending"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 6. ORDER ITEMS (Kaunse products order kiye)
export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").references(() => orders.id, {
    onDelete: "cascade",
  }),
  productId: uuid("product_id").references(() => products.id),

  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(), // Price at time of purchase
  size: text("size"),
  color: text("color"),
});

// ORDERS RELATIONS
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(profiles, {
    fields: [orders.userId],
    references: [profiles.id],
  }),
  orderItems: many(orderItems),
}));

// ORDER ITEMS RELATIONS
export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

// CONTACT MESSAGES TABLE
export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(), // New Field
  subject: text("subject").notNull(),
  message: text("message").notNull(),

  isRead: boolean("is_read").default(false), // Read/Unread Status
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contactSettings = pgTable("contact_settings", {
  id: integer("id").primaryKey().default(1), // Always ID 1 (Single Row)

  // Contact Info
  email1: text("email_1"),
  email2: text("email_2"),
  phone1: text("phone_1"),
  phone2: text("phone_2"),
  address: text("address"),

  // Google Map Embed URL
  googleMapUrl: text("google_map_url"),

  // Social Links
  instagram: text("instagram"),
  facebook: text("facebook"),
  youtube: text("youtube"),
  whatsapp: text("whatsapp"),

  updatedAt: timestamp("updated_at").defaultNow(),
});