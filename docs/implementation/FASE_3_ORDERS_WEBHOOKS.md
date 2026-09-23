# FASE 3: Order Database + Webhooks

**Status:** 📝 Planned  
**Dependencies:** FASE 0, 1, 2 complete  
**Timeline:** 1-2 minggu  
**Owner:** Backend Team  
**Last Updated:** 2026-09-20

---

## 📋 Objectives

1. Implement Lemon Squeezy webhook handler
2. Implement Gumroad webhook handler
3. Create order tracking system
4. Implement entitlement management
5. Generate download tokens automatically
6. Send order confirmation emails
7. Handle refunds and subscription changes

---

## ✅ Checklist

### 1. Webhook Infrastructure

- [ ] Create webhook handler routes
- [ ] Implement signature verification (LS + Gumroad)
- [ ] Create idempotent processing logic
- [ ] Setup webhook event logging
- [ ] Implement reprocess mechanism

### 2. Lemon Squeezy Integration

- [ ] Order created handler
- [ ] Subscription created/updated/cancelled
- [ ] Payment failed handler
- [ ] Order refunded handler

### 3. Gumroad Integration

- [ ] Sale webhook handler
- [ ] Refund webhook handler
- [ ] License key generation

### 4. Order Management

- [ ] Order creation from webhook
- [ ] Link orders to users (email matching)
- [ ] Handle guest purchases
- [ ] Order status tracking

### 5. Entitlement System

- [ ] Create entitlements from orders
- [ ] Create entitlements from subscriptions
- [ ] Check entitlement access
- [ ] Expire/revoke entitlements

### 6. Download Tokens

- [ ] Generate tokens on order paid
- [ ] Token expiry management
- [ ] Download quota tracking

---

## 🔧 Implementation Steps

### Step 1: Create Webhook Utility Functions

**File:** `lib/payments/webhook-utils.ts`

```typescript
import crypto from 'crypto';

/**
 * Verify Lemon Squeezy webhook signature
 */
export function verifyLemonSqueezySignature(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(rawBody);
  const digest = hmac.digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}

/**
 * Verify Gumroad webhook signature
 */
export function verifyGumroadSignature(
  payload: any,
  secret: string
): boolean {
  // Gumroad uses simple secret matching
  return payload.secret === secret;
}

/**
 * Generate unique order number
 */
export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `AGY-${year}-${random}`;
}

/**
 * Generate download token
 */
export function generateDownloadToken(): string {
  return crypto.randomBytes(32).toString('hex');
}
```

---

### Step 2: Create Lemon Squeezy Webhook Handler

