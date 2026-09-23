# FASE 2: Authentication System

**Status:** 📝 Planned  
**Dependencies:** FASE 0 & FASE 1 complete  
**Timeline:** 1-2 minggu  
**Owner:** Backend Team  
**Last Updated:** 2026-09-20

---

## 📋 Objectives

1. Implement Auth.js v5 (next-auth beta) with MySQL adapter
2. Create authentication pages (login, register, verify email, reset password)
3. Setup middleware guards for protected routes
4. Configure SMTP for email notifications
5. Implement role-based access control (customer/admin)
6. Create user profile management pages

---

## ✅ Checklist

### 1. Auth.js Configuration

- [ ] Install Auth.js v5 dependencies
- [ ] Create Auth.js configuration file
- [ ] Setup MySQL adapter
- [ ] Configure credentials provider
- [ ] Setup session strategy (database)
- [ ] Create auth route handler

### 2. Authentication Pages

- [ ] Login page (`app/login/page.tsx`)
- [ ] Register page (`app/register/page.tsx`)
- [ ] Verify email page (`app/verify-email/page.tsx`)
- [ ] Reset password request page (`app/reset-password/page.tsx`)
- [ ] Reset password confirmation page

### 3. Middleware & Guards

- [ ] Create `middleware.ts` for route protection
- [ ] Create `requireUser()` helper
- [ ] Create `requireAdmin()` helper
- [ ] Protect `/account/*` routes
- [ ] Protect `/admin/*` routes

### 4. Email Service

- [ ] Configure SMTP (cPanel)
- [ ] Create email templates
- [ ] Email verification flow
- [ ] Password reset flow
- [ ] Welcome email

### 5. User Profile

- [ ] User profile page (`app/account/page.tsx`)
- [ ] Update profile API
- [ ] Change password API
- [ ] Delete account API

---

## 🔧 Implementation Steps

### Step 1: Install Auth.js Dependencies

**Command:**
```bash
npm install next-auth@beta bcryptjs
npm install -D @types/bcryptjs
```

**Verify package.json:**
```json
{
  "dependencies": {
    "next-auth": "^5.0.0-beta.x",
    "bcryptjs": "^2.4.3"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.x"
  }
}
```

---

### Step 2: Create Auth.js Configuration

**File:** `lib/auth/config.ts`

```typescript
import { NextAuthConfig } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/lib/db';
import { compare } from 'bcryptjs';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const validated = loginSchema.safeParse(credentials);
        if (!validated.success) return null;

        const { email, password } = validated.data;

        // Find user
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        });

        if (!user || !user.passwordHash) return null;

        // Verify password
        const isValid = await compare(password, user.passwordHash);
        if (!isValid) return null;

        // Check email verified
        if (!user.emailVerifiedAt) {
          throw new Error('EMAIL_NOT_VERIFIED');
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
    verifyRequest: '/verify-email',
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, isNewUser }) {
      if (isNewUser) {
        // Send welcome email
        await sendWelcomeEmail(user.email, user.name);
      }
    },
  },
} satisfies NextAuthConfig;
```

**File:** `lib/auth/index.ts`

```typescript
import NextAuth from 'next-auth';
import { authConfig } from './config';

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
```

---

### Step 3: Create Auth Route Handler

**File:** `app/api/auth/[...nextauth]/route.ts`

```typescript
import { handlers } from '@/lib/auth';

export const { GET, POST } = handlers;
```

**This enables:**
- `/api/auth/signin` - Sign in
- `/api/auth/signout` - Sign out
- `/api/auth/session` - Get session
- `/api/auth/csrf` - CSRF token
- `/api/auth/callback/*` - OAuth callbacks

---

### Step 4: Create Registration API

**File:** `app/api/auth/register/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { generateVerificationToken, sendVerificationEmail } from '@/lib/mail';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  name: z.string().min(2).max(100),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = registerSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { ok: false, error: 'Invalid input', details: validated.error.issues },
        { status: 400 }
      );
    }

    const { email, password, name } = validated.data;
    const emailLower = email.toLowerCase();

    // Check if user exists
    const existing = await prisma.user.findUnique({
      where: { email: emailLower },
    });

    if (existing) {
      return NextResponse.json(
        { ok: false, error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: emailLower,
        passwordHash,
        name,
        role: 'customer',
      },
    });

    // Generate verification token
    const token = await generateVerificationToken(emailLower);

    // Send verification email
    await sendVerificationEmail(emailLower, name, token);

    return NextResponse.json({
      ok: true,
      data: {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { ok: false, error: 'Registration failed' },
      { status: 500 }
    );
  }
}
```

---

### Step 5: Create Email Verification System

**File:** `lib/mail/index.ts`

