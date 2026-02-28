import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

const FROM_EMAIL = 'orders@ascension-convention.com';
const ADMIN_EMAIL = import.meta.env.ADMIN_EMAIL || 'admin@example.com';
const SITE_URL = import.meta.env.SITE_URL || 'http://localhost:4321';

export async function sendOrderConfirmation(params: {
  to: string;
  orderId: string;
  fullName: string;
  designName: string;
  size: string;
  amountFormatted: string;
}): Promise<{ error: Error | null }> {
  if (!import.meta.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set, skipping confirmation email');
    return { error: null };
  }

  return resend.emails.send({
    from: FROM_EMAIL,
    to: params.to,
    subject: `Ascension Convention 2026 – Order #${params.orderId} Confirmed`,
    html: `
      <h2>Thank you for your order!</h2>
      <p>Hi ${params.fullName},</p>
      <p>Your shirt order for Ascension Convention 2026 has been confirmed.</p>
      <ul>
        <li><strong>Order ID:</strong> ${params.orderId}</li>
        <li><strong>Design:</strong> ${params.designName}</li>
        <li><strong>Size:</strong> ${params.size}</li>
        <li><strong>Amount:</strong> ${params.amountFormatted}</li>
      </ul>
      <p>We'll see you at the convention!</p>
    `,
  });
}

export async function sendAdminNotification(params: {
  orderId: string;
  fullName: string;
  email: string;
  designName: string;
  size: string;
  amountFormatted: string;
}): Promise<{ error: Error | null }> {
  if (!import.meta.env.RESEND_API_KEY || !ADMIN_EMAIL) {
    return { error: null };
  }

  return resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `New Shirt Order #${params.orderId} – ${params.fullName}`,
    html: `
      <h2>New shirt order</h2>
      <ul>
        <li><strong>Order ID:</strong> ${params.orderId}</li>
        <li><strong>Name:</strong> ${params.fullName}</li>
        <li><strong>Email:</strong> ${params.email}</li>
        <li><strong>Design:</strong> ${params.designName}</li>
        <li><strong>Size:</strong> ${params.size}</li>
        <li><strong>Amount:</strong> ${params.amountFormatted}</li>
      </ul>
      <p><a href="${SITE_URL}/admin">View admin dashboard</a></p>
    `,
  });
}