**File:** `app/api/webhooks/lemonsqueezy/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/db';
import { verifyLemonSqueezySignature, generateOrderNumber, generateDownloadToken } from '@/lib/payments/webhook-utils';
import { processEntitlement } from '@/lib/payments/entitlement';
import { sendOrderEmail } from '@/lib/mail';

export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await request.text();
    const headersList = headers();
    const signature = headersList.get('x-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    // Verify signature
    const isValid = verifyLemonSqueezySignature(
      rawBody,
      signature,
      process.env.LEMONSQUEEZY_WEBHOOK_SECRET!
    );

    // Log webhook event (even if signature invalid)
    const payload = JSON.parse(rawBody);
    const webhookEvent = await prisma.webhookEvent.create({
      data: {
        provider: 'lemonsqueezy',
        eventId: payload.meta.event_name + '_' + payload.data.id,
        eventType: payload.meta.event_name,
        payloadJson: payload,
        signatureValid: isValid,
        processStatus: isValid ? 'received' : 'failed',
        error: isValid ? null : 'Invalid signature',
      },
    });

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Process event
    try {
      await processLemonSqueezyEvent(payload, webhookEvent.id);
      
      await prisma.webhookEvent.update({
        where: { id: webhookEvent.id },
        data: {
          processStatus: 'processed',
          processedAt: new Date(),
        },
      });
    } catch (error: any) {
      await prisma.webhookEvent.update({
        where: { id: webhookEvent.id },
        data: {
          processStatus: 'failed',
          error: error.message,
        },
      });
      
      console.error('Webhook processing error:', error);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function processLemonSqueezyEvent(payload: any, webhookEventId: bigint) {
  const eventName = payload.meta.event_name;
  const data = payload.data;

  switch (eventName) {
    case 'order_created':
      await handleOrderCreated(data, webhookEventId);
      break;
    case 'order_refunded':
      await handleOrderRefunded(data, webhookEventId);
      break;
    case 'subscription_created':
      await handleSubscriptionCreated(data, webhookEventId);
      break;
    case 'subscription_updated':
      await handleSubscriptionUpdated(data, webhookEventId);
      break;
    case 'subscription_cancelled':
      await handleSubscriptionCancelled(data, webhookEventId);
      break;
    case 'subscription_expired':
      await handleSubscriptionExpired(data, webhookEventId);
      break;
    case 'subscription_payment_failed':
      await handleSubscriptionPaymentFailed(data, webhookEventId);
      break;
    default:
      console.log('Unhandled event:', eventName);
  }
}

async function handleOrderCreated(data: any, webhookEventId: bigint) {
  const attributes = data.attributes;
  const email = attributes.user_email;
  const orderNumber = generateOrderNumber();

  // Find or create user
  let user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    // Create guest user account
    user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name: attributes.user_name || email.split('@')[0],
        role: 'customer',
        // No password - user must set via password reset
      },
    });
  }

  // Create order
  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId: user.id,
      email: email.toLowerCase(),
      provider: 'lemonsqueezy',
      providerOrderId: data.id,
      status: attributes.status === 'paid' ? 'paid' : 'failed',
      subtotalCents: Math.round(parseFloat(attributes.subtotal) * 100),
      taxCents: Math.round(parseFloat(attributes.tax || 0) * 100),
      totalCents: Math.round(parseFloat(attributes.total) * 100),
      currency: attributes.currency,
      country: attributes.country_code,
    },
  });

  // Create order items
  for (const item of attributes.order_items || []) {
    const productSlug = item.product_name.toLowerCase().replace(/\s+/g, '-');
    
    const product = await prisma.product.findUnique({
      where: { slug: productSlug },
    });

    const orderItem = await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: product?.id,
        productSlug,
        variant: item.variant_name || null,
        quantity: item.quantity || 1,
        unitPriceCents: Math.round(parseFloat(item.price) * 100),
      },
    });

    // Generate download token
    const token = generateDownloadToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 365); // 1 year

    await prisma.downloadToken.create({
      data: {
        token,
        orderItemId: orderItem.id,
        userId: user.id,
        expiresAt,
        maxDownloads: 10,
      },
    });

    // Create entitlement
    await processEntitlement({
      userId: user.id,
      source: 'order',
      sourceId: orderItem.id,
      productSlug,
      status: 'active',
      expiresAt: null, // Lifetime for one-time purchase
    });
  }

  // Send order confirmation email
  await sendOrderEmail(user.email, user.name, order.orderNumber);
}

async function handleOrderRefunded(data: any, webhookEventId: bigint) {
  const orderId = data.id;

  const order = await prisma.order.findUnique({
    where: {
      provider_providerOrderId: {
        provider: 'lemonsqueezy',
        providerOrderId: orderId,
      },
    },
    include: { items: true },
  });

  if (!order) {
    console.error('Order not found for refund:', orderId);
    return;
  }

  // Update order status
  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: 'refunded',
      refundedAt: new Date(),
    },
  });

  // Revoke entitlements
  for (const item of order.items) {
    await prisma.entitlement.updateMany({
      where: {
        source: 'order',
        sourceId: item.id,
      },
      data: {
        status: 'revoked',
      },
    });
  }
}

async function handleSubscriptionCreated(data: any, webhookEventId: bigint) {
  const attributes = data.attributes;
  const email = attributes.user_email;

  // Find or create user
  let user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name: attributes.user_name || email.split('@')[0],
        role: 'customer',
      },
    });
  }

  // Find plan by LS variant ID
  const plan = await prisma.plan.findFirst({
    where: { lsVariantId: attributes.variant_id },
  });

  if (!plan) {
    throw new Error('Plan not found for variant: ' + attributes.variant_id);
  }

  // Create subscription
  const subscription = await prisma.subscription.create({
    data: {
      userId: user.id,
      planId: plan.id,
      provider: 'lemonsqueezy',
      providerCustomerId: attributes.customer_id,
      providerSubscriptionId: data.id,
      status: attributes.status === 'active' ? 'active' : 'trialing',
      currentPeriodEnd: new Date(attributes.renews_at),
      cancelAtPeriodEnd: attributes.cancelled,
    },
  });

  // Create entitlement
  await processEntitlement({
    userId: user.id,
    source: 'subscription',
    sourceId: subscription.id,
    planCode: plan.code,
    status: 'active',
    expiresAt: new Date(attributes.renews_at),
  });
}

async function handleSubscriptionUpdated(data: any, webhookEventId: bigint) {
  const subscriptionId = data.id;
  const attributes = data.attributes;

  await prisma.subscription.update({
    where: {
      provider_providerSubscriptionId: {
        provider: 'lemonsqueezy',
        providerSubscriptionId: subscriptionId,
      },
    },
    data: {
      status: attributes.status,
      currentPeriodEnd: new Date(attributes.renews_at),
      cancelAtPeriodEnd: attributes.cancelled,
    },
  });

  // Update entitlement expiry
  const subscription = await prisma.subscription.findUnique({
    where: {
      provider_providerSubscriptionId: {
        provider: 'lemonsqueezy',
        providerSubscriptionId: subscriptionId,
      },
    },
  });

  if (subscription) {
    await prisma.entitlement.updateMany({
      where: {
        source: 'subscription',
        sourceId: subscription.id,
      },
      data: {
        expiresAt: new Date(attributes.renews_at),
      },
    });
  }
}

async function handleSubscriptionCancelled(data: any, webhookEventId: bigint) {
  const subscriptionId = data.id;

  await prisma.subscription.update({
    where: {
      provider_providerSubscriptionId: {
        provider: 'lemonsqueezy',
        providerSubscriptionId: subscriptionId,
      },
    },
    data: {
      status: 'cancelled',
      cancelAtPeriodEnd: true,
    },
  });
}

async function handleSubscriptionExpired(data: any, webhookEventId: bigint) {
  const subscriptionId = data.id;

  const subscription = await prisma.subscription.update({
    where: {
      provider_providerSubscriptionId: {
        provider: 'lemonsqueezy',
        providerSubscriptionId: subscriptionId,
      },
    },
    data: {
      status: 'expired',
    },
  });

  // Expire entitlements
  await prisma.entitlement.updateMany({
    where: {
      source: 'subscription',
      sourceId: subscription.id,
    },
    data: {
      status: 'expired',
    },
  });
}

async function handleSubscriptionPaymentFailed(data: any, webhookEventId: bigint) {
  const subscriptionId = data.id;

  await prisma.subscription.update({
    where: {
      provider_providerSubscriptionId: {
        provider: 'lemonsqueezy',
        providerSubscriptionId: subscriptionId,
      },
    },
    data: {
      status: 'past_due',
    },
  });

  // TODO: Send payment failed email
}
```

