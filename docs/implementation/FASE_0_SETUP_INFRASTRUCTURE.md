# FASE 0: Setup Infrastructure

**Status:** 🚧 In Progress  
**Timeline:** 1 sesi  
**Owner:** Implementation Team  
**Last Updated:** 2026-09-20

---

## 📋 Objectives

1. Setup MySQL database schema
2. Configure environment variables
3. Verify Node.js compatibility in cPanel
4. Prepare development environment

---

## ✅ Checklist

### 1. Database Setup

- [ ] Create MySQL database via cPanel
  - Database name: `agyflow_main` (or `cpaneluser_agyflow`)
  - Charset: `utf8mb4`
  - Collation: `utf8mb4_unicode_ci`
  
- [ ] Create database user with full privileges
  
- [ ] Document database credentials securely

**Commands (cPanel MySQL):**
```sql
-- Will be created via cPanel interface
-- Database: agyflow_main
-- User: agyflow_user
-- Grant ALL PRIVILEGES
```

### 2. Environment Variables

- [x] Create comprehensive `.env.example`
- [ ] Create `.env.local` for development (not committed)
- [ ] Document all required environment variables

**File Created:** `.env.example`

**Required Variables:**
```bash
# Database
DATABASE_URL=mysql://user:pass@localhost:3306/agyflow_main

# Site
NEXT_PUBLIC_APP_URL=https://agyflow.com

# Auth (next-auth v5)
AUTH_SECRET=                      # openssl rand -hex 32
AUTH_URL=https://agyflow.com

# Lemon Squeezy
LEMONSQUEEZY_API_KEY=
LEMONSQUEEZY_WEBHOOK_SECRET=
LEMONSQUEEZY_STORE_ID=

# Gumroad
GUMROAD_ACCESS_TOKEN=
GUMROAD_WEBHOOK_SECRET=

# Email (SMTP cPanel)
SMTP_HOST=mail.agyflow.com
SMTP_PORT=465
SMTP_USER=noreply@agyflow.com
SMTP_PASS=

# File Storage
UPLOADS_DIR=/home/cpaneluser/uploads
PRODUCT_FILES_DIR=/home/cpaneluser/product-files
```

### 3. Node.js Verification

- [x] **Confirmed:** cPanel supports Node.js (2026-09-19)
- [x] Tested "Setup Node.js App" with an isolated staging application (2026-09-21)
- [x] Verified Node.js `20.20.2` through CloudLinux Passenger

**Staging proof:**
- URL: `https://staging.agyflow.com/health`
- Runtime: CloudLinux Node.js Selector + Passenger
- HTTPS: valid AutoSSL certificate
- Environment variables: verified through a non-secret deployment identifier
- Lifecycle: cPanel restart succeeded and the health endpoint remained available after the authenticated cPanel session ended
- Production routes remained HTTP 200
- Full evidence: `docs/implementation/CPANEL_NODE_STAGING_PROOF.md`

**Notes:**
- Hosting: Rumahweb cPanel (203.175.9.146)
- Node.js versions 18.20.8, 20.20.2, and 22.23.2 are available; staging uses 20.20.2

### 4. Dependencies Installation

- [ ] Install new dependencies:
  ```bash
  npm install mysql2 bcryptjs zod
  npm install next-auth@beta  # v5
  npm install nodemailer
  npm install -D @types/nodemailer @types/bcryptjs
  ```

- [ ] Install Prisma (or Drizzle if Prisma incompatible):
  ```bash
  npm install prisma @prisma/client
  npm install -D prisma
  ```

### 5. Directory Structure

- [ ] Create new directories:
  ```
  agyflow-web/
  ├── prisma/              # Database schema & migrations
  ├── lib/
  │   ├── db/             # Database connection & queries
  │   ├── auth/           # Auth.js configuration
  │   ├── payments/       # Payment integrations
  │   ├── cms/            # CMS queries
  │   ├── uploads/        # File upload handlers
  │   ├── mail/           # Email service
  │   └── validators/     # Zod schemas
  └── app/
      ├── api/
      │   ├── auth/       # Auth.js routes
      │   ├── webhooks/   # Payment webhooks
      │   ├── account/    # User API
      │   └── admin/      # Admin API
      ├── account/        # User dashboard
      ├── admin/          # Admin dashboard
      ├── login/          # Auth pages
      ├── register/
      ├── verify-email/
      └── reset-password/
  ```

---

## 📝 Implementation Steps

### Step 1: Update Environment Configuration

**Action:** Replace `.env.example` with comprehensive variables

**File:** `.env.example`

**Changes:**
- Added `DATABASE_URL` for MySQL
- Added Auth.js v5 configuration
- Added payment provider credentials
- Added SMTP configuration
- Added file storage paths

**Status:** ✅ Complete

