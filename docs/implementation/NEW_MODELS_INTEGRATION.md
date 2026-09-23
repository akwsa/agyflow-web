# New Models Integration Guide
## Atria ASI + CommandCode AI for AGY Flow

**Created:** 2026-09-20  
**Models:** Atria Dawn Preview + CommandCode Gateway (70+ models)  
**Status:** API Keys Configured ✅

---

## 🆕 **Newly Added Models**

### **1. Atria Dawn Preview (Research Agent)**
### **2. CommandCode AI Gateway (70+ Models)**

---

## 🔬 **Atria ASI: Research Agent Model**

### **Overview**

```yaml
Model: "atria-dawn-preview"
Provider: Atria ASI (InternLM team)
API: https://api.atria-asi.ai/v1
API Key: [REDACTED — see .env.9router] ✅
Context: 256K+ tokens
Pricing: TBD (check API docs)

Purpose:
  - Long horizon research tasks
  - Scientific workflow automation
  - Executable experiment generation
  - Reproducible results with verification
  - Problem decomposition & solution design
```

### **Key Strengths**

✅ **Long horizon tasks** - Carries work from concept to completion  
✅ **Verifiable execution** - Produces reproducible, inspectable results  
✅ **Environmental feedback** - Learns from execution results  
✅ **Full research loop** - Analysis → Design → Code → Execute → Analyze  
✅ **Failure recovery** - Handles errors and retries intelligently  
✅ **Scientific rigor** - Built for research-grade output  

### **Best Use Cases in AGY Flow**

```yaml
Recommended for:
  - Complex schema design with validation
  - Multi-step webhook logic verification
  - Payment flow testing & edge case analysis
  - Security audit planning & execution
  - Performance optimization research
  - Database migration planning

NOT recommended for:
  - Simple CRUD operations
  - Basic UI components
  - Quick fixes
```

### **Integration Example**

```typescript
/**
 * Atria ASI Integration
 * lib/ai/atria.ts
 */

interface AtriaOptions {
  temperature?: number;
  max_tokens?: number;
  research_mode?: boolean;
}

export async function generateWithAtria(
  task: string,
  context: string,
  options: AtriaOptions = {}
) {
  const {
    temperature = 0.1,
    max_tokens = 8192,
    research_mode = true,
  } = options;

  const response = await fetch('https://api.atria-asi.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.ATRIA_ASI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'atria-dawn-preview',
      messages: [
        {
          role: 'system',
          content: `You are a research agent. Break down complex problems, design solutions, implement code, and verify results.${
            research_mode
              ? '\n\nProvide:\n1. Problem analysis\n2. Solution design\n3. Implementation plan\n4. Verification strategy'
              : ''
          }`,
        },
        {
          role: 'user',
          content: `Task: ${task}\n\nContext:\n${context}`,
        },
      ],
      temperature,
      max_tokens,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Example: Complex webhook verification logic
 */
export async function designWebhookVerification() {
  const task = `Design a robust webhook verification system for Lemon Squeezy and Gumroad`;
  
  const context = `
Requirements:
- HMAC-SHA256 signature verification
- Replay attack prevention
- Idempotency handling
- Error logging with context
- Rate limiting
- Retry strategy for failed processing

Tech stack:
- Next.js 14 API routes
- Prisma + MySQL
- TypeScript
`;

  return await generateWithAtria(task, context, {
    temperature: 0.05,  // Very conservative for security
    research_mode: true,
  });
}

/**
 * Example: Database schema optimization
 */
export async function optimizeDatabaseSchema(currentSchema: string) {
  const task = `Analyze and optimize this Prisma schema for performance and scalability`;
  
  const context = `
Current schema:
${currentSchema}

Requirements:
- Support 10K+ concurrent users
- Fast order lookup (< 100ms)
- Efficient product search
- Minimize N+1 queries
- Consider indexes and relations
`;

  return await generateWithAtria(task, context, {
    temperature: 0.1,
    max_tokens: 16384,  // Need space for detailed analysis
  });
}
```

### **API Route Example**

