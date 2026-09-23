# FASE 4-6: Admin, Files, Testing & Deployment

**Status:** 📝 Planned  
**Dependencies:** FASE 0-3 complete  
**Timeline:** 3-4 minggu  
**Last Updated:** 2026-09-20

---

## 📋 FASE 4: Admin Dashboard + CMS (2 minggu)

### Objectives
- Admin authentication & authorization
- Product CRUD (create, read, update, delete)
- Order management & tracking
- User management & role assignment
- CMS for pages (privacy, terms, refund)
- Media library for uploads
- Webhook event inspector

### Implementation Overview

#### 4.1 Admin Layout & Navigation
**File:** `app/admin/layout.tsx`
```typescript
import { requireAdmin } from '@/lib/auth/guards';

export default async function AdminLayout({ children }: { children: React.Node }) {
  await requireAdmin(); // Guard: must be admin
  
  return (
    <div className="flex">
      {/* Sidebar */}
      <nav className="w-64 bg-gray-900 text-white min-h-screen">
        <div className="p-4">
          <h1 className="text-xl font-bold">AGY Admin</h1>
        </div>
        <ul className="space-y-1">
          <li><a href="/admin" className="block px-4 py-2 hover:bg-gray-800">Dashboard</a></li>
          <li><a href="/admin/products" className="block px-4 py-2">Products</a></li>
          <li><a href="/admin/orders" className="block px-4 py-2">Orders</a></li>
          <li><a href="/admin/users" className="block px-4 py-2">Users</a></li>
          <li><a href="/admin/pages" className="block px-4 py-2">Pages</a></li>
          <li><a href="/admin/media" className="block px-4 py-2">Media</a></li>
          <li><a href="/admin/webhooks" className="block px-4 py-2">Webhooks</a></li>
          <li><a href="/admin/settings" className="block px-4 py-2">Settings</a></li>
        </ul>
      </nav>
      
      {/* Main content */}
      <main className="flex-1 p-8 bg-gray-50">
        {children}
      </main>
    </div>
  );
}
```

#### 4.2 Products CRUD API
**File:** `app/api/admin/products/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAPI } from '@/lib/auth/guards';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const productSchema = z.object({
  slug: z.string(),
  category: z.string(),
  priceCents: z.number().int().positive(),
  featured: z.boolean().optional(),
  status: z.enum(['draft', 'live', 'archived']),
  // ... other fields
});

export async function GET(request: NextRequest) {
  await requireAdminAPI(request);
  
  const products = await prisma.product.findMany({
    include: { translations: true },
    orderBy: { createdAt: 'desc' },
  });
  
  return NextResponse.json({ ok: true, data: products });
}

export async function POST(request: NextRequest) {
  await requireAdminAPI(request);
  
  const body = await request.json();
  const validated = productSchema.parse(body);
  
  const product = await prisma.product.create({
    data: validated,
  });
  
  return NextResponse.json({ ok: true, data: product });
}
```

#### 4.3 Orders Management API
**File:** `app/api/admin/orders/route.ts`
```typescript
export async function GET(request: NextRequest) {
  await requireAdminAPI(request);
  
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const provider = searchParams.get('provider');
  
  const orders = await prisma.order.findMany({
    where: {
      ...(status && { status }),
      ...(provider && { provider }),
    },
    include: {
      user: { select: { email: true, name: true } },
      items: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  
  return NextResponse.json({ ok: true, data: orders });
}
```

#### 4.4 Pages CMS
**File:** `app/admin/pages/page.tsx`
- List all pages (privacy, terms, refund)
- Edit Markdown content
- Multi-language support (EN/DE/FR)
- Publish/draft status

#### 4.5 Media Library
**File:** `app/api/admin/media/route.ts`
- Upload images (product covers, thumbs)
- File browser with preview
- Delete media
- Usage tracking

---

## 📋 FASE 5: File Upload + Protected Downloads (1 minggu)

### Objectives
- Secure file upload system (admin)
- Protected download handler
- Download token validation
- File storage outside public_html
- Download quota enforcement

### Implementation Overview