---

### Step 3: Create Gumroad Webhook Handler

**File:** `app/api/webhooks/gumroad/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyGumroadSignature, generateOrderNumber, generateDownloadToken } from '@/lib/payments/webhook-utils';
import { processEntitlement } from '@/lib/payments/entitlement';
import { sendOrderEmail } from '@/lib/mail';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    // Verify signature (Gumroad uses simple secret)
    const isValid = verifyGumroadSignature(
      payload,
      process.env.GUMROAD_WEBHOOK_SECRET!
    );

    // Log webhook event
    const webhookEvent = await prisma.webhookEvent.create({
      data: {
        provider: 'gumroad',
        eventId: payload.sale_id || payload.id,
        eventType: payload.refunded ? 'refund' : 'sale',
        payloadJson: payload,
        signatureValid: isValid,
        processStatus: isValid ? 'received' : 'failed',
        error: isValid ? null : 'Invalid signature',
      },
    });

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Process event
    try {
      if (payload.refunded) {
        await handleGumroadRefund(payload, webhookEvent.id);
      } else {
        await handleGumroadSale(payload, webhookEvent.id);
      }

      await prisma.webhookEvent.update({
        where: { id: webhookEvent.id },
        data: {
          processStatus: 'processed',
          processedAt: new Date(),
        },
      });
    } catch (error: any) {
      await prisma.webhookEvent.update({
        where: { id: webhookEvent.id },
        data: {
          processStatus: 'failed',
          error: error.message,
        },
      });

      console.error('Webhook processing error:', error);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleGumroadSale(payload: any, webhookEventId: bigint) {
  const email = payload.email;
  const orderNumber = generateOrderNumber();

  // Find or create user
  let user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name: payload.full_name || email.split('@')[0],
        role: 'customer',
      },
    });
  }

  // Create order
  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId: user.id,
      email: email.toLowerCase(),
      provider: 'gumroad',
      providerOrderId: payload.sale_id,
      status: 'paid',
      subtotalCents: Math.round(parseFloat(payload.price) * 100),
      taxCents: 0,
      totalCents: Math.round(parseFloat(payload.price) * 100),
      currency: 'USD',
      country: payload.country,
    },
  });

  // Create order item
  const productSlug = payload.permalink || payload.product_permalink;
  
  const product = await prisma.product.findFirst({
    where: { gumroadPermalink: productSlug },
  });

  const orderItem = await prisma.orderItem.create({
    data: {
      orderId: order.id,
      productId: product?.id,
      productSlug: productSlug,
      variant: payload.license_key ? 'commercial' : 'individual',
      quantity: 1,
      unitPriceCents: Math.round(parseFloat(payload.price) * 100),
      licenseKey: payload.license_key || null,
    },
  });

  // Generate download token
  const token = generateDownloadToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 365);

  await prisma.downloadToken.create({
    data: {
      token,
      orderItemId: orderItem.id,
      userId: user.id,
      expiresAt,
      maxDownloads: 10,
    },
  });

  // Create entitlement
  await processEntitlement({
    userId: user.id,
    source: 'order',
    sourceId: orderItem.id,
    productSlug,
    status: 'active',
    expiresAt: null,
  });

  // Send order email
  await sendOrderEmail(user.email, user.name, order.orderNumber);
}

async function handleGumroadRefund(payload: any, webhookEventId: bigint) {
  const saleId = payload.sale_id;

  const order = await prisma.order.findUnique({
    where: {
      provider_providerOrderId: {
        provider: 'gumroad',
        providerOrderId: saleId,
      },
    },
    include: { items: true },
  });

  if (!order) {
    console.error('Order not found for refund:', saleId);
    return;
  }

  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: 'refunded',
      refundedAt: new Date(),
    },
  });

  // Revoke entitlements
  for (const item of order.items) {
    await prisma.entitlement.updateMany({
      where: {
        source: 'order',
        sourceId: item.id,
      },
      data: {
        status: 'revoked',
      },
    });
  }
}
```