```typescript
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Generate verification token
 */
export async function generateVerificationToken(email: string): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  return token;
}

/**
 * Send verification email
 */
export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string
) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Verify your email - AGY Flow',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Verify Your Email</h1>
        <p>Hi ${name},</p>
        <p>Thank you for registering with AGY Flow. Please verify your email address by clicking the button below:</p>
        <p style="margin: 30px 0;">
          <a href="${verifyUrl}" 
             style="background: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Verify Email
          </a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #666; font-size: 14px;">${verifyUrl}</p>
        <p style="color: #999; font-size: 12px; margin-top: 40px;">
          This link will expire in 30 minutes. If you didn't create an account, please ignore this email.
        </p>
      </div>
    `,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  name: string,
  token: string
) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Reset your password - AGY Flow',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Reset Your Password</h1>
        <p>Hi ${name},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <p style="margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Reset Password
          </a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #666; font-size: 14px;">${resetUrl}</p>
        <p style="color: #999; font-size: 12px; margin-top: 40px;">
          This link will expire in 30 minutes. If you didn't request a password reset, please ignore this email.
        </p>
      </div>
    `,
  });
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(email: string, name: string | null) {
  await transporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Welcome to AGY Flow',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Welcome to AGY Flow!</h1>
        <p>Hi ${name || 'there'},</p>
        <p>Your account is now active. You can start exploring our products and services.</p>
        <p style="margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/account" 
             style="background: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Go to Dashboard
          </a>
        </p>
        <p>If you have any questions, feel free to reply to this email.</p>
        <p>Best regards,<br>The AGY Flow Team</p>
      </div>
    `,
  });
}
```

---

### Step 6: Create Verify Email API

**File:** `app/api/auth/verify-email/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const verifySchema = z.object({
  token: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = verifySchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { ok: false, error: 'Invalid token' },
        { status: 400 }
      );
    }

    const { token } = validated.data;

    // Find token
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token,
        expires: { gt: new Date() },
      },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { ok: false, error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    // Update user
    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerifiedAt: new Date() },
    });

    // Delete token
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: verificationToken.identifier,
          token,
        },
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { ok: false, error: 'Verification failed' },
      { status: 500 }
    );
  }
}
```

---

### Step 7: Create Middleware for Route Protection

**File:** `middleware.ts` (root level)

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const session = request.auth;

  // Protected routes requiring login
  if (pathname.startsWith('/account')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Admin-only routes
  if (pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (session.user?.role !== 'admin') {
      return NextResponse.redirect(new URL('/account', request.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/account/:path*',
    '/admin/:path*',
    // Exclude static files and API routes
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

---

### Step 8: Create Auth Helper Functions

**File:** `lib/auth/guards.ts`

```typescript
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

/**
 * Require authenticated user (for Server Components)
 */
export async function requireUser() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login');
  }

  return session.user;
}

/**
 * Require admin role (for Server Components)
 */
export async function requireAdmin() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login');
  }

  if (session.user.role !== 'admin') {
    redirect('/account');
  }

  return session.user;
}

/**
 * Get optional user (for Server Components)
 */
export async function getUser() {
  const session = await auth();
  return session?.user || null;
}

/**
 * Require authenticated user (for API Routes)
 */
export async function requireUserAPI(request: Request) {
  const session = await auth();
  
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  return session.user;
}

/**
 * Require admin role (for API Routes)
 */
export async function requireAdminAPI(request: Request) {
  const session = await auth();
  
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  if (session.user.role !== 'admin') {
    throw new Error('Forbidden');
  }

  return session.user;
}
```

---

### Step 9: Create Authentication Pages

**File:** `app/login/page.tsx`

```typescript
import { Metadata } from 'next';
import { LoginForm } from './LoginForm';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Login - AGY Flow',
  description: 'Sign in to your account',
};

export default async function LoginPage() {
  const session = await auth();
  
  // Redirect if already logged in
  if (session?.user) {
    redirect('/account');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Sign in to AGY Flow</h1>
          <p className="mt-2 text-gray-600">
            Or{' '}
            <a href="/register" className="text-blue-600 hover:underline">
              create a new account
            </a>
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
```

**File:** `app/login/LoginForm.tsx`

```typescript
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === 'EMAIL_NOT_VERIFIED') {
          setError('Please verify your email before logging in.');
        } else {
          setError('Invalid email or password');
        }
      } else {
        router.push('/account');
        router.refresh();
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex items-center justify-between">
        <a href="/reset-password" className="text-sm text-blue-600 hover:underline">
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}
```

**File:** `app/register/page.tsx`

```typescript
import { Metadata } from 'next';
import { RegisterForm } from './RegisterForm';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Register - AGY Flow',
  description: 'Create your account',
};

