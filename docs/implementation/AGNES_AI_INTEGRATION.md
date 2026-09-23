# Agnes AI Integration Guide
## Singapore's #1 Ranked Model for Coding Agents

**Created:** 2026-09-20  
**Model Version:** Agnes 3.0 Flash + Agnes 2.5 Pro  
**Provider:** Sapiens AI (Singapore)  
**Purpose:** Primary AI model for AGY Flow transformation

---

## 🚀 **Why Agnes 3.0 Flash?**

### **Performance Metrics**

| Metric | Value | Ranking |
|--------|-------|---------|
| **Intelligence Index** | 36/100 | #1 of 61 in class ⭐⭐⭐⭐⭐ |
| **Output Speed** | 252 tokens/second | #5 of 61 (ultra-fast) |
| **Context Window** | 512K tokens | Top-tier |
| **Max Output** | 65,536 tokens | Excellent |
| **Pricing** | Currently $0 (FREE) | Best value |
| **List Price** | $0.05 input / $0.15 output | Competitive |

### **Key Strengths for AGY Flow Project**

✅ **Purpose-built for coding agents** - Not a general chatbot  
✅ **Trustworthy execution** - Reduces incorrect completion claims  
✅ **Strong instruction adherence** - Critical for auth/payment logic  
✅ **Tool orchestration** - Native function calling & multi-step tools  
✅ **Thinking mode** - Deliberate reasoning for complex tasks  
✅ **Long context** - 512K can handle entire codebase  
✅ **Image support** - Can read screenshots, diagrams, UI mockups  

---

## 📋 **Agnes Models Overview**

### **Agnes 3.0 Flash** (Primary)

```yaml
model_name: "agnes-3.0-flash"
context_window: 512000
max_output: 65536
speed: 252_tokens_per_second
intelligence_rank: "1/61"
current_price: $0  # FREE
list_price:
  input: 0.05    # per 1M tokens
  output: 0.15   # per 1M tokens
  cached: 0.005  # per 1M tokens
best_for:
  - "Infrastructure & database schema"
  - "Authentication & security logic"
  - "Payment & webhook handlers"
  - "Testing & bug detection"
  - "Complex multi-step tasks"
```

### **Agnes 2.5 Pro** (Secondary)

```yaml
model_name: "agnes-2.5-pro"
context_window: 1000000  # 1M tokens!
max_output: 32768
speed: "fast"
current_price: $0  # FREE
best_for:
  - "Very long context tasks"
  - "File management (need to see many files)"
  - "Code verification & review"
  - "Documentation generation"
```

### **Agnes 2.5 Flash** (Backup)

```yaml
model_name: "agnes-2.5-flash"
context_window: 1000000
max_output: 32768
speed: "very_fast"
current_price: $0  # FREE
best_for:
  - "Quick responses"
  - "Simple code generation"
  - "UI/frontend work"
```

---

## 🔧 **Setup Instructions**

### **Step 1: Create Agnes AI Account**

```bash
# Visit Agnes AI platform
https://platform.agnes-ai.com/subscribe/subscription

# Sign up with email
# Choose plan: Free tier (currently all models are free)
```

### **Step 2: Get API Key**

```bash
# After login:
1. Go to Dashboard
2. Navigate to API Keys section
3. Click "Create New Key"
4. Copy the key (format: sk-agnes-...)
5. Store securely
```

### **Step 3: Configure Environment**

```bash
# Add to .env.local
AGNES_API_KEY=REDACTED_SECRET_SEE_ENV

# Add to .env.9router (for 9router orchestration)
AGNES_API_KEY=REDACTED_SECRET_SEE_ENV
```

### **Step 4: Test Connection**

```bash
# Test Agnes API connectivity
curl https://apihub.agnes-ai.com/v1/chat/completions \
  -H "Authorization: Bearer $AGNES_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "agnes-3.0-flash",
    "messages": [{"role": "user", "content": "Hello Agnes!"}],
    "max_tokens": 100
  }'

# Expected: JSON response with generated text
```

---

## 💻 **Integration in AGY Flow**

### **1. Direct API Integration (Runtime)**

Create `lib/ai/agnes.ts`:

```typescript
/**
 * Agnes AI integration for AGY Flow
 * Use for runtime AI features (not build-time via 9router)
 */

interface AgnesMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AgnesOptions {
  model?: 'agnes-3.0-flash' | 'agnes-2.5-pro' | 'agnes-2.5-flash';
  temperature?: number;
  max_tokens?: number;
  thinking_mode?: boolean;
  tools?: any[];
}

export async function generateWithAgnes(
  messages: AgnesMessage[],
  options: AgnesOptions = {}
) {
  const {
    model = 'agnes-3.0-flash',
    temperature = 0.7,
    max_tokens = 8192,
    thinking_mode = false,
    tools,
  } = options;

  const body: any = {
    model,
    messages,
    temperature,
    max_tokens,
  };

  // Enable thinking mode for complex tasks
  if (thinking_mode) {
    body.chat_template_kwargs = {
      enable_thinking: true,
    };
  }

  // Add tools for function calling
  if (tools) {
    body.tools = tools;
  }

  const response = await fetch(
    'https://apihub.agnes-ai.com/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.AGNES_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    throw new Error(`Agnes API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Generate product description with Agnes
 */
export async function generateProductDescription(
  productName: string,
  features: string[]
) {
  const messages: AgnesMessage[] = [
    {
      role: 'system',
      content: 'You are a product marketing expert. Write compelling, clear product descriptions.',
    },
    {
      role: 'user',
      content: `Generate a product description for: ${productName}\n\nKey features:\n${features.join('\n- ')}`,
    },
  ];

  return await generateWithAgnes(messages, {
    model: 'agnes-3.0-flash',
    temperature: 0.8,
    max_tokens: 500,
  });
}

/**
 * Generate code with thinking mode
 */
export async function generateCodeWithReasoning(
  task: string,
  context: string
) {
  const messages: AgnesMessage[] = [
    {
      role: 'system',
      content: 'You are an expert TypeScript/Next.js developer. Write production-ready code.',
    },
    {
      role: 'user',
      content: `Task: ${task}\n\nContext:\n${context}`,
    },
  ];

  return await generateWithAgnes(messages, {
    model: 'agnes-3.0-flash',
    temperature: 0.1,
    thinking_mode: true,  // Enable deliberate reasoning
    max_tokens: 8192,
  });
}

/**
 * Customer support with long context
 */
export async function generateSupportResponse(
  question: string,
  conversationHistory: AgnesMessage[],
  knowledgeBase: string
) {
  const messages: AgnesMessage[] = [
    {
      role: 'system',
      content: `You are AGY Flow customer support. Be helpful and professional.\n\nKnowledge base:\n${knowledgeBase}`,
    },
    ...conversationHistory,
    {
      role: 'user',
      content: question,
    },
  ];

  return await generateWithAgnes(messages, {
    model: 'agnes-2.5-pro',  // Use 1M context for long history
    temperature: 0.3,
    max_tokens: 1024,
  });
}

/**
 * Tool calling example
 */
export async function callToolsWithAgnes(
  task: string,
  availableTools: any[]
) {
  const messages: AgnesMessage[] = [
    {
      role: 'user',
      content: task,
    },
  ];

  return await generateWithAgnes(messages, {
    model: 'agnes-3.0-flash',
    temperature: 0.2,
    tools: availableTools,
  });
}
```

### **2. API Routes Examples**

#### **Generate Product Description**

Create `app/api/ai/product-description/route.ts`:

```typescript
import { generateProductDescription } from '@/lib/ai/agnes';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { productName, features } = await request.json();

    if (!productName || !features) {
      return NextResponse.json(
        { error: 'Missing productName or features' },
        { status: 400 }
      );
    }

    const description = await generateProductDescription(
      productName,
      features
    );

    return NextResponse.json({ description });
  } catch (error) {
    console.error('Agnes API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate description' },
      { status: 500 }
    );
  }
}
```

#### **Customer Support Chat**

Create `app/api/ai/support/route.ts`:

```typescript
import { generateSupportResponse } from '@/lib/ai/agnes';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { question, history, knowledgeBase } = await request.json();

    const response = await generateSupportResponse(
      question,
      history || [],
      knowledgeBase || ''
    );

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Agnes support error:', error);
    return NextResponse.json(
      { error: 'Failed to generate support response' },
      { status: 500 }
    );
  }
}
```

### **3. Admin Dashboard Integration**

Add AI features to admin dashboard:

```typescript
// app/admin/products/new/page.tsx
'use client';

import { useState } from 'react';

export default function NewProductPage() {
  const [generating, setGenerating] = useState(false);
  const [description, setDescription] = useState('');

  async function generateDescription() {
    setGenerating(true);
    try {
      const response = await fetch('/api/ai/product-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: productName,
          features: features.split('\n'),
        }),
      });

      const data = await response.json();
      setDescription(data.description);
    } catch (error) {
      console.error('Failed to generate:', error);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div>
      <h1>Create New Product</h1>
      
      {/* Product form */}
      <input type="text" placeholder="Product name" />
      <textarea placeholder="Features (one per line)" />
      
      <button onClick={generateDescription} disabled={generating}>
        {generating ? 'Generating with Agnes...' : 'Generate Description'}
      </button>
      
      {description && (
        <div>
          <h3>Generated Description:</h3>
          <p>{description}</p>
        </div>
      )}
    </div>
  );
}
```

---

## 🔥 **Advanced Features**

### **1. Thinking Mode**

Use for complex logic that needs reasoning:

```typescript
import { generateCodeWithReasoning } from '@/lib/ai/agnes';

const code = await generateCodeWithReasoning(
  'Implement webhook signature verification for Lemon Squeezy',
  `
  We need to:
  1. Verify HMAC-SHA256 signature
  2. Handle replay attacks
  3. Ensure idempotency
  4. Log failed attempts
  `
);
```

Agnes will:
- Show internal reasoning (if you parse thinking tags)
- Break down the problem
- Consider edge cases
- Produce more robust code

### **2. Tool Calling (Function Calling)**

```typescript
const tools = [
  {
    type: 'function',
    function: {
      name: 'get_user_orders',
      description: 'Get all orders for a user by email',
      parameters: {
        type: 'object',
        properties: {
          email: { type: 'string' },
        },
        required: ['email'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'cancel_order',
      description: 'Cancel an order by ID',
      parameters: {
        type: 'object',
        properties: {
          orderId: { type: 'string' },
        },
        required: ['orderId'],
      },
    },
  },
];

const response = await callToolsWithAgnes(
  'Cancel all orders for user@example.com',
  tools
);

// Agnes will return tool calls, not direct text
// You execute the functions, then continue conversation
```

### **3. Image Analysis**

Agnes 3.0 supports image URLs:

```typescript
const messages = [
  {
    role: 'user',
    content: [
      { type: 'text', text: 'Analyze this UI mockup and suggest improvements' },
      { type: 'image_url', image_url: { url: 'https://example.com/mockup.png' } },
    ],
  },
];

const analysis = await generateWithAgnes(messages, {
  model: 'agnes-3.0-flash',
});
```

### **4. Streaming Responses**

For real-time chat:

```typescript
export async function streamWithAgnes(
  messages: AgnesMessage[],
  options: AgnesOptions = {}
) {
  const response = await fetch(
    'https://apihub.agnes-ai.com/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.AGNES_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...options,
        model: options.model || 'agnes-3.0-flash',
        messages,
        stream: true,  // Enable streaming
      }),
    }
  );

  return response.body;  // ReadableStream
}
```

---

## 📊 **Cost Management**

### **Current Pricing (FREE)**

```bash
# All Agnes models are currently FREE
Input: $0 per 1M tokens
Output: $0 per 1M tokens
Cached: $0 per 1M tokens

# Estimated for AGY Flow build:
Total tokens: ~430K
Current cost: $0 ✅
```

### **Future Pricing (When Billing Starts)**

```bash
# Agnes 3.0 Flash
Input: $0.05 per 1M tokens
Output: $0.15 per 1M tokens
Cached: $0.005 per 1M tokens

# Example: 430K tokens build
Input tokens: 300K × $0.05 = $0.015
Output tokens: 130K × $0.15 = $0.0195
Total: ~$0.035 (3.5 cents!) 🎉

# Still 97% cheaper than Claude Opus
```

### **Usage Monitoring**

```typescript
// Track token usage
interface UsageStats {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

function calculateCost(usage: UsageStats) {
  const inputCost = (usage.prompt_tokens / 1_000_000) * 0.05;
  const outputCost = (usage.completion_tokens / 1_000_000) * 0.15;
  return inputCost + outputCost;
}
```

---

## ⚡ **Best Practices**

### **When to Use Agnes 3.0 Flash**

✅ **DO USE for:**
- Database schema design
- Authentication & security logic
- Payment webhook handlers
- Complex business logic
- Multi-step code generation
- Bug detection & testing
- Tool orchestration

❌ **DON'T USE for:**
- Simple string formatting (use native JS)
- Basic CRUD operations (use templates)
- Real-time chat UI (use Gemini Flash - faster)

### **Temperature Guidelines**

```yaml
Critical logic (auth, payments): 0.05 - 0.1
Standard code generation: 0.1 - 0.2
Tool calling & planning: 0.2 - 0.3
Creative content: 0.7 - 0.9
```

### **Context Optimization**

```typescript
// GOOD: Include relevant context
const messages = [
  {
    role: 'system',
    content: `You are generating code for a Next.js 14 App Router project.
    
    Tech stack:
    - TypeScript
    - Prisma with MySQL
    - Auth.js v5
    - Tailwind CSS
    
    Code style:
    - Use async/await
    - Handle errors properly
    - Add TypeScript types
    - Follow project conventions`,
  },
  { role: 'user', content: 'Create a protected API route for user orders' },
];

// BAD: Too generic
const messages = [
  { role: 'user', content: 'make order api' },
];
```

---

## 🎯 **Use Cases in AGY Flow**

### **Build-time (via 9router)**

1. **Infrastructure Agent** - Database schema with Agnes 3.0
2. **Auth Agent** - Security-critical auth code with Agnes 3.0
3. **Payment Agent** - Payment logic with Agnes 3.0 + thinking mode
4. **QA Agent** - Test generation with Agnes 3.0

### **Runtime (Direct Integration)**

1. **Product Descriptions** - Marketing copy with Agnes 3.0
2. **Customer Support** - Chat responses with Agnes 2.5 Pro (1M context)
3. **Content Generation** - Blog posts, emails with Agnes 2.5 Flash
4. **Image Analysis** - UI feedback with Agnes 3.0 + image input

---

## 🚨 **Error Handling**

```typescript
import { generateWithAgnes } from '@/lib/ai/agnes';

async function safeAgnesCall(messages: AgnesMessage[]) {
  try {
    return await generateWithAgnes(messages);
  } catch (error: any) {
    // Rate limit
    if (error.status === 429) {
      console.error('Agnes rate limit hit - wait and retry');
      await new Promise(resolve => setTimeout(resolve, 5000));
      return await generateWithAgnes(messages);
    }
    
    // Auth error
    if (error.status === 401) {
      console.error('Agnes API key invalid');
      throw new Error('Invalid Agnes API key');
    }
    
    // Model overload
    if (error.status === 503) {
      console.error('Agnes service unavailable - fallback to Gemini');
      // Use fallback model
      return await generateWithGemini(messages);
    }
    
    throw error;
  }
}
```

---

## 📚 **Resources**

- **Official Docs:** https://agnes-ai.com/en/docs
- **API Reference:** https://agnes-ai.com/en/docs/agnes-30-flash
- **Platform:** https://platform.agnes-ai.com
- **Artificial Analysis:** https://artificialanalysis.ai/models/agnes-30-flash

---

## ✅ **Summary**

```yaml
Primary Model: Agnes 3.0 Flash
Provider: Sapiens AI (Singapore)
Ranking: "#1 of 61 in intelligence"
Speed: 252 tokens/second
Context: 512K tokens
Cost: FREE (currently $0)
Best For: Coding agents, tool orchestration, complex logic

Integration:
  - Build-time: Via 9router for project transformation
  - Runtime: Direct API for dynamic features
  - Fallback: Gemini models if needed

Cost Savings: 97.5% vs Claude Opus
Quality: Top-tier production code
```

**Agnes 3.0 Flash is the perfect model for this project!** 🚀
