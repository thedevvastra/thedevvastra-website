import { db } from "@/db";
import { storeSettings, orders, orderItems } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * 1. ORDER NOTIFICATION
 * Sends a Telegram alert when a new order is placed.
 */
export async function sendTelegramNotification(orderId: string) {
  try {
    // 1. Get Settings
    const settings = await db.query.storeSettings.findFirst({
      where: eq(storeSettings.id, 1),
    });

    if (!settings?.telegramBotToken || !settings?.telegramChatId) {
      console.log("⚠️ Telegram Notification Skipped: No credentials found.");
      return;
    }

    // 2. Fetch Order Details
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        user: true, // Fetch Customer Profile
        orderItems: {
          with: {
            product: true, // Fetch Product Details
          },
        },
      },
    });

    if (!order) return;

    // 3. Prepare Data
    // Shipping Address Type Casting (Since it's JSON)
    const address = order.shippingAddress as {
      name: string;
      phone: string;
      city: string;
      state: string;
      line1: string;
    };

    const customerName = address.name || order.user?.fullName || "Guest";
    const customerPhone = address.phone || order.user?.phone || "N/A";
    const location = `${address.city}, ${address.state}`;

    // Formatting Date
    const orderDate = new Date(order.createdAt).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const totalAmount = `₹${order.totalAmount.toLocaleString("en-IN")}`;

    // Formatting Items List
    const itemsList = order.orderItems
      .map((item, index) => {
        const pName = item.product?.title || "Unknown Product";
        const variantParts = [];
        if (item.color) variantParts.push(item.color);
        if (item.size) variantParts.push(item.size);
        const variant =
          variantParts.length > 0 ? `(${variantParts.join(", ")})` : "";

        return `${index + 1}. <b>${pName}</b> ${variant}\n    Qty: ${item.quantity} x ₹${item.price}`;
      })
      .join("\n\n");

    // Admin URL (Change this to your actual domain in production)
    const adminUrl = process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/admin/orders`
      : "http://localhost:3000/admin/orders";

    // 4. Construct Professional HTML Message
    const message = `
🚨 <b>NEW ORDER ALERT</b> 🚨
------------------------------------
<b>🆔 Order ID:</b> <code>${order.displayId}</code>
<b>📅 Date:</b> ${orderDate}
<b>📊 Status:</b> ${order.status}

<b>👤 Customer Details:</b>
━━━━━━━━━━━━━━━━━━
<b>Name:</b> ${customerName}
<b>Phone:</b> ${customerPhone}
<b>Location:</b> ${location}

<b>🛒 Order Summary:</b>
━━━━━━━━━━━━━━━━━━
${itemsList}

<b>💰 Total Amount:</b> <b>${totalAmount}</b>
<b>💳 Payment:</b> ${order.paymentMethod} (${order.paymentStatus})

👇 <b>Quick Action:</b>
<a href="${adminUrl}">🔗 View Order in Admin Panel</a>
    `;

    // 5. Send to Telegram API
    const url = `https://api.telegram.org/bot${settings.telegramBotToken}/sendMessage`;

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: settings.telegramChatId,
        text: message,
        parse_mode: "HTML",
        disable_web_page_preview: true, // Prevents link preview clutter
      }),
    });

    console.log("✅ Telegram Notification Sent!");
  } catch (error) {
    console.error("❌ Telegram Notification Failed:", error);
  }
}

/**
 * 2. CONTACT FORM NOTIFICATION
 * Sends a Telegram alert when someone submits the contact form.
 */
export async function sendContactFormNotification(data: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  try {
    // 1. Get Settings
    const settings = await db.query.storeSettings.findFirst({
      where: eq(storeSettings.id, 1),
    });

    if (!settings?.telegramBotToken || !settings?.telegramChatId) {
      console.log("⚠️ Contact Notification Skipped: No credentials found.");
      return;
    }

    // 2. Prepare Message
    const timestamp = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });

    const msg = `
📨 <b>NEW CONTACT INQUIRY</b>
------------------------------------
<b>📅 Time:</b> ${timestamp}

<b>👤 Customer Details:</b>
━━━━━━━━━━━━━━━━━━
<b>Name:</b> ${data.name}
<b>Phone:</b> ${data.phone}
<b>Email:</b> ${data.email}

<b>📝 Message Content:</b>
━━━━━━━━━━━━━━━━━━
<b>Subject:</b> ${data.subject}
<b>Message:</b>
<i>${data.message}</i>

👇 <b>Quick Action:</b>
<a href="mailto:${data.email}?subject=Re: ${data.subject}">📧 Reply via Email</a>
<a href="tel:${data.phone}">📞 Call Customer</a>
    `;

    // 3. Send to Telegram API
    const url = `https://api.telegram.org/bot${settings.telegramBotToken}/sendMessage`;

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: settings.telegramChatId,
        text: msg,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    console.log("✅ Contact Notification Sent to Telegram!");
  } catch (error) {
    console.error("❌ Telegram Contact Notification Error:", error);
  }
}
