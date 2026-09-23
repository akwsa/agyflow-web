# OpenAI Codex Integration Guide
## Strategic Usage with 5-Hour Limit

**Created:** 2026-09-21  
**Model:** GPT-5.6 Codex, GPT-5.3 Codex  
**Provider:** OpenAI  
**Limit:** 5-hour rolling window  
**Strategy:** CRITICAL TASKS ONLY 🎯

---

## ⚠️ **IMPORTANT: 5-Hour Limit**

```yaml
Constraint:
  Type: Rolling 5-hour window
  Tasks: 10-60 per window (depends on plan)
  Cost: $0.04 per credit (bundled in subscription)
  Reset: Continuous rolling (not fixed schedule)

Plans:
  Plus: $20/mo (10-60 tasks per 5h)
  Pro 5x: $100/mo (5× Plus limits)
  Pro 20x: $200/mo (20× Plus limits)

Strategy: Use SPARINGLY for critical code only!
```

---

## 🎯 **Usage Strategy for AGY Flow**

### **Use Codex ONLY For:**

```yaml
Critical Security (auth_agent):
  - Authentication token generation
  - Password hashing logic
  - Session management
  - Email verification security
  - CSRF protection
  - Auth middleware logic

Critical Money (payment_agent):
  - Webhook signature verification
  - Payment amount calculation
  - Idempotency handling
  - Refund logic
  - Order validation
  - Entitlement rules

Critical Audit (qa_agent):
  - Security vulnerability scan
  - Authentication flow review
  - Payment logic verification
  - SQL injection check
  - XSS prevention review
  - Final security audit
```

### **DON'T Use Codex For:**

```yaml
Simple Tasks (use Agnes 3.0 Flash FREE instead):
  ❌ UI components (buttons, forms, layouts)
  ❌ Basic CRUD operations
  ❌ Config files (.env, next.config)
  ❌ Simple routing
  ❌ CSS/Tailwind styling
  ❌ Basic API endpoints
  ❌ Type definitions
  ❌ Simple validation
```

---

## 🔧 **Integration in 9router**

### **Agent Configuration**

```yaml
# auth_agent - Use Codex for security
auth_agent:
  model:
    primary: "openai_codex/gpt-5.6-codex"  # CRITICAL
    fallback: "agnes_ai/agnes-3.0-flash"   # If limit hit
  
  tasks_using_codex:
    - "Auth.js configuration"
    - "Password hashing (bcrypt)"
    - "JWT token generation"
    - "Session middleware"
    - "Email verification tokens"
  
  tasks_using_agnes:
    - "Login/Register UI"
    - "Email templates"
    - "Form validation"
    - "Route protection boilerplate"

# payment_agent - Use Codex for money logic
payment_agent:
  model:
    primary: "openai_codex/gpt-5.6-codex"  # CRITICAL
    fallback: "agnes_ai/agnes-3.0-flash"
  
  tasks_using_codex:
    - "Webhook signature verification"
    - "HMAC-SHA256 validation"
    - "Idempotency key handling"
    - "Payment amount calculations"
    - "Entitlement logic"
  
  tasks_using_agnes:
    - "Order listing UI"
    - "Email notifications"
    - "Order status display"
    - "Simple CRUD operations"

# qa_agent - Use Codex for final security audit
qa_agent:
  phases:
    - name: "Test Generation"
      model: "agnes_ai/agnes-3.0-flash"
      
    - name: "Security Audit"
      model: "openai_codex/gpt-5.6-codex"  # Use here!
      
    - name: "Verification"
      model: "atria_asi/atria-dawn-preview"
```

---

## 📊 **5-Hour Window Management**

### **Estimated Usage (AGY Flow Build)**

```yaml
auth_agent (Day 5-10):
  Codex tasks: 3-4
  Duration: ~30-40 minutes
  Fallback: Agnes handles 80% of work

payment_agent (Day 5-10):
  Codex tasks: 4-5
  Duration: ~40-50 minutes
  Fallback: Agnes handles 75% of work

qa_agent (Day 14-16):
  Codex tasks: 2-3
  Duration: ~20-30 minutes
  Fallback: Agnes handles test generation

Total Codex usage: 9-12 tasks (~1.5-2 hours)
Well within 5-hour limit! ✅
```

### **What If Limit Is Hit?**

```yaml
Automatic fallback:
  1. 9router detects Codex limit exceeded
  2. Switches to Agnes 3.0 Flash (FREE)
  3. Continues work without interruption
  4. Marks as "used fallback model"
  5. Retries with Codex after window resets

Result: Zero downtime! 🎯
```