#### 5.1 File Upload API
**File:** `app/api/admin/media/route.ts`
```typescript
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  await requireAdminAPI(request);
  
  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  // Validate
  const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'application/pdf', 'application/zip'];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
  }
  
  const maxSize = 25 * 1024 * 1024; // 25MB
  if (file.size > maxSize) {
    return NextResponse.json({ error: 'File too large' }, { status: 400 });
  }
  
  // Generate random filename
  const ext = file.name.split('.').pop();
  const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}.${ext}`;
  const filePath = join(process.env.UPLOADS_DIR!, filename);
  
  // Save file
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);
  
  // Save metadata
  const media = await prisma.media.create({
    data: {
      filename: file.name,
      filePath: filename,
      mime: file.type,
      sizeBytes: BigInt(file.size),
      uploadedBy: BigInt(user.id),
    },
  });
  
  return NextResponse.json({ ok: true, data: media });
}
```

#### 5.2 Protected Download Handler
**File:** `app/api/downloads/[token]/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  const { token } = params;
  
  // Find token
  const downloadToken = await prisma.downloadToken.findUnique({
    where: { token },
    include: {
      orderItem: {
        include: {
          product: {
            include: { files: true },
          },
        },
      },
    },
  });
  
  if (!downloadToken) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 404 });
  }
  
  // Check expiry
  if (downloadToken.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Token expired' }, { status: 403 });
  }
  
  // Check quota
  if (downloadToken.downloadCount >= downloadToken.maxDownloads) {
    return NextResponse.json({ error: 'Download limit reached' }, { status: 403 });
  }
  
  // Get file
  const productFile = downloadToken.orderItem.product?.files[0];
  if (!productFile) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
  
  const filePath = join(process.env.PRODUCT_FILES_DIR!, productFile.filePath);
  const fileBuffer = await readFile(filePath);
  
  // Increment download count
  await prisma.downloadToken.update({
    where: { id: downloadToken.id },
    data: {
      downloadCount: { increment: 1 },
      lastDownloadAt: new Date(),
    },
  });
  
  // Stream file
  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${productFile.filePath}"`,
      'Content-Length': fileBuffer.length.toString(),
    },
  });
}
```

#### 5.3 Account Downloads Page
**File:** `app/account/downloads/page.tsx`
- List all download tokens
- Show expiry dates
- Show remaining downloads
- Download buttons

---

## 📋 FASE 6: Testing, Security & Deployment (1-2 minggu)

### Objectives
- E2E testing (Playwright)
- Security audit & hardening
- Rate limiting implementation
- Production deployment guide
- Monitoring & backup setup

### 6.1 E2E Tests (Playwright)

**File:** `tests/e2e/auth.spec.ts`
```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('user can register and verify email', async ({ page }) => {
    await page.goto('/register');
    
    await page.fill('#name', 'Test User');
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'password123');
    await page.fill('#confirmPassword', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Registration successful')).toBeVisible();
  });
  
  test('user can login after verification', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/account');
  });
  
  test('protected routes require authentication', async ({ page }) => {
    await page.goto('/account');
    await expect(page).toHaveURL('/login');
  });
});
```

**File:** `tests/e2e/purchase.spec.ts`
```typescript
test.describe('Purchase Flow', () => {
  test('webhook creates order and entitlement', async ({ request }) => {
    const response = await request.post('/api/webhooks/lemonsqueezy', {
      headers: {
        'X-Signature': 'test_signature',
        'Content-Type': 'application/json',
      },
      data: testOrderPayload,
    });
    
    expect(response.status()).toBe(200);
    
    // Verify order created
    const order = await prisma.order.findFirst({
      where: { providerOrderId: testOrderPayload.data.id },
    });
    expect(order).toBeTruthy();
  });
});
```

### 6.2 Security Checklist

**File:** `docs/SECURITY_CHECKLIST.md`
```markdown
- [ ] All secrets in environment variables (not in code)
- [ ] HTTPS enforced in production
- [ ] Cookies: HttpOnly, Secure, SameSite=Lax
- [ ] Rate limiting on auth endpoints (5/min)
- [ ] Rate limiting on webhooks (100/min)
- [ ] SQL injection: Prisma ORM (safe by default)
- [ ] XSS: React escapes by default
- [ ] CSRF: Auth.js tokens + SameSite cookies
- [ ] File uploads: whitelist MIME types
- [ ] File uploads: max size 25MB
- [ ] Download tokens: expiry + quota
- [ ] Password: bcrypt cost 12
- [ ] Email verification required
- [ ] Admin routes: role check
- [ ] Webhook signatures: HMAC verification
- [ ] Audit logging: all admin actions
- [ ] Error handling: no sensitive data in responses
```

### 6.3 Rate Limiting

**File:** `lib/rate-limit.ts`
```typescript
import { LRUCache } from 'lru-cache';