```typescript
// app/api/research/webhook-design/route.ts
import { designWebhookVerification } from '@/lib/ai/atria';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const design = await designWebhookVerification();
    
    return NextResponse.json({
      design,
      model: 'atria-dawn-preview',
      type: 'research_output',
    });
  } catch (error) {
    console.error('Atria research error:', error);
    return NextResponse.json(
      { error: 'Research task failed' },
      { status: 500 }
    );
  }
}
```

---

## 🌐 **CommandCode AI: Multi-Model Gateway**

### **Overview**

```yaml
Provider: CommandCode AI
API: https://commandcode.ai/provider/v1
API Key: [REDACTED — see .env.9router] ✅
Models: 70+ (Claude, GPT, DeepSeek, Qwen, Kimi, GLM, MiniMax, etc.)
Pricing: $1/month Go plan with $10 credits + deal multipliers (~$40 effective)

Key Features:
  - Single API key for 70+ models
  - Taste-1: Learns your coding style
  - Tool call repairs (fixes model mistakes)
  - 99%+ cache hit rate
  - Best token efficiency in industry
```

### **Available Models**

#### **Top Coding Models via CommandCode**

| Model | Context | Speed | Best For |
|-------|---------|-------|----------|
| **DeepSeek V4 Pro** | 128K | Fast | Complex logic, algorithms |
| **Kimi K2.7 Code** | 1M | Fast | Long context, large refactors |
| **Qwen 3.7 Max** | 128K | Very Fast | General coding, quick tasks |
| **GLM-5.2** | 128K | Fast | Chinese + English projects |
| **Claude Opus 4** | 200K | Medium | Security, critical code |
| **GPT-5.6** | 128K | Fast | Quick prototyping |
| **MiniMax M3** | 128K | Fast | Balanced performance |

### **Key Advantages**

✅ **Single key access** - No need to manage 70+ API keys  
✅ **Cost effective** - $1/mo plan effectively worth ~$40  
✅ **Taste learning** - Adapts to your code style over time  
✅ **Tool repair** - Automatically fixes malformed tool calls  
✅ **High cache** - 99%+ hit rate saves tokens  
✅ **OpenAI compatible** - Drop-in replacement  

### **Integration Example**

```typescript
/**
 * CommandCode Integration
 * lib/ai/commandcode.ts
 */

type CommandCodeModel =
  | 'deepseek-v4-pro'
  | 'kimi-k2.7-code'
  | 'qwen-3.7-max'
  | 'glm-5.2'
  | 'claude-opus-4'
  | 'gpt-5.6';

interface CommandCodeOptions {
  model?: CommandCodeModel;
  temperature?: number;
  max_tokens?: number;
  tools?: any[];
  enable_taste?: boolean;  // Enable style learning
}

export async function generateWithCommandCode(
  messages: any[],
  options: CommandCodeOptions = {}
) {
  const {
    model = 'deepseek-v4-pro',
    temperature = 0.2,
    max_tokens = 8192,
    tools,
    enable_taste = true,
  } = options;

  const body: any = {
    model,
    messages,
    temperature,
    max_tokens,
  };

  if (tools) {
    body.tools = tools;
  }

  // Enable taste learning (CommandCode specific)
  if (enable_taste) {
    body.commandcode_options = {
      taste: {
        enabled: true,
        observe: true,  // Learn from this interaction
      },
    };
  }

  const response = await fetch(
    'https://commandcode.ai/provider/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.COMMANDCODE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    throw new Error(`CommandCode error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Example: Generate code with DeepSeek V4 Pro
 */
export async function generateCodeWithDeepSeek(
  task: string,
  existingCode?: string
) {
  const messages = [
    {
      role: 'system',
      content: `You are an expert TypeScript developer working on a Next.js 14 project.
      
Tech stack:
- Next.js 14 App Router
- TypeScript
- Prisma + MySQL
- Tailwind CSS

Code style:
- Use async/await
- Handle errors properly
- Add TypeScript types
- Follow existing patterns
${existingCode ? '\n\nExisting code for reference:\n' + existingCode : ''}`,
    },
    {
      role: 'user',
      content: task,
    },
  ];

  return await generateWithCommandCode(messages, {
    model: 'deepseek-v4-pro',
    temperature: 0.1,
    enable_taste: true,  // Learn our style
  });
}

/**
 * Example: Long context with Kimi K2.7
 */
export async function refactorWithKimi(
  files: Record<string, string>,
  instructions: string
) {
  // Kimi has 1M context - can handle many files
  const filesContext = Object.entries(files)
    .map(([path, content]) => `File: ${path}\n\`\`\`\n${content}\n\`\`\``)
    .join('\n\n');

  const messages = [
    {
      role: 'system',
      content: 'You are refactoring a large codebase. Maintain consistency across all files.',
    },
    {
      role: 'user',
      content: `${instructions}\n\nFiles:\n${filesContext}`,
    },
  ];

  return await generateWithCommandCode(messages, {
    model: 'kimi-k2.7-code',  // 1M context
    temperature: 0.15,
    max_tokens: 16384,
  });
}

/**
 * Example: Quick prototype with Qwen
 */
export async function quickPrototypeWithQwen(feature: string) {
  const messages = [
    {
      role: 'user',
      content: `Quickly prototype this feature: ${feature}`,
    },
  ];

  return await generateWithCommandCode(messages, {
    model: 'qwen-3.7-max',  // Very fast
    temperature: 0.3,
    max_tokens: 4096,
  });
}

/**
 * Model router - choose best model for task
 */
export async function smartGenerate(
  task: string,
  context: string,
  complexity: 'simple' | 'medium' | 'complex'
) {
  const modelMap = {
    simple: 'qwen-3.7-max',      // Fast
    medium: 'deepseek-v4-pro',   // Balanced
    complex: 'claude-opus-4',    // Best quality
  };

  const messages = [
    { role: 'system', content: context },
    { role: 'user', content: task },
  ];

  return await generateWithCommandCode(messages, {
    model: modelMap[complexity],
    temperature: complexity === 'complex' ? 0.1 : 0.2,
  });
}
```

### **API Routes**

```typescript
// app/api/code/generate/route.ts
import { generateCodeWithDeepSeek } from '@/lib/ai/commandcode';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { task, existingCode } = await request.json();

    const code = await generateCodeWithDeepSeek(task, existingCode);

    return NextResponse.json({
      code,
      model: 'deepseek-v4-pro',
      provider: 'commandcode',
    });
  } catch (error) {
    console.error('CommandCode error:', error);
    return NextResponse.json(
      { error: 'Code generation failed' },
      { status: 500 }
    );
  }
}

// app/api/code/refactor/route.ts
import { refactorWithKimi } from '@/lib/ai/commandcode';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { files, instructions } = await request.json();

    const result = await refactorWithKimi(files, instructions);

    return NextResponse.json({
      result,
      model: 'kimi-k2.7-code',
      context_used: '1M',
    });
  } catch (error) {
    console.error('Kimi refactor error:', error);
    return NextResponse.json(
      { error: 'Refactoring failed' },
      { status: 500 }
    );
  }
}
```

---

## 🎯 **Updated Agent Strategy**

### **With New Models Available**

```yaml
agents:
  infrastructure_agent:
    primary: "agnes-3.0-flash"       # Best for structured schema
    research: "atria-dawn-preview"   # Complex optimization 🆕
    fallback: "commandcode/deepseek-v4-pro" 🆕
    
  auth_agent:
    primary: "agnes-3.0-flash"       # Security critical
    research: "atria-dawn-preview"   # Security audit planning 🆕
    fallback: "commandcode/claude-opus-4" 🆕
    
  payment_agent:
    primary: "agnes-3.0-flash"       # Money is critical
    research: "atria-dawn-preview"   # Webhook verification design 🆕
    fallback: "commandcode/deepseek-v4-pro" 🆕
    
  admin_agent:
    primary: "gemini-1.5-flash"      # Fast UI
    alternative: "commandcode/qwen-3.7-max" 🆕
    
  files_agent:
    primary: "agnes-2.5-pro"         # 1M context
    alternative: "commandcode/kimi-k2.7-code" 🆕 (also 1M!)
    
  qa_agent:
    primary: "agnes-3.0-flash"       # Bug detection
    research: "atria-dawn-preview"   # Test strategy planning 🆕
    final_audit: "commandcode/claude-opus-4" 🆕
```

### **Cost with New Models**

```yaml
Base cost (free models): $0
  - Agnes: $0
  - Gemini: $0
  - Atria: TBD (likely free/low)
  
Optional CommandCode: $1/month
  - Includes $10 credits
  - Effective value ~$40
  - Access to 70+ models
  
Total monthly: $1-5 (incredible value!)
```

---

## 📊 **Model Selection Matrix**

| Task Type | Primary | Alternative | Research |
|-----------|---------|-------------|----------|
| **Schema Design** | Agnes 3.0 | DeepSeek V4 | Atria Dawn |
| **Auth/Security** | Agnes 3.0 | Claude Opus 4 | Atria Dawn |
| **Payment Logic** | Agnes 3.0 | DeepSeek V4 | Atria Dawn |
| **UI/Frontend** | Gemini Flash | Qwen 3.7 | - |
| **Long Context** | Agnes 2.5 Pro | Kimi K2.7 | - |
| **Quick Tasks** | Gemini Flash | Qwen 3.7 | - |
| **Research/Planning** | Atria Dawn | Agnes 3.0 | - |
| **Testing Strategy** | Agnes 3.0 | DeepSeek V4 | Atria Dawn |

---

## ✅ **Environment Setup**

```bash
# .env.local
AGNES_API_KEY=${AGNES_API_KEY}  # value in .env.9router (gitignored)
ATRIA_ASI_API_KEY=${ATRIA_ASI_API_KEY}  # value in .env.9router (gitignored)
COMMANDCODE_API_KEY=${COMMANDCODE_API_KEY}  # value in .env.9router (gitignored)
OPENROUTER_API_KEY=${OPENROUTER_API_KEY}  # value in .env.9router (gitignored)
GOOGLE_AI_API_KEY=your_google_key
```

All keys are now configured! ✅

---

## 🚀 **Quick Start**

```bash
# 1. Keys are already configured in docs ✅

# 2. Install dependencies
npm install

# 3. Test connections
curl https://apihub.agnes-ai.com/v1/models \
  -H "Authorization: Bearer $AGNES_API_KEY"

curl https://api.atria-asi.ai/v1/models \
  -H "Authorization: Bearer $ATRIA_ASI_API_KEY"

curl https://commandcode.ai/provider/v1/models \
  -H "Authorization: Bearer $COMMANDCODE_API_KEY"

# 4. Run 9router with new models
9router run --config 9router.config.yaml
```

---

## 📚 **Resources**

- **Agnes AI:** https://platform.agnes-ai.com/settings/apiKeys
- **Atria ASI:** https://api.atria-asi.ai/#models
- **CommandCode:** https://commandcode.ai/akwsa/settings/keys
- **OpenRouter:** https://openrouter.ai/

---

## ✅ **Summary**

```yaml
New Models Added:
  1. Atria Dawn Preview (Research agent for complex planning)
  2. CommandCode Gateway (70+ models via $1/mo)

API Keys Status:
  - Agnes AI: ✅ Configured
  - Atria ASI: ✅ Configured
  - CommandCode: ✅ Configured
  - OpenRouter: ✅ Configured
  - Google AI: ⚠️ Need to add

Total Cost:
  - Free tier: $0 (Agnes, Gemini, Atria)
  - CommandCode: $1/month (~$40 effective value)
  - Total: $1/month for 100+ model access!

Best Strategy:
  - Use Agnes 3.0 for most coding (FREE)
  - Use Atria Dawn for research/planning (FREE/low)
  - Use CommandCode for variety/fallback ($1/mo)
  - Result: Top-tier quality at minimal cost
```

**Ready to build with 100+ models! 🚀**