---

## 💻 **Code Examples**

### **Direct Codex Usage (Runtime)**

```typescript
/**
 * lib/ai/codex.ts
 * Use Codex for critical security decisions at runtime
 */

interface CodexOptions {
  model?: 'gpt-5.6-codex' | 'gpt-5.3-codex';
  temperature?: number;
  max_tokens?: number;
}

export async function generateWithCodex(
  prompt: string,
  options: CodexOptions = {}
) {
  const {
    model = 'gpt-5.6-codex',
    temperature = 0.1,
    max_tokens = 4096,
  } = options;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CODEX_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature,
        max_tokens,
      }),
    });

    if (!response.ok) {
      // Check if 5-hour limit hit
      if (response.status === 429) {
        console.warn('Codex 5-hour limit hit, falling back to Agnes');
        // Fallback to Agnes
        return await generateWithAgnes(prompt, { temperature, max_tokens });
      }
      throw new Error(`Codex error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Codex failed, falling back to Agnes:', error);
    return await generateWithAgnes(prompt, { temperature, max_tokens });
  }
}

/**
 * Example: Verify webhook signature (CRITICAL - use Codex)
 */
export async function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const prompt = `
Generate secure HMAC-SHA256 verification code for webhook signature.

Requirements:
- Compare computed HMAC with provided signature
- Use constant-time comparison (prevent timing attacks)
- Handle edge cases (empty payload, invalid signature format)
- Return boolean result

Payload: ${payload}
Signature: ${signature}
Secret: ${secret}

Generate production-ready TypeScript code.
`;

  const code = await generateWithCodex(prompt, {
    model: 'gpt-5.6-codex',
    temperature: 0.05, // Very conservative for security
  });

  // Execute generated code (in sandbox)
  return executeSandboxed(code);
}
```

### **Fallback Strategy**

```typescript
/**
 * lib/ai/smart-router.ts
 * Automatically routes to best available model
 */

interface ModelOptions {
  temperature?: number;
  max_tokens?: number;
  priority?: 'critical' | 'high' | 'normal';
}

export async function generateWithBestModel(
  prompt: string,
  options: ModelOptions = {}
) {
  const { priority = 'normal', ...restOptions } = options;

  // Critical tasks: Try Codex first
  if (priority === 'critical') {
    try {
      return await generateWithCodex(prompt, restOptions);
    } catch (error) {
      console.warn('Codex unavailable, using Agnes');
      return await generateWithAgnes(prompt, restOptions);
    }
  }

  // High priority: Try Agnes first (FREE)
  if (priority === 'high') {
    return await generateWithAgnes(prompt, restOptions);
  }

  // Normal: Use Gemini Flash (fastest)
  return await generateWithGemini(prompt, {
    model: 'gemini-1.5-flash',
    ...restOptions,
  });
}

/**
 * Usage examples
 */

// Critical security code - use Codex
const authCode = await generateWithBestModel(
  'Generate secure JWT token validation',
  { priority: 'critical' }
);

// Important but not critical - use Agnes (FREE)
const apiCode = await generateWithBestModel(
  'Generate API endpoint for user profile',
  { priority: 'high' }
);

// Simple UI - use Gemini Flash (FREE, fastest)
const uiCode = await generateWithBestModel(
  'Generate login form component',
  { priority: 'normal' }
);
```

---

## 📋 **Monitoring Codex Usage**

### **Track 5-Hour Window**

```typescript
/**
 * lib/ai/codex-monitor.ts
 * Monitor Codex usage and 5-hour limit
 */

interface CodexUsage {
  tasks_used: number;
  window_start: Date;
  window_end: Date;
  tasks_remaining: number;
}

class CodexMonitor {
  private usageLog: Array<{ timestamp: Date; task: string }> = [];

  logTask(task: string) {
    this.usageLog.push({
      timestamp: new Date(),
      task,
    });
  }

  getUsageInWindow(): CodexUsage {
    const now = new Date();
    const fiveHoursAgo = new Date(now.getTime() - 5 * 60 * 60 * 1000);

    // Filter tasks in current 5-hour window
    const tasksInWindow = this.usageLog.filter(
      (log) => log.timestamp > fiveHoursAgo
    );

    return {
      tasks_used: tasksInWindow.length,
      window_start: fiveHoursAgo,
      window_end: now,
      tasks_remaining: 60 - tasksInWindow.length, // Assuming Plus plan
    };
  }