const rateLimit = new LRUCache<string, number>({
  max: 500,
  ttl: 60000, // 1 minute
});

export function checkRateLimit(
  identifier: string,
  limit: number
): boolean {
  const count = rateLimit.get(identifier) || 0;
  
  if (count >= limit) {
    return false; // Rate limit exceeded
  }
  
  rateLimit.set(identifier, count + 1);
  return true;
}

// Usage in middleware or API route:
// if (!checkRateLimit(ip, 5)) {
//   return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
// }
```

### 6.4 Production Deployment (cPanel Node.js App)

**Deployment Steps:**
```bash
# 1. Build application
npm run build

# 2. Setup Node.js App in cPanel
# - Application root: /home/cpaneluser/agyflow.com
# - Application URL: https://agyflow.com
# - Application startup file: .next/standalone/server.js
# - Node.js version: 18.x or 20.x

# 3. Environment variables (in cPanel Node.js App settings)
# Copy from .env.local to cPanel environment variables

# 4. Database migration
npx prisma db push

# 5. Seed data (if needed)
npx prisma db seed

# 6. Start application
# cPanel will auto-restart via Passenger

# 7. Verify
curl https://agyflow.com/api/auth/csrf
# Should return CSRF token
```

### 6.5 Monitoring & Backup

**Backup Script:** `scripts/backup.sh`
```bash
#!/bin/bash
# Daily MySQL backup via cPanel cron

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/cpaneluser/backups"

# Database backup
mysqldump -u$DB_USER -p$DB_PASS $DB_NAME | gzip > "$BACKUP_DIR/db_$DATE.sql.gz"

# Files backup
tar -czf "$BACKUP_DIR/uploads_$DATE.tar.gz" $UPLOADS_DIR
tar -czf "$BACKUP_DIR/product_files_$DATE.tar.gz" $PRODUCT_FILES_DIR

# Keep last 30 days
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete

echo "Backup completed: $DATE"
```

**Cron job (cPanel):**
```
0 2 * * * /home/cpaneluser/agyflow.com/scripts/backup.sh
```

---

## ✅ Definition of Done (All Phases)

### FASE 4 Complete When:
- [ ] Admin dashboard accessible (`/admin`)
- [ ] Product CRUD working
- [ ] Order management working
- [ ] User management working
- [ ] Pages CMS working
- [ ] Media library working
- [ ] Webhook inspector working

### FASE 5 Complete When:
- [ ] File upload working (admin)
- [ ] Protected downloads working
- [ ] Token validation working
- [ ] Download quota enforced
- [ ] Files stored outside public_html

### FASE 6 Complete When:
- [ ] E2E tests passing (Playwright)
- [ ] Security checklist 100% complete
- [ ] Rate limiting active
- [ ] Production deployed successfully
- [ ] Backup cron running
- [ ] Monitoring alerts configured
- [ ] Rollback plan documented

---

## 📊 Final Progress Tracking

| Fase | Documentation | Implementation | Status |
|------|--------------|----------------|--------|
| 0 | ✅ 337 lines | ⏳ Pending | Infrastructure |
| 1 | ✅ 1,096 lines | ⏳ Pending | Dynamic foundation |
| 2 | ✅ 1,144 lines | ⏳ Pending | Authentication |
| 3 | ✅ 1,140 lines | ⏳ Pending | Webhooks & Orders |
| 4 | ✅ This doc | ⏳ Pending | Admin Dashboard |
| 5 | ✅ This doc | ⏳ Pending | File Management |
| 6 | ✅ This doc | ⏳ Pending | Testing & Deploy |

**Total Documentation:** 3,717+ lines  
**Status:** 100% documented, ready for implementation

---

## 🚀 Implementation Order (Recommended)

### Week 1-2: FASE 0 & 1
- Setup infrastructure
- Database migration
- ISR implementation

### Week 3-4: FASE 2
- Authentication system
- User management

### Week 5-6: FASE 3
- Webhook handlers
- Order tracking
- Entitlements

### Week 7: FASE 4
- Admin dashboard
- CRUD interfaces

### Week 8: FASE 5 & 6
- File management
- Testing
- Deployment

**Total: 8 weeks** to full production deployment

---

**Document Version:** 1.0  
**Created:** 2026-09-20  
**Status:** 📝 Complete - Ready for implementation