export default async function RegisterPage() {
  const session = await auth();
  
  if (session?.user) {
    redirect('/account');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create your account</h1>
          <p className="mt-2 text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Sign in
            </a>
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
```

**File:** `app/register/RegisterForm.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!data.ok) {
        setError(data.error || 'Registration failed');
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
        <h3 className="font-semibold mb-2">Registration successful!</h3>
        <p>Please check your email to verify your account.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full name
        </label>
        <input
          id="name"
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <input
          id="email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">Minimum 8 characters</p>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm password
        </label>
        <input
          id="confirmPassword"
          type="password"
          required
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {loading ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  );
}
```

---

### Step 10: Create User Account Page

**File:** `app/account/page.tsx`

```typescript
import { Metadata } from 'next';
import { requireUser } from '@/lib/auth/guards';
import { prisma } from '@/lib/db';

export const metadata: Metadata = {
  title: 'My Account - AGY Flow',
};

export default async function AccountPage() {
  const user = await requireUser();
  
  // Get user details
  const userDetails = await prisma.user.findUnique({
    where: { id: BigInt(user.id) },
    select: {
      name: true,
      email: true,
      createdAt: true,
      role: true,
    },
  });

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{userDetails?.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{userDetails?.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Member since</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {userDetails?.createdAt.toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </div>

        <div className="border-t pt-6">
          <a
            href="/account/orders"
            className="text-blue-600 hover:underline"
          >
            View my orders →
          </a>
        </div>

        <div className="border-t pt-6">
          <a
            href="/account/downloads"
            className="text-blue-600 hover:underline"
          >
            My downloads →
          </a>
        </div>
      </div>
    </div>
  );
}
```

---

## 🧪 Verification Steps

### 1. Auth.js Configuration
```bash
# Test auth route exists
curl http://localhost:3000/api/auth/csrf
# Should return CSRF token
```

### 2. Registration Flow
```bash
# Test registration API
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Should return success + send verification email
```

### 3. Email Verification
- Check email inbox for verification link
- Click link → should verify user
- Try login → should succeed

### 4. Login Flow
- Visit `/login`
- Enter email/password
- Should redirect to `/account`

### 5. Protected Routes
```bash
# Without login
curl http://localhost:3000/account
# Should redirect to /login

# After login
curl http://localhost:3000/account \
  -H "Cookie: next-auth.session-token=..."
# Should show account page
```

### 6. Admin Access
```bash
# Update user role to admin
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';

# Access admin
curl http://localhost:3000/admin
# Should allow access (not redirect)
```

---

## ⚠️ Security Considerations

### Password Security
- ✅ bcrypt with cost 12 (secure)
- ✅ Minimum 8 characters enforced
- ✅ Password not exposed in API responses

### Session Security
- ✅ Database sessions (can be revoked)
- ✅ 30-day max age
- ✅ HttpOnly cookies
- ✅ Secure flag in production

### Email Verification
- ✅ Required before login
- ✅ 30-minute token expiry
- ✅ Single-use tokens

### Rate Limiting
**To be implemented in FASE 6:**
- Login attempts: 5/minute per IP
- Registration: 3/hour per IP
- Password reset: 3/hour per email

---

## 📊 Progress Tracking

| Step | Status | Owner | Notes |
|------|--------|-------|-------|
| Install dependencies | ⏳ Ready | Dev | |
| Auth.js config | ⏳ Ready | Dev | |
| Auth route handler | ⏳ Ready | Dev | |
| Registration API | ⏳ Ready | Dev | |
| Email service | ⏳ Pending | Dev | Need SMTP credentials |
| Verify email API | ⏳ Ready | Dev | |
| Middleware guards | ⏳ Ready | Dev | |
| Auth helpers | ⏳ Ready | Dev | |
| Login page | ⏳ Ready | Frontend | |
| Register page | ⏳ Ready | Frontend | |
| Account page | ⏳ Ready | Frontend | |
| Test flows | ⏳ Pending | QA | After implementation |

---

## ✅ Definition of Done

FASE 2 is complete when:

- [ ] Auth.js v5 configured with MySQL adapter
- [ ] Registration flow working (email verification required)
- [ ] Login flow working (credentials provider)
- [ ] Email verification working (SMTP + token validation)
- [ ] Password reset flow working
- [ ] Middleware protecting `/account` and `/admin` routes
- [ ] Helper functions (`requireUser`, `requireAdmin`) working
- [ ] User account page displaying profile
- [ ] All flows tested manually
- [ ] Security checklist passed

**Next Phase:** FASE 3 - Order Database + Webhooks

---

**Document Version:** 1.0  
**Created:** 2026-09-20  
**Status:** 📝 Ready for execution (after FASE 0 & 1)