### Step 2: Create Development Environment File

**Action:** Create `.env.local` from `.env.example`

**Command:**
```bash
cp .env.example .env.local
```

**Then fill in:**
```bash
# Generate AUTH_SECRET
openssl rand -hex 32

# Fill database credentials (from cPanel)
DATABASE_URL=mysql://agyflow_user:PASSWORD@localhost:3306/agyflow_main

# Development URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
AUTH_URL=http://localhost:3000

# Other secrets (get from dashboards)
LEMONSQUEEZY_API_KEY=...
LEMONSQUEEZY_WEBHOOK_SECRET=...
GUMROAD_ACCESS_TOKEN=...
```

**Status:** 🚧 Pending (awaiting credentials)

### Step 3: Install Dependencies

**Action:** Add required npm packages

**Command:**
```bash
cd m:\saas\saas\agyflow-web
npm install mysql2 bcryptjs zod next-auth@beta nodemailer
npm install -D @types/nodemailer @types/bcryptjs
npm install prisma @prisma/client
npx prisma init
```

**Expected Output:**
- `package.json` updated with new dependencies
- `package-lock.json` updated
- `prisma/` directory created with `schema.prisma`

**Status:** ⏳ Ready to execute

### Step 4: Create Directory Structure

**Action:** Create all necessary directories

**Command:**
```bash
# Create lib subdirectories
mkdir -p lib/db lib/auth lib/payments lib/cms lib/uploads lib/mail lib/validators

# Create app/api subdirectories
mkdir -p app/api/auth app/api/webhooks app/api/account app/api/admin

# Create app pages
mkdir -p app/account app/admin app/login app/register app/verify-email app/reset-password
```

**Status:** ⏳ Ready to execute

---

## 🔧 Configuration Files

### next.config.mjs Changes (Planned for FASE 1)

**Current:**
```javascript
output: "export",  // ❌ Will be removed
```

**Target:**
```javascript
output: "standalone",  // ✅ Server mode
```

**Status:** Deferred to FASE 1

### .gitignore Updates

**Add:**
```
.env.local
.env
prisma/*.db
prisma/*.db-journal
uploads/
product-files/
*.pem
```

**Status:** ⏳ Ready to execute

---

## 📊 Progress Tracking

| Task | Status | Owner | Notes |
|------|--------|-------|-------|
| Database creation | ⏳ Pending | DevOps | Via cPanel |
| Environment variables | ✅ Complete | Dev | `.env.example` created |
| Node.js verification | ✅ Complete | DevOps | Confirmed 2026-09-19 |
| Dependencies install | ⏳ Ready | Dev | Command prepared |
| Directory structure | ⏳ Ready | Dev | Command prepared |

---

## ⚠️ Dependencies & Blockers

### Dependencies
- None (FASE 0 is foundational)

### Blockers
- ⏳ **Database credentials:** Need cPanel access to create database
- ⏳ **Payment credentials:** Need LS/Gumroad API keys

### Decisions Made
- ✅ **MySQL over PostgreSQL:** Per owner request, native cPanel support
- ✅ **Auth.js over Clerk:** Self-hosted, no external dependency
- ✅ **cPanel Node.js (Opsi A):** Confirmed supported, will start here

---

## 🧪 Verification Steps

After FASE 0 completion, verify:

1. **Database Connection:**
   ```bash
   npx prisma db push  # Should connect successfully
   ```

2. **Environment Loading:**
   ```javascript
   // test-env.mjs
   console.log(process.env.DATABASE_URL ? '✅ DATABASE_URL loaded' : '❌ Missing');
   console.log(process.env.AUTH_SECRET ? '✅ AUTH_SECRET loaded' : '❌ Missing');
   ```

3. **Directory Structure:**
   ```bash
   ls -la lib/db lib/auth lib/payments
   ls -la app/api/auth app/api/webhooks
   ```

---

## 📚 References

- **Main Design Doc:** `AGYFLOW_DYNAMIC_WEBSITE_DESIGN.md`
- **Database Schema:** See §5 of design doc
- **Environment Variables:** See §13 of design doc
- **Hosting Decision:** See §3.2 (Opsi A confirmed)

---

## ✅ Definition of Done

FASE 0 is complete when:

- [x] `.env.example` comprehensive and documented
- [ ] MySQL database created in cPanel
- [ ] Database user created with privileges
- [ ] `.env.local` filled with real credentials
- [ ] All dependencies installed (`npm install` success)
- [ ] Directory structure created
- [ ] `.gitignore` updated
- [ ] Prisma initialized
- [ ] Database connection tested successfully
- [ ] Documentation complete

**Next Phase:** FASE 1 - Fondasi Dinamis

---

**Document Version:** 1.0  
**Created:** 2026-09-20  
**Status:** 🚧 In Progress (Step 1 complete)