---

### Step 4: Create Entitlement Management

**File:** `lib/payments/entitlement.ts`

```typescript
import { prisma } from '@/lib/db';
import { EntitlementSource, EntitlementStatus } from '@prisma/client';

interface EntitlementData {
  userId: bigint;
  source: EntitlementSource;
  sourceId: bigint;
  productSlug?: string | null;
  planCode?: string | null;
  status: EntitlementStatus;
  expiresAt: Date | null;
}

/**
 * Process entitlement (create or update)
 */
export async function processEntitlement(data: EntitlementData) {
  const existing = await prisma.entitlement.findFirst({
    where: {
      userId: data.userId,
      source: data.source,
      sourceId: data.sourceId,
    },
  });

  if (existing) {
    // Update existing
    return await prisma.entitlement.update({
      where: { id: existing.id },
      data: {
        status: data.status,
        expiresAt: data.expiresAt,
      },
    });
  } else {
    // Create new
    return await prisma.entitlement.create({
      data,
    });
  }
}

/**
 * Check if user has access to product
 */
export async function hasProductAccess(
  userId: bigint,
  productSlug: string
): Promise<boolean> {
  const entitlement = await prisma.entitlement.findFirst({
    where: {
      userId,
      productSlug,
      status: 'active',
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
    },
  });

  return !!entitlement;
}

/**
 * Check if user has active subscription
 */
export async function hasActiveSubscription(
  userId: bigint,
  planCode?: string
): Promise<boolean> {
  const where: any = {
    userId,
    status: 'active',
    OR: [
      { expiresAt: null },
      { expiresAt: { gt: new Date() } },
    ],
  };

  if (planCode) {
    where.planCode = planCode;
  }

  const entitlement = await prisma.entitlement.findFirst({ where });

  return !!entitlement;
}

/**
 * Get user's active entitlements
 */
export async function getUserEntitlements(userId: bigint) {
  return await prisma.entitlement.findMany({
    where: {
      userId,
      status: 'active',
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
    },
  });
}

/**
 * Revoke entitlement
 */
export async function revokeEntitlement(entitlementId: bigint) {
  return await prisma.entitlement.update({
    where: { id: entitlementId },
    data: { status: 'revoked' },
  });
}

/**
 * Expire old entitlements (cron job)
 */
export async function expireOldEntitlements() {
  return await prisma.entitlement.updateMany({
    where: {
      status: 'active',
      expiresAt: { lt: new Date() },
    },
    data: { status: 'expired' },
  });
}
```