  shouldUseCodex(): boolean {
    const usage = this.getUsageInWindow();
    
    // Leave buffer of 10 tasks
    if (usage.tasks_remaining < 10) {
      console.warn('Codex usage near limit, using fallback');
      return false;
    }
    
    return true;
  }
}

export const codexMonitor = new CodexMonitor();

/**
 * Usage in 9router
 */
export async function smartGenerate(prompt: string, priority: string) {
  if (priority === 'critical' && codexMonitor.shouldUseCodex()) {
    codexMonitor.logTask(prompt);
    return await generateWithCodex(prompt);
  }
  
  // Fallback to Agnes
  return await generateWithAgnes(prompt);
}
```

---

## 💰 **Cost Analysis**

### **Codex Pricing**

```yaml
Plans:
  ChatGPT Plus:
    Cost: $20/month
    Codex included: Yes
    Tasks per 5h: 10-60
    Credit cost: $0.04 each
    Total credits: $10-40/month included
  
  ChatGPT Pro 5x:
    Cost: $100/month
    Codex included: Yes
    Tasks per 5h: 5× Plus
    Better for: Heavy usage
  
  ChatGPT Pro 20x:
    Cost: $200/month
    Codex included: Yes
    Tasks per 5h: 20× Plus
    Better for: Enterprise
```

### **AGY Flow Usage Estimate**

```yaml
Total Codex tasks: 9-12
Estimated cost: $0.36-0.48 (within Plus plan ✅)
Required plan: ChatGPT Plus ($20/mo minimum)

Cost breakdown:
  - auth_agent: 3-4 tasks ($0.12-0.16)
  - payment_agent: 4-5 tasks ($0.16-0.20)
  - qa_agent: 2-3 tasks ($0.08-0.12)

Monthly cost if using Plus subscription: $20
(Includes ChatGPT + Codex + other features)

Alternative: Skip Codex, use Agnes 3.0 (FREE)
Trade-off: Slightly lower quality for critical security code
```

---

## ✅ **Recommendation**

### **For AGY Flow Project:**

```yaml
Recommended: Use Codex selectively

Pros:
  ✅ Best-in-class for security logic
  ✅ Excellent for payment verification
  ✅ Worth it for critical code
  ✅ Only 9-12 tasks (well within limit)
  ✅ Automatic fallback to Agnes if limit hit

Cons:
  ⚠️ Requires ChatGPT Plus ($20/mo minimum)
  ⚠️ 5-hour window constraint
  ⚠️ Need to monitor usage

Cost-Benefit:
  Investment: $20/mo (Plus plan)
  Usage: ~$0.40 for this build
  Value: Peace of mind for security-critical code
  Alternative: Use Agnes 3.0 (FREE, almost as good)

Decision: If you have ChatGPT Plus, use it!
          If not, Agnes 3.0 is excellent too.
```

---

## 🚀 **Setup Instructions**

### **Step 1: Get Codex Access**

```bash
# Option 1: Already have ChatGPT Plus?
# Just get API key: https://platform.openai.com/api-keys

# Option 2: Don't have Plus?
# Sign up: https://chatgpt.com/
# Upgrade to Plus ($20/mo)
# Then get API key

# Option 3: Skip Codex
# Use Agnes 3.0 Flash (FREE) for everything
# Still production-ready!
```

### **Step 2: Configure**

```bash
# Add to .env.9router
CODEX_API_KEY=sk-proj-...

# Verify
9router validate

# Should show:
# ✅ openai_codex/gpt-5.6-codex: OK
```

### **Step 3: Monitor Usage**

```bash
# Check usage during build
9router status --model-usage

# Should show:
# Codex tasks: 3/60 (within limit) ✅
```

---

## 📊 **Summary**

```yaml
Codex for AGY Flow:
  Usage: CRITICAL TASKS ONLY
  Tasks: 9-12 total (auth, payment, security audit)
  Time: ~1.5-2 hours (within 5h limit)
  Cost: $0.40 (included in Plus $20/mo)
  Fallback: Agnes 3.0 Flash (FREE, automatic)
  
Strategy: Selective Premium
  - Use Codex for security-critical code
  - Use Agnes (FREE) for everything else
  - Best of both worlds!

Result: Production-ready code at minimal cost
```

---

**Ready to add Codex to your build?** Just add the API key and 9router handles the rest! 🚀