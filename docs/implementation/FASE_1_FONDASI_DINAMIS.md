# FASE 1: Fondasi Dinamis

**Status:** 📝 Planned  
**Dependencies:** FASE 0 complete  
**Timeline:** 1-2 minggu  
**Owner:** Development Team  
**Last Updated:** 2026-09-20

---

## 📋 Objectives

1. Remove static export (`output: "export"`)
2. Setup MySQL connection with Prisma
3. Implement complete database schema
4. Seed products from JSON to database
5. Migrate `lib/products.ts` to read from DB
6. Implement ISR for product pages
7. Deploy to staging environment

---

## ✅ Checklist

### 1. Next.js Configuration Changes

- [ ] Remove `output: "export"` from `next.config.mjs`
- [ ] Set `output: "standalone"`
- [ ] Test local build with `npm run build`
- [ ] Verify Route Handlers are now active

### 2. Database Setup

- [ ] Initialize Prisma
- [ ] Create complete schema.prisma
- [ ] Run initial migration
- [ ] Verify all tables created

### 3. Data Migration

- [ ] Create seed script for products
- [ ] Migrate `data/products.json` → database
- [ ] Verify product data in database
- [ ] Test product queries

### 4. Code Refactoring

- [ ] Create `lib/db/` connection utilities
- [ ] Create `lib/cms/products.ts` for DB queries
- [ ] Update `lib/products.ts` to use DB instead of JSON
- [ ] Update product pages to use ISR

### 5. Staging Deployment

- [ ] Setup staging subdomain
- [ ] Deploy to cPanel Node.js App
- [ ] Test all product pages
- [ ] Verify ISR revalidation

---

## 🔧 Implementation Steps

### Step 1: Update Next.js Configuration

**File:** `next.config.mjs`

**Current:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",  // ❌ REMOVE THIS
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

**New:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",  // ✅ Server mode
  trailingSlash: false,
  images: {
    unoptimized: true,  // Keep for shared hosting
  },
};

export default nextConfig;
```

**Impact:**
- ✅ Route Handlers now work
- ✅ Server Actions available
- ✅ Middleware can run
- ✅ ISR (Incremental Static Regeneration) enabled

**Verification:**
```bash
npm run build
# Should build .next/ instead of out/
# Check for .next/standalone/ directory
```

---

### Step 2: Initialize Prisma

**Command:**
```bash
npx prisma init
```

**Creates:**
- `prisma/schema.prisma`
- Updates `.env` with `DATABASE_URL`

**Configure Prisma for MySQL:**

**File:** `prisma/schema.prisma`

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// ========================================
// AUTH & USER MANAGEMENT
// ========================================

model User {
  id              BigInt    @id @default(autoincrement()) @db.UnsignedBigInt
  email           String    @unique @db.VarChar(190)
  passwordHash    String?   @map("password_hash") @db.VarChar(255)
  name            String?   @db.VarChar(190)
  role            UserRole  @default(customer)
  emailVerifiedAt DateTime? @map("email_verified_at") @db.DateTime
  locale          String    @default("en") @db.Char(2)
  createdAt       DateTime  @default(now()) @map("created_at") @db.DateTime
  updatedAt       DateTime  @updatedAt @map("updated_at") @db.DateTime

  // Relations
  accounts       Account[]
  sessions       Session[]
  orders         Order[]
  subscriptions  Subscription[]
  entitlements   Entitlement[]
  mediaUploads   Media[]       @relation("MediaUploader")
  auditLogs      AuditLog[]

  @@map("users")
}

enum UserRole {
  customer
  admin

  @@map("user_role")
}

model Account {
  id                BigInt   @id @default(autoincrement()) @db.UnsignedBigInt
  userId            BigInt   @map("user_id") @db.UnsignedBigInt
  provider          String   @db.VarChar(50)
  providerAccountId String   @map("provider_account_id") @db.VarChar(190)
  accessToken       String?  @map("access_token") @db.Text
  refreshToken      String?  @map("refresh_token") @db.Text
  expiresAt         BigInt?  @map("expires_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
  @@map("accounts")
}

model Session {
  id           BigInt   @id @default(autoincrement()) @db.UnsignedBigInt
  sessionToken String   @unique @map("session_token") @db.VarChar(190)
  userId       BigInt   @map("user_id") @db.UnsignedBigInt
  expires      DateTime @db.DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("sessions")
}

model VerificationToken {
  identifier String   @db.VarChar(190)
  token      String   @db.VarChar(190)
  expires    DateTime @db.DateTime

  @@id([identifier, token])
  @@map("verification_tokens")
}

// ========================================
// CMS: PRODUCTS & CONTENT
// ========================================

model Product {
  id                    BigInt    @id @default(autoincrement()) @db.UnsignedBigInt
  slug                  String    @unique @db.VarChar(190)
  category              String    @db.VarChar(50)
  priceCents            Int       @map("price_cents") @db.UnsignedInt
  compareAtCents        Int?      @map("compare_at_cents") @db.UnsignedInt
  commercialPriceCents  Int?      @map("commercial_price_cents") @db.UnsignedInt
  currency              String    @default("USD") @db.Char(3)
  badge                 String?   @db.VarChar(120)
  featured              Boolean   @default(false) @db.TinyInt
  status                ProductStatus @default(draft)
  formatJson            Json?     @map("format_json")
  coverPath             String?   @map("cover_path") @db.VarChar(255)
  thumbPath             String?   @map("thumb_path") @db.VarChar(255)
  checkoutUrl           String?   @map("checkout_url") @db.VarChar(255)
  gumroadPermalink      String?   @map("gumroad_permalink") @db.VarChar(190)
  lemonsqueezyVariantId String?   @map("lemonsqueezy_variant_id") @db.VarChar(60)
  sortOrder             Int       @default(0) @map("sort_order")
  createdAt             DateTime  @default(now()) @map("created_at") @db.DateTime
  updatedAt             DateTime  @updatedAt @map("updated_at") @db.DateTime

  // Relations
  translations ProductTranslation[]
  files        ProductFile[]
  orderItems   OrderItem[]

  @@index([status, featured])
  @@map("products")
}

enum ProductStatus {
  draft
  live
  archived

  @@map("product_status")
}

model ProductTranslation {
  id              BigInt  @id @default(autoincrement()) @db.UnsignedBigInt
  productId       BigInt  @map("product_id") @db.UnsignedBigInt
  locale          String  @db.Char(2)
  name            String  @db.VarChar(190)
  shortName       String? @map("short_name") @db.VarChar(120)
  tagline         String? @db.VarChar(255)
  audience        String? @db.VarChar(255)
  descriptionJson Json?   @map("description_json")
  featuresJson    Json?   @map("features_json")
  statsJson       Json?   @map("stats_json")

  product Product @relation(fields: [productId], references: [id])

  @@unique([productId, locale])
  @@index([productId])
  @@map("product_translations")
}

model Page {
  id          BigInt      @id @default(autoincrement()) @db.UnsignedBigInt
  slug        String      @db.VarChar(190)
  locale      String      @db.Char(2)
  title       String      @db.VarChar(190)
  bodyMd      String      @map("body_md") @db.MediumText
  status      PageStatus  @default(draft)
  publishedAt DateTime?   @map("published_at") @db.DateTime
  updatedAt   DateTime    @updatedAt @map("updated_at") @db.DateTime

  @@unique([slug, locale])
  @@map("pages")
}

enum PageStatus {
  draft
  published

  @@map("page_status")
}

model SiteSetting {
  key       String   @id @db.VarChar(100)
  valueJson Json?    @map("value_json")
  updatedAt DateTime @updatedAt @map("updated_at") @db.DateTime

  @@map("site_settings")
}

// ========================================
// PLANS & SUBSCRIPTIONS
// ========================================

model Plan {
  id            BigInt   @id @default(autoincrement()) @db.UnsignedBigInt
  code          String   @db.VarChar(50)
  name          String   @db.VarChar(120)
  interval      PlanInterval
  priceCents    Int      @map("price_cents") @db.UnsignedInt
  currency      String   @default("USD") @db.Char(3)
  limitsJson    Json?    @map("limits_json")
  lsVariantId   String?  @map("ls_variant_id") @db.VarChar(60)
  active        Boolean  @default(true) @db.TinyInt

  subscriptions Subscription[]

  @@unique([code, interval])
  @@map("plans")
}

enum PlanInterval {
  month
  year
  lifetime

  @@map("plan_interval")
}

model Subscription {
  id                     BigInt             @id @default(autoincrement()) @db.UnsignedBigInt
  userId                 BigInt             @map("user_id") @db.UnsignedBigInt
  planId                 BigInt             @map("plan_id") @db.UnsignedBigInt
  provider               PaymentProvider
  providerCustomerId     String?            @map("provider_customer_id") @db.VarChar(80)
  providerSubscriptionId String?            @map("provider_subscription_id") @db.VarChar(80)
  status                 SubscriptionStatus @default(trialing)
  currentPeriodEnd       DateTime?          @map("current_period_end") @db.DateTime
  cancelAtPeriodEnd      Boolean            @default(false) @map("cancel_at_period_end") @db.TinyInt
  createdAt              DateTime           @default(now()) @map("created_at") @db.DateTime
  updatedAt              DateTime           @updatedAt @map("updated_at") @db.DateTime

  user         User          @relation(fields: [userId], references: [id])
  plan         Plan          @relation(fields: [planId], references: [id])
  entitlements Entitlement[]

  @@unique([provider, providerSubscriptionId])
  @@index([userId, status])
  @@map("subscriptions")
}

enum SubscriptionStatus {
  trialing
  active
  past_due
  cancelled
  expired
  lifetime
  manual_override

  @@map("subscription_status")
}

// ========================================
// ORDERS & PAYMENTS
// ========================================

model Order {
  id              BigInt          @id @default(autoincrement()) @db.UnsignedBigInt
  orderNumber     String          @unique @map("order_number") @db.VarChar(30)
  userId          BigInt?         @map("user_id") @db.UnsignedBigInt
  email           String          @db.VarChar(190)
  provider        PaymentProvider
  providerOrderId String          @map("provider_order_id") @db.VarChar(80)
  status          OrderStatus     @default(paid)
  subtotalCents   Int             @map("subtotal_cents") @db.UnsignedInt
  taxCents        Int             @default(0) @map("tax_cents") @db.UnsignedInt
  totalCents      Int             @map("total_cents") @db.UnsignedInt
  currency        String          @default("USD") @db.Char(3)
  country         String?         @db.Char(2)
  refundedAt      DateTime?       @map("refunded_at") @db.DateTime
  createdAt       DateTime        @default(now()) @map("created_at") @db.DateTime

  user  User?       @relation(fields: [userId], references: [id])
  items OrderItem[]

  @@unique([provider, providerOrderId])
  @@index([userId])
  @@index([email])
  @@map("orders")
}

enum OrderStatus {
  paid
  refunded
  partially_refunded
  failed

  @@map("order_status")
}

enum PaymentProvider {
  lemonsqueezy
  gumroad
  manual

  @@map("payment_provider")
}

model OrderItem {
  id            BigInt  @id @default(autoincrement()) @db.UnsignedBigInt
  orderId       BigInt  @map("order_id") @db.UnsignedBigInt
  productId     BigInt? @map("product_id") @db.UnsignedBigInt
  productSlug   String  @map("product_slug") @db.VarChar(190)
  variant       String? @db.VarChar(60)
  quantity      Int     @default(1) @db.UnsignedInt
  unitPriceCents Int    @map("unit_price_cents") @db.UnsignedInt
  licenseKey    String? @map("license_key") @db.VarChar(80)

  order          Order           @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product        Product?        @relation(fields: [productId], references: [id])
  downloadTokens DownloadToken[]

  @@index([orderId])
  @@map("order_items")
}

// ========================================
// ENTITLEMENTS & ACCESS
// ========================================

model Entitlement {
  id          BigInt            @id @default(autoincrement()) @db.UnsignedBigInt
  userId      BigInt            @map("user_id") @db.UnsignedBigInt
  source      EntitlementSource
  sourceId    BigInt            @map("source_id") @db.UnsignedBigInt
  productSlug String?           @map("product_slug") @db.VarChar(190)
  planCode    String?           @map("plan_code") @db.VarChar(50)
  status      EntitlementStatus @default(active)
  expiresAt   DateTime?         @map("expires_at") @db.DateTime
  createdAt   DateTime          @default(now()) @map("created_at") @db.DateTime

  user User @relation(fields: [userId], references: [id])

  @@index([userId, status])
  @@map("entitlements")
}

enum EntitlementSource {
  order
  subscription
  manual

  @@map("entitlement_source")
}

enum EntitlementStatus {
  active
  expired
  revoked

  @@map("entitlement_status")
}

// ========================================
// WEBHOOKS & EVENTS
// ========================================

model WebhookEvent {
  id              BigInt                @id @default(autoincrement()) @db.UnsignedBigInt
  provider        WebhookProvider
  eventId         String                @map("event_id") @db.VarChar(120)
  eventType       String                @map("event_type") @db.VarChar(80)
  payloadJson     Json                  @map("payload_json")
  signatureValid  Boolean               @default(false) @map("signature_valid") @db.TinyInt
  processStatus   WebhookProcessStatus  @default(received) @map("process_status")
  error           String?               @db.Text
  receivedAt      DateTime              @default(now()) @map("received_at") @db.DateTime
  processedAt     DateTime?             @map("processed_at") @db.DateTime

  @@unique([provider, eventId])
  @@map("webhook_events")
}

enum WebhookProvider {
  lemonsqueezy
  gumroad

  @@map("webhook_provider")
}

enum WebhookProcessStatus {
  received
  processed
  failed
  ignored

  @@map("webhook_process_status")
}

// ========================================
// FILE MANAGEMENT
// ========================================

model ProductFile {
  id         BigInt   @id @default(autoincrement()) @db.UnsignedBigInt
  productId  BigInt   @map("product_id") @db.UnsignedBigInt
  variant    String?  @db.VarChar(60)
  filePath   String   @map("file_path") @db.VarChar(255)
  version    String   @default("1.0") @db.VarChar(30)
  sizeBytes  BigInt?  @map("size_bytes") @db.UnsignedBigInt
  active     Boolean  @default(true) @db.TinyInt
  uploadedAt DateTime @default(now()) @map("uploaded_at") @db.DateTime

  product Product @relation(fields: [productId], references: [id])

  @@index([productId])
  @@map("product_files")
}

model DownloadToken {
  id              BigInt    @id @default(autoincrement()) @db.UnsignedBigInt
  token           String    @unique @db.Char(64)
  orderItemId     BigInt    @map("order_item_id") @db.UnsignedBigInt
  userId          BigInt?   @map("user_id") @db.UnsignedBigInt
  expiresAt       DateTime  @map("expires_at") @db.DateTime
  maxDownloads    Int       @default(10) @map("max_downloads") @db.UnsignedInt
  downloadCount   Int       @default(0) @map("download_count") @db.UnsignedInt
  lastDownloadAt  DateTime? @map("last_download_at") @db.DateTime
  createdAt       DateTime  @default(now()) @map("created_at") @db.DateTime

  orderItem OrderItem @relation(fields: [orderItemId], references: [id], onDelete: Cascade)

  @@map("download_tokens")
}

model Media {
  id         BigInt   @id @default(autoincrement()) @db.UnsignedBigInt
  filename   String   @db.VarChar(190)
  filePath   String   @map("file_path") @db.VarChar(255)
  mime       String   @db.VarChar(80)
  sizeBytes  BigInt   @map("size_bytes") @db.UnsignedBigInt
  uploadedBy BigInt?  @map("uploaded_by") @db.UnsignedBigInt
  createdAt  DateTime @default(now()) @map("created_at") @db.DateTime

  uploader User? @relation("MediaUploader", fields: [uploadedBy], references: [id])

  @@map("media")
}

// ========================================
// AUDIT & USAGE
// ========================================

model AuditLog {
  id        BigInt   @id @default(autoincrement()) @db.UnsignedBigInt
  userId    BigInt?  @map("user_id") @db.UnsignedBigInt
  action    String   @db.VarChar(60)
  entity    String   @db.VarChar(60)
  entityId  String?  @map("entity_id") @db.VarChar(60)
  metaJson  Json?    @map("meta_json")
  ip        String?  @db.VarChar(45)
  createdAt DateTime @default(now()) @map("created_at") @db.DateTime

  user User? @relation(fields: [userId], references: [id])

  @@index([entity, entityId])
  @@index([userId])
  @@map("audit_log")
}

model UsageLog {
  id        BigInt   @id @default(autoincrement()) @db.UnsignedBigInt
  userId    BigInt   @map("user_id") @db.UnsignedBigInt
  action    String   @db.VarChar(60)
  units     Int      @default(1) @db.UnsignedInt
  createdAt DateTime @default(now()) @map("created_at") @db.DateTime

  @@index([userId, action, createdAt])
  @@map("usage_log")
}
```

**Verification:**
```bash
npx prisma validate
# Should show: "The schema is valid"
```

---

### Step 3: Run Database Migration

**Command:**
```bash
npx prisma db push
```

**Expected Output:**
```
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": MySQL database "agyflow_main" at "localhost:3306"

🚀  Your database is now in sync with your Prisma schema. Done in 2.51s

✔ Generated Prisma Client (5.x.x | library) to ./node_modules/@prisma/client in 150ms
```

**Verification:**
```bash
# Check tables created
mysql -u agyflow_user -p agyflow_main -e "SHOW TABLES;"
# Should list: users, accounts, sessions, products, etc.
```

---

### Step 4: Create Seed Script

**File:** `prisma/seed.ts`

```typescript
import { PrismaClient } from '@prisma/client';
import productsJson from '../data/products.json';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Seed products from JSON
  for (const product of productsJson.products) {
    console.log(`  → Seeding product: ${product.slug}`);

    const created = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        slug: product.slug,
        category: product.category,
        priceCents: Math.round(product.price * 100),
        compareAtCents: product.compareAt ? Math.round(product.compareAt * 100) : null,
        commercialPriceCents: product.commercialPrice ? Math.round(product.commercialPrice * 100) : null,
        currency: 'USD',
        badge: product.badge,
        featured: product.featured || false,
        status: 'live',
        formatJson: product.format,
        coverPath: product.cover,
        thumbPath: product.thumb,
        checkoutUrl: product.checkoutUrl,
        gumroadPermalink: product.gumroadPermalink,
        sortOrder: 0,
      },
    });

    // Seed translations
    for (const locale of ['en', 'de', 'fr']) {
      const i18nData = product.i18n[locale];
      if (i18nData) {
        await prisma.productTranslation.upsert({
          where: {
            productId_locale: {
              productId: created.id,
              locale,
            },
          },
          update: {},
          create: {
            productId: created.id,
            locale,
            name: i18nData.name,
            shortName: i18nData.shortName,
            tagline: i18nData.tagline,
            audience: i18nData.audience,
            descriptionJson: i18nData.description,
            featuresJson: i18nData.features,
            statsJson: i18nData.stats,
          },
        });
      }
    }
  }

  console.log('✅ Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Update package.json:**
```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

**Run seed:**
```bash
npx prisma db seed
```

---

### Step 5: Create Database Connection Utility

**File:** `lib/db/index.ts`

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
```

**Usage:**
```typescript
import { prisma } from '@/lib/db';

// Query example
const products = await prisma.product.findMany({
  where: { status: 'live' },
  include: { translations: true },
});
```

---

### Step 6: Create CMS Product Query Module

**File:** `lib/cms/products.ts`

```typescript
import { prisma } from '@/lib/db';
import { ProductStatus } from '@prisma/client';

export interface ProductWithTranslations {
  id: bigint;
  slug: string;
  category: string;
  priceCents: number;
  compareAtCents: number | null;
  commercialPriceCents: number | null;
  currency: string;
  badge: string | null;
  featured: boolean;
  status: ProductStatus;
  coverPath: string | null;
  thumbPath: string | null;
  checkoutUrl: string | null;
  translations: {
    locale: string;
    name: string;
    shortName: string | null;
    tagline: string | null;
    audience: string | null;
    descriptionJson: any;
    featuresJson: any;
    statsJson: any;
  }[];
}

/**
 * Get all live products with translations
 */
export async function getAllProducts(locale: string = 'en'): Promise<ProductWithTranslations[]> {
  const products = await prisma.product.findMany({
    where: {
      status: 'live',
    },
    include: {
      translations: {
        where: {
          locale,
        },
      },
    },
    orderBy: [
      { featured: 'desc' },
      { sortOrder: 'asc' },
    ],
  });

  return products;
}

/**
 * Get single product by slug
 */
export async function getProductBySlug(
  slug: string,
  locale: string = 'en'
): Promise<ProductWithTranslations | null> {
  const product = await prisma.product.findUnique({
    where: {
      slug,
      status: 'live',
    },
    include: {
      translations: {
        where: {
          locale,
        },
      },
    },
  });

  return product;
}

/**
 * Get products by category
 */
export async function getProductsByCategory(
  category: string,
  locale: string = 'en'
): Promise<ProductWithTranslations[]> {
  const products = await prisma.product.findMany({
    where: {
      category,
      status: 'live',
    },
    include: {
      translations: {
        where: {
          locale,
        },
      },
    },
    orderBy: [
      { featured: 'desc' },
      { sortOrder: 'asc' },
    ],
  });

  return products;
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(locale: string = 'en'): Promise<ProductWithTranslations[]> {
  const products = await prisma.product.findMany({
    where: {
      featured: true,
      status: 'live',
    },
    include: {
      translations: {
        where: {
          locale,
        },
      },
    },
    orderBy: {
      sortOrder: 'asc',
    },
  });

  return products;
}
```

---

### Step 7: Update lib/products.ts to use Database

**File:** `lib/products.ts` (refactor)

**Current:** Reads from `data/products.json`

**New:** Uses `lib/cms/products.ts`

```typescript
import { getAllProducts, getProductBySlug, getProductsByCategory, getFeaturedProducts } from './cms/products';

// Re-export CMS functions for backward compatibility
export { getAllProducts, getProductBySlug, getProductsByCategory, getFeaturedProducts };

// Legacy JSON fallback (optional - for development)
export async function getProductsFromJSON() {
  const products = await import('../data/products.json');
  return products.default.products;
}
```

---

### Step 8: Update Product Pages to use ISR

**File:** `app/products/page.tsx`

**Add ISR:**
```typescript
import { getAllProducts } from '@/lib/products';

// ISR: Revalidate every 5 minutes
export const revalidate = 300;

export default async function ProductsPage() {
  const products = await getAllProducts('en');
  
  return (
    <div>
      {/* Render products */}
    </div>
  );
}
```

**File:** `app/products/[slug]/page.tsx`

**Add ISR + generateStaticParams:**
```typescript
import { getProductBySlug, getAllProducts } from '@/lib/products';
import { notFound } from 'next/navigation';

// ISR: Revalidate every 5 minutes
export const revalidate = 300;

// Generate static params for all products
export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div>
      {/* Render product detail */}
    </div>
  );
}
```

**Impact:**
- Pages pre-rendered at build time (fast)
- Revalidate every 5 minutes (fresh content without rebuild)
- Changes in admin dashboard → visible within 5 minutes

---

### Step 9: Test Local Build

**Command:**
```bash
npm run build
```

**Verify:**
- ✅ Build completes without errors
- ✅ `.next/standalone/` directory created
- ✅ No `out/` directory (static export gone)
- ✅ Product pages pre-rendered

**Test server:**
```bash
npm start
# OR
node .next/standalone/server.js
```

**Visit:**
- http://localhost:3000/products
- http://localhost:3000/products/gdpr-checklist
- All should load from database

---

### Step 10: Deploy to Staging

**Setup staging subdomain:**
- `staging.agyflow.com` via cPanel

**Deploy steps:**
1. Git push to repository
2. SSH to cPanel
3. Pull latest code
4. Run build
5. Setup Node.js App in cPanel

**cPanel Node.js App Configuration:**
- Application root: `/home/cpaneluser/staging.agyflow.com`
- Application URL: `https://staging.agyflow.com`
- Application startup file: `.next/standalone/server.js`
- Node.js version: 18.x or 20.x

---

## 🧪 Verification Steps

### Database Verification
```bash
# Check products seeded
mysql -u user -p agyflow_main -e "SELECT COUNT(*) FROM products;"
# Should show: 7 (or number of products in JSON)

# Check translations
mysql -u user -p agyflow_main -e "SELECT COUNT(*) FROM product_translations;"
# Should show: 21 (7 products × 3 locales)
```

### API Verification
```bash
# Test product query
curl http://localhost:3000/api/test-db
# Should return product data from MySQL
```

### Page Verification
- Visit `/products` → should load from DB
- Check source code → should show ISR comment
- Edit product in DB → wait 5 min → reload → should see change

---

## ⚠️ Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Prisma binary incompatible with cPanel | High | Test on staging first; fallback to Drizzle ORM |
| ISR not working | Medium | Test revalidation; fallback to SSR |
| Migration destroys existing site | High | Deploy to staging first; test thoroughly |
| Performance degradation | Medium | Keep images.unoptimized; use MySQL pool efficiently |

---

## 📊 Progress Tracking

| Step | Status | Owner | Notes |
|------|--------|-------|-------|
| Update next.config.mjs | ⏳ Ready | Dev | |
| Initialize Prisma | ⏳ Ready | Dev | |
| Create schema | ⏳ Ready | Dev | |
| Run migration | ⏳ Pending | Dev | Needs DB credentials |
| Create seed script | ⏳ Ready | Dev | |
| Seed products | ⏳ Pending | Dev | After migration |
| Create DB utilities | ⏳ Ready | Dev | |
| Create CMS module | ⏳ Ready | Dev | |
| Update product pages | ⏳ Ready | Dev | |
| Deploy staging | ⏳ Pending | DevOps | After tests pass |

---

## ✅ Definition of Done

FASE 1 is complete when:

- [ ] `output: "standalone"` set in next.config.mjs
- [ ] Prisma schema created and migrated
- [ ] All database tables exist
- [ ] Products seeded from JSON
- [ ] `lib/cms/products.ts` implemented
- [ ] `lib/products.ts` refactored to use DB
- [ ] Product pages use ISR
- [ ] Local build successful
- [ ] Staging deployment successful
- [ ] All product pages load correctly
- [ ] ISR revalidation tested
- [ ] No visual changes to existing pages

**Next Phase:** FASE 2 - Authentication System

---

**Document Version:** 1.0  
**Created:** 2026-09-20  
**Status:** 📝 Ready for execution
