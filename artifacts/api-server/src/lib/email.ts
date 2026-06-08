import nodemailer from "nodemailer";
import { logger } from "./logger";

function createTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

const TO = process.env.NOTIFICATION_EMAIL ?? process.env.SMTP_USER ?? "";

export async function sendNewInquiryAlert(inquiry: {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  serviceInterest?: string | null;
}) {
  const transport = createTransport();
  if (!transport || !TO) {
    logger.warn("SMTP not configured — skipping inquiry email notification");
    return;
  }
  try {
    await transport.sendMail({
      from: `"LubisiaTech Website" <${process.env.SMTP_USER}>`,
      to: TO,
      subject: `New Inquiry: ${inquiry.subject}`,
      html: `
        <h2>New Inquiry from ${inquiry.name}</h2>
        <p><strong>From:</strong> ${inquiry.name} &lt;${inquiry.email}&gt;</p>
        ${inquiry.phone ? `<p><strong>Phone:</strong> ${inquiry.phone}</p>` : ""}
        ${inquiry.serviceInterest ? `<p><strong>Service Interest:</strong> ${inquiry.serviceInterest}</p>` : ""}
        <p><strong>Subject:</strong> ${inquiry.subject}</p>
        <hr/>
        <p>${inquiry.message.replace(/\n/g, "<br/>")}</p>
        <hr/>
        <p style="color:#888;font-size:12px;">Sent from LubisiaTech Solutions website contact form</p>
      `,
    });
    logger.info({ to: TO, subject: inquiry.subject }, "Inquiry alert sent");
  } catch (err) {
    logger.error({ err }, "Failed to send inquiry alert email");
  }
}

export async function sendNewOrderAlert(order: {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  totalAmount: number;
  items: { productId: number; quantity: number; unitPrice: number }[];
}) {
  const transport = createTransport();
  if (!transport || !TO) {
    logger.warn("SMTP not configured — skipping order email notification");
    return;
  }
  try {
    const itemsHtml = order.items
      .map(i => `<tr><td>${i.productId}</td><td>${i.quantity}</td><td>KES ${i.unitPrice.toLocaleString()}</td></tr>`)
      .join("");
    await transport.sendMail({
      from: `"LubisiaTech Website" <${process.env.SMTP_USER}>`,
      to: TO,
      subject: `New Order #${order.id} — KES ${order.totalAmount.toLocaleString()}`,
      html: `
        <h2>New Order Received — #${order.id}</h2>
        <p><strong>Customer:</strong> ${order.customerName} &lt;${order.customerEmail}&gt;</p>
        ${order.customerPhone ? `<p><strong>Phone:</strong> ${order.customerPhone}</p>` : ""}
        <p><strong>Total:</strong> KES ${order.totalAmount.toLocaleString()}</p>
        <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse">
          <thead><tr><th>Product ID</th><th>Qty</th><th>Unit Price</th></tr></thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <hr/>
        <p style="color:#888;font-size:12px;">Manage this order in your admin dashboard</p>
      `,
    });
    logger.info({ to: TO, orderId: order.id }, "Order alert sent");
  } catch (err) {
    logger.error({ err }, "Failed to send order alert email");
  }
}

export async function sendOrderConfirmation(order: {
  id: number;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
}) {
  const transport = createTransport();
  if (!transport) return;
  try {
    await transport.sendMail({
      from: `"LubisiaTech Solutions" <${process.env.SMTP_USER}>`,
      to: order.customerEmail,
      subject: `Order Confirmed — #${order.id}`,
      html: `
        <h2>Thank you for your order, ${order.customerName}!</h2>
        <p>We have received your order <strong>#${order.id}</strong> for <strong>KES ${order.totalAmount.toLocaleString()}</strong>.</p>
        <p>Our team will contact you shortly to confirm delivery details.</p>
        <p>You can track your order at: <a href="${process.env.SITE_URL ?? "https://lubisiatech.co.ke"}/track-order">Track My Order</a></p>
        <hr/>
        <p><strong>LubisiaTech Solutions</strong><br/>+254 711 293 263 | Kitale Town, Kenya</p>
      `,
    });
  } catch (err) {
    logger.error({ err }, "Failed to send order confirmation email");
  }
}

export async function sendNewsletterWelcome(email: string, name?: string) {
  const transport = createTransport();
  if (!transport) return;
  try {
    await transport.sendMail({
      from: `"LubisiaTech Solutions" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Welcome to LubisiaTech Newsletter",
      html: `
        <h2>Welcome${name ? `, ${name}` : ""}!</h2>
        <p>You are now subscribed to the LubisiaTech Solutions newsletter. We will send you:</p>
        <ul>
          <li>New service announcements</li>
          <li>Tech tips for your business</li>
          <li>Special offers on computer accessories</li>
          <li>Partner deals and affiliate offers</li>
        </ul>
        <p>Stay connected with us on <strong>+254 711 293 263</strong> or visit us in Kitale Town.</p>
        <hr/>
        <p style="color:#888;font-size:12px;">LubisiaTech Solutions — Kitale Town, Trans Nzoia County, Kenya</p>
      `,
    });
  } catch (err) {
    logger.error({ err }, "Failed to send newsletter welcome email");
  }
}