---

### Step 5: Create Order Confirmation Email

**File:** `lib/mail/order.ts`

```typescript
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/db';

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send order confirmation email
 */
export async function sendOrderEmail(
  email: string,
  name: string | null,
  orderNumber: string
) {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: {
        include: {
          downloadTokens: true,
        },
      },
    },
  });

  if (!order) {
    throw new Error('Order not found: ' + orderNumber);
  }

  const downloadLinks = order.items.map((item) => {
    const token = item.downloadTokens[0];
    return `
      <li>
        <strong>${item.productSlug}</strong><br>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/api/downloads/${token.token}">
          Download Link
        </a>
        <br>
        <small style="color: #666;">
          Expires: ${token.expiresAt.toLocaleDateString()} | 
          Downloads remaining: ${token.maxDownloads - token.downloadCount}
        </small>
      </li>
    `;
  }).join('');

  await transporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Order Confirmation - ${orderNumber}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Thank You for Your Order!</h1>
        <p>Hi ${name || 'there'},</p>
        <p>Your order <strong>${orderNumber}</strong> has been confirmed.</p>
        
        <h2>Order Details</h2>
        <p>
          Total: ${order.currency} ${(order.totalCents / 100).toFixed(2)}<br>
          Order Date: ${order.createdAt.toLocaleDateString()}
        </p>

        <h2>Download Your Products</h2>
        <ul>
          ${downloadLinks}
        </ul>

        <p style="margin-top: 40px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/orders" 
             style="background: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            View Order Details
          </a>
        </p>

        <p style="color: #999; font-size: 12px; margin-top: 40px;">
          If you have any questions, please contact us at ${process.env.SMTP_USER}
        </p>
      </div>
    `,
  });
}
```

---

### Step 6: Create Account Orders Page

**File:** `app/account/orders/page.tsx`

```typescript
import { Metadata } from 'next';
import { requireUser } from '@/lib/auth/guards';
import { prisma } from '@/lib/db';

export const metadata: Metadata = {
  title: 'My Orders - AGY Flow',
};

export default async function OrdersPage() {
  const user = await requireUser();

  const orders = await prisma.order.findMany({
    where: { userId: BigInt(user.id) },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">No orders yet</p>
          <a href="/products" className="text-blue-600 hover:underline mt-4 inline-block">
            Browse Products →
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id.toString()} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-semibold">{order.orderNumber}</h2>
                  <p className="text-sm text-gray-600">
                    {order.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    {order.currency} {(order.totalCents / 100).toFixed(2)}
                  </p>
                  <span className={`text-sm px-2 py-1 rounded ${
                    order.status === 'paid' ? 'bg-green-100 text-green-800' :
                    order.status === 'refunded' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium mb-2">Items:</h3>
                <ul className="space-y-2">
                  {order.items.map((item) => (
                    <li key={item.id.toString()} className="text-sm">
                      {item.productSlug}
                      {item.variant && ` (${item.variant})`}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t pt-4 mt-4">
                <a
                  href={`/account/orders/${order.id}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  View Details & Downloads →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 🧪 Verification Steps

### 1. Webhook Testing (Lemon Squeezy)
```bash
# Test webhook with curl (use test event from LS dashboard)
curl -X POST http://localhost:3000/api/webhooks/lemonsqueezy \
  -H "Content-Type: application/json" \
  -H "X-Signature: test_signature" \
  -d @test_order_created.json

# Check webhook_events table
SELECT * FROM webhook_events ORDER BY received_at DESC LIMIT 1;
```

### 2. Webhook Testing (Gumroad)
```bash
# Test Gumroad webhook
curl -X POST http://localhost:3000/api/webhooks/gumroad \
  -H "Content-Type: application/json" \
  -d @test_gumroad_sale.json

# Check order created
SELECT * FROM orders WHERE provider = 'gumroad' ORDER BY created_at DESC LIMIT 1;
```

### 3. Entitlement Check
```sql
-- Check entitlements created
SELECT * FROM entitlements WHERE user_id = 1;

-- Check download tokens
SELECT * FROM download_tokens WHERE user_id = 1;
```

### 4. Email Verification
- Check email inbox for order confirmation
- Verify download links in email
- Test link expiry

---

## ⚠️ Security & Best Practices

### Webhook Security
- ✅ Signature verification (HMAC for LS, secret for Gumroad)
- ✅ Idempotent processing (unique event_id)
- ✅ Log all events (even invalid)
- ✅ Process in transaction

### Order Security
- ✅ Email matching for user linking
- ✅ Guest checkout supported
- ✅ Order ownership verification

### Rate Limiting
```typescript
// TODO: Implement in FASE 6
// Rate limit webhook endpoints: 100 req/minute per IP
```

---

## 📊 Progress Tracking

| Step | Status | Owner | Notes |
|------|--------|-------|-------|
| Webhook utils | ⏳ Ready | Dev | |
| LS webhook handler | ⏳ Ready | Dev | |
| Gumroad webhook handler | ⏳ Ready | Dev | |
| Entitlement logic | ⏳ Ready | Dev | |
| Order email | ⏳ Ready | Dev | |
| Account orders page | ⏳ Ready | Frontend | |
| Test webhooks | ⏳ Pending | QA | After implementation |

---

## ✅ Definition of Done

FASE 3 is complete when:

- [ ] LS webhook handler implemented & tested
- [ ] Gumroad webhook handler implemented & tested
- [ ] Order creation working (from webhooks)
- [ ] Entitlement system working
- [ ] Download tokens generated automatically
- [ ] Order confirmation emails sent
- [ ] Account orders page showing all orders
- [ ] Idempotent webhook processing verified
- [ ] Refund handling tested
- [ ] All webhook events logged

**Next Phase:** FASE 4 - Admin Dashboard + CMS

---

**Document Version:** 1.0  
**Created:** 2026-09-20  
**Status:** 📝 Ready for execution (after FASE 0-2)
