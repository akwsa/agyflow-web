# 9router + Hermes Configuration untuk AGY Flow
## dengan Model Scanning & Gemini Antigravity Integration

**Created:** 2026-09-20  
**Project:** agyflow-web transformation  
**Strategy:** Multi-agent orchestration + Cost optimization

---

## 🔍 **STEP 1: Model Availability Scan**

### Available AI Models (2026 Landscape)

#### **Category A: Premium Models (Paid)**

| Model | Provider | Context | Cost/1M tokens | Speed | Code Quality | Best For |
|-------|----------|---------|----------------|-------|--------------|----------|
| **Claude Opus 4.8** | Anthropic | 200K | $15 input / $75 output | Medium | ⭐⭐⭐⭐⭐ | Backend, Security |
| **GPT-5.6** | OpenAI | 128K | $10 input / $30 output | Fast | ⭐⭐⭐⭐ | Frontend, Quick |
| **Gemini 2.0 Ultra** | Google | 2M | $7 input / $21 output | Fast | ⭐⭐⭐⭐ | Long context |
| **Union Alpha (stealth)** | OpenRouter | 128K | $3-5 (varies) | Fast | ⭐⭐⭐⭐ | Experimental |

#### **Category B: Free/Low-Cost Models** ⭐

| Model | Provider | Context | Cost | Speed | Code Quality | Availability |
|-------|----------|---------|------|-------|--------------|--------------|
| **Agnes 3.0 Flash** 🔥 | Agnes AI (FREE) | 512K | FREE | Ultra Fast (252 tok/s) | ⭐⭐⭐⭐⭐ | Agnes API ✅ |
| **Agnes 2.5 Pro** 🔥 | Agnes AI (FREE) | 1M | FREE | Fast | ⭐⭐⭐⭐⭐ | Agnes API ✅ |
| **Atria Dawn Preview** 🆕 | Atria ASI | 256K+ | FREE/Low | Medium | ⭐⭐⭐⭐⭐ | Atria API ✅ |
| **DeepSeek V4 Pro** 🆕 | CommandCode ($1/mo) | 128K | $1/mo plan | Fast | ⭐⭐⭐⭐⭐ | CommandCode ✅ |
| **Kimi K2.7 Code** 🆕 | CommandCode ($1/mo) | 1M | $1/mo plan | Fast | ⭐⭐⭐⭐⭐ | CommandCode ✅ |
| **Qwen 3.7 Max** 🆕 | CommandCode ($1/mo) | 128K | $1/mo plan | Very Fast | ⭐⭐⭐⭐ | CommandCode ✅ |
| **GLM-5.2** 🆕 | CommandCode ($1/mo) | 128K | $1/mo plan | Fast | ⭐⭐⭐⭐ | CommandCode ✅ |
| **Gemini 1.5 Pro** | Google (Free) | 1M | FREE | Fast | ⭐⭐⭐⭐ | Antigravity ✅ |
| **Gemini 1.5 Flash** | Google (Free) | 1M | FREE | Very Fast | ⭐⭐⭐ | Antigravity ✅ |
| **Llama 3.2 90B** | NVIDIA (Free) | 128K | FREE | Medium | ⭐⭐⭐ | NVIDIA API ✅ |
| **Mixtral 8x22B** | NVIDIA (Free) | 64K | FREE | Fast | ⭐⭐⭐ | NVIDIA API ✅ |
| **DeepSeek Coder V2** | NVIDIA (Free) | 64K | FREE | Medium | ⭐⭐⭐⭐ | NVIDIA API ✅ |

**⚡ NEW MODELS ADDED:**

**1. Agnes 3.0 Flash** - #1 Ranked for Intelligence in its class!
- Ranked **1/61** in Artificial Analysis Intelligence Index
- **252 tokens/second** output speed
- **512K context window** + 65K max output
- **Currently FREE** (list price: $0.05 input, $0.15 output per 1M tokens)
- **Purpose-built for coding agents** and tool orchestration
- From Singapore's Sapiens AI

**2. Atria Dawn Preview** - Research Agent Model! 🆕
- **Long horizon research agent** for complex scientific work
- Designed for **executable experiments & reproducible results**
- Combines task objectives with environmental feedback
- **Full loop**: problem analysis → solution design → code → execution → recovery
- From ATRIA (InternLM team)

**3. CommandCode Gateway** - 70+ Models via $1/mo! 🆕
- Access to **DeepSeek V4 Pro**, **Kimi K2.7 Code**, **GLM-5.2**, **Qwen 3.7 Max**
- **$1/month Go plan** with $10 credits + deal multipliers (~$40 effective value)
- **Taste-1 learning** - adapts to your coding style
- **99%+ cache hit rate** for token efficiency
- Gateway to Claude, GPT, and 60+ open models

#### **Category C: OpenRouter Models** 🚀

| Model | Cost/1M tokens | Context | Speed | Notes |
|-------|----------------|---------|-------|-------|
| **Union Alpha (stealth)** | $3-5 | 128K | Fast | New, experimental |
| **Qwen 2.5 Coder** | $0.1-0.3 | 32K | Fast | Cost-effective |
| **Yi-Coder-9B** | $0.05 | 32K | Very Fast | Ultra cheap |
| **Phi-3.5** | FREE | 128K | Fast | Microsoft free tier |

---

## 🎯 **RECOMMENDED MODEL STRATEGY**

### **Optimal Mix: 70% Free + 30% Premium**

```yaml
strategy:
  primary: "free_models_with_premium_fallback"
  cost_target: "<$100 total"
  quality_threshold: "production_ready"
```

### **Agent-to-Model Mapping**

```yaml
agents:
  # CRITICAL AGENTS (Use Agnes 3.0 Flash - Best Free Model!)
  infrastructure_agent:
    primary: "agnes-3.0-flash"           # FREE, #1 ranked, 512K context ⭐⭐⭐⭐⭐
    fallback: "gemini-1.5-pro"           # FREE via Antigravity
    fallback2: "claude-opus-4.8"         # PAID if both fail
    reason: "Agnes 3.0 excels at structured tasks, DB schema critical"
    
  auth_agent:
    primary: "agnes-3.0-flash"           # FREE, best for secure code ⭐⭐⭐⭐⭐
    fallback: "gemini-1.5-pro"           # FREE via Antigravity
    fallback2: "claude-opus-4.8"         # PAID, security critical
    reason: "Agnes 3.0 has strong instruction adherence for auth"
    
  payment_agent:
    primary: "agnes-3.0-flash"           # FREE, trustworthy execution ⭐⭐⭐⭐⭐
    secondary: "agnes-2.5-pro"           # FREE, 1M context for verification
    fallback: "claude-opus-4.8"          # PAID, money is critical
    reason: "Agnes 3.0 reduces errors in payment logic"
  
  # MODERATE AGENTS (Fast Free Models)
  admin_agent:
    primary: "gemini-1.5-flash"          # FREE, fast UI gen ✅
    fallback: "agnes-3.0-flash"          # FREE, more structured
    fallback2: "llama-3.2-90b"           # FREE via NVIDIA
    reason: "Gemini Flash faster for UI, Agnes as quality fallback"
    
  files_agent:
    primary: "agnes-2.5-pro"             # FREE, 1M context for file ops ✅
    fallback: "gemini-1.5-flash"         # FREE via Antigravity
    reason: "Agnes 2.5 Pro has longer context for file management"
  
  # QA AGENT (Multi-model verification)
  qa_agent:
    primary: "agnes-3.0-flash"           # FREE, best for verification ⭐⭐⭐⭐⭐
    secondary: "claude-opus-4.8"         # PAID for final audit 💰
    tertiary: "gemini-1.5-pro"           # FREE double-check
    reason: "Agnes 3.0 catches bugs, Claude for security audit"

  # COORDINATOR (Ultra-fast routing)
  coordinator:
    primary: "gemini-1.5-flash"          # FREE, ultra fast ✅
    fallback: "agnes-3.0-flash"          # FREE, more reliable routing
    reason: "Gemini fastest for routing, Agnes for complex decisions"
```

---

## 🔧 **9router Configuration**

### **File:** `9router.config.yaml`

```yaml
# 9router + Hermes Configuration for AGY Flow
# Strategy: Cost-optimized with free models + premium fallback

version: "2.0"
project: "agyflow-web-transformation"
coordination_engine: "hermes"

# Model providers configuration
providers:
  # ============================================
  # PRIMARY: Agnes AI (FREE - Best for Coding Agents) 🔥
  # ============================================
  agnes_ai:
    enabled: true
    api_key: "${AGNES_API_KEY}"  # Real key configured ✅
    base_url: "https://apihub.agnes-ai.com/v1"
    models:
      - "agnes-3.0-flash"      # NEW: #1 ranked, 512K context, 252 tok/s
      - "agnes-2.5-pro"        # 1M context for long tasks
      - "agnes-2.5-flash"      # Ultra-fast fallback
    rate_limit:
      requests_per_minute: 100
      tokens_per_minute: 2000000  # 2M tokens/min
    features:
      - "tool_calling"
      - "thinking_mode"
      - "long_context"
      - "image_url_input"
    pricing:
      current: "FREE"  # Currently $0 for all models
      list_price:
        input: 0.05    # per 1M tokens (when billing starts)
        output: 0.15   # per 1M tokens
        cached: 0.005  # per 1M tokens
  
  # ============================================
  # NEW: Atria ASI (Research Agent Model) 🆕
  # ============================================
  atria_asi:
    enabled: true
    api_key: "${ATRIA_ASI_API_KEY}"  # Real key configured ✅
    base_url: "https://api.atria-asi.ai/v1"
    models:
      - "atria-dawn-preview"   # Long horizon research agent
    rate_limit:
      requests_per_minute: 50
      tokens_per_minute: 500000
    features:
      - "long_context"
      - "research_planning"
      - "scientific_reasoning"
      - "experiment_execution"
    best_for:
      - "Complex problem decomposition"
      - "Multi-step research tasks"
      - "Scientific workflow automation"
      - "Verifiable result generation"
    pricing:
      check: "https://api.atria-asi.ai/#models"
  
  # ============================================
  # NEW: CommandCode AI (Multi-Model Gateway) 🆕
  # ============================================
  commandcode_ai:
    enabled: true
    api_key: "${COMMANDCODE_API_KEY}"  # Real key configured ✅
    base_url: "https://commandcode.ai/provider/v1"
    models:
      - "deepseek-v4-pro"      # DeepSeek latest
      - "kimi-k2.7-code"       # Moonshot coding model
      - "glm-5.2"              # ChatGLM latest
      - "qwen-3.7-max"         # Qwen latest
      - "claude-opus-4"        # Via CommandCode gateway
      - "gpt-5.6"              # Via CommandCode gateway
    rate_limit:
      requests_per_minute: 60
      tokens_per_minute: 1000000
    features:
      - "multi_provider_gateway"
      - "taste_learning"       # Learns your coding style
      - "tool_call_repairs"
      - "high_cache_hit_rate"  # 99%+
    pricing:
      plan: "$1/month Go plan"
      included_credits: "$10"
      effective_value: "~$40 with deal multipliers"
      note: "Access to 70+ models via single key"
  
  # ============================================
  # PREMIUM: Codex (OpenAI - Use SPARINGLY) 🎯
  # ============================================
  openai_codex:
    enabled: true
    api_key: "${CODEX_API_KEY}"  # Need to add ⚠️
    base_url: "https://api.openai.com/v1"
    models:
      - "gpt-5.6-codex"        # Latest Codex model
      - "gpt-5.3-codex"        # Stable version
    rate_limit:
      requests_per_minute: 30
      tokens_per_minute: 500000
    usage_limits:
      plan: "Plus ($20/mo) or higher"
      rolling_window: "5 hours"
      credits_per_window: "Variable (10-60 tasks)"
      cost_per_credit: "$0.04"
      reset: "Rolling 5-hour window"
    features:
      - "advanced_reasoning"
      - "cloud_task_delegation"
      - "github_integration"
      - "slack_integration"
    best_for:
      - "Complex algorithms"
      - "Critical security code"
      - "Final verification"
      - "Architecture decisions"
    usage_strategy:
      priority: "CRITICAL_ONLY"  # 5-hour limit!
      use_for:
        - "Security-critical authentication"
        - "Payment logic verification"
        - "Complex database optimization"
        - "Final security audit"
      avoid_for:
        - "Simple CRUD operations"
        - "UI components"
        - "Basic routing"
        - "Config files"
      fallback_to: "agnes_ai/agnes-3.0-flash"
    pricing:
      plan_options:
        - name: "Plus"
          cost: "$20/month"
          credits: "10-60 tasks per 5h window"
        - name: "Pro 5x"
          cost: "$100/month"
          credits: "5x Plus limits"
        - name: "Pro 20x"
          cost: "$200/month"
          credits: "20x Plus limits"
      note: "Limited to 5-hour rolling window - use wisely!"
    
  google_antigravity:
    enabled: true
    api_key: "${GOOGLE_AI_API_KEY}"
    models:
      - "gemini-1.5-pro-latest"
      - "gemini-1.5-flash-latest"
    rate_limit:
      requests_per_minute: 60
      tokens_per_minute: 1000000  # 1M tokens/min
    
  nvidia_inference:
    enabled: true
    api_key: "${NVIDIA_API_KEY}"  # Free tier
    base_url: "https://integrate.api.nvidia.com/v1"
    models:
      - "meta/llama-3.2-90b-instruct"
      - "deepseek-ai/deepseek-coder-v2"
      - "mistralai/mixtral-8x22b-instruct"
    
  anthropic:
    enabled: true
    api_key: "${ANTHROPIC_API_KEY}"
    models:
      - "claude-opus-4.8"
    rate_limit:
      requests_per_minute: 50
    
  openrouter:
    enabled: true
    api_key: "${OPENROUTER_API_KEY}"  # Real key configured ✅
    base_url: "https://openrouter.ai/api/v1"
    models:
      - "union-alpha"  # Stealth model
      - "qwen/qwen-2.5-coder-32b"
      - "microsoft/phi-3.5-medium"

# Hermes coordination
hermes:
  base_url: "${HERMES_BASE_URL}"
  api_key: "${HERMES_API_KEY}"
  router_path: "/api/v1/agent-router/route"
  status_path: "/api/v1/agent-router/jobs"
  timeout_ms: 30000
  
# Agent definitions
agents:
  # ============================================
  # FASE 0-1: Infrastructure & Database
  # ============================================
  infrastructure_agent:
    id: "infra-001"
    role: "Database schema, Prisma setup, seed data"
    model:
      primary: "agnes_ai/agnes-3.0-flash"
      fallback: "google_antigravity/gemini-1.5-pro-latest"
      fallback2: "anthropic/claude-opus-4.8"
      temperature: 0.1  # Conservative for infrastructure
      thinking_mode: true  # Enable for complex schema design
    context:
      files:
        - "docs/implementation/FASE_0_SETUP_INFRASTRUCTURE.md"
        - "docs/implementation/FASE_1_FONDASI_DINAMIS.md"
        - ".env.example"
      max_tokens: 50000
    output:
      - "prisma/schema.prisma"
      - "prisma/seed.ts"
      - "lib/db/index.ts"
      - "lib/cms/products.ts"
    dependencies: []
    estimated_time: "4 days"
    priority: "critical"
    
  # ============================================
  # FASE 2: Authentication (CRITICAL - Use Codex)
  # ============================================
  auth_agent:
    id: "auth-001"
    role: "Auth.js, email verification, middleware"
    model:
      primary: "openai_codex/gpt-5.6-codex"  # CRITICAL SECURITY 🔐
      fallback: "agnes_ai/agnes-3.0-flash"    # If Codex limit hit
      fallback2: "google_antigravity/gemini-1.5-pro-latest"
      fallback3: "anthropic/claude-opus-4.8"
      temperature: 0.05  # Very conservative for auth
      thinking_mode: true  # Enable for security logic
    context:
      files:
        - "docs/implementation/FASE_2_AUTHENTICATION.md"
        - "prisma/schema.prisma"  # From infrastructure_agent
      max_tokens: 60000
    output:
      - "lib/auth/config.ts"
      - "lib/auth/guards.ts"
      - "lib/mail/index.ts"
      - "app/api/auth/[...nextauth]/route.ts"
      - "app/api/auth/register/route.ts"
      - "app/login/page.tsx"
      - "app/register/page.tsx"
      - "middleware.ts"
    dependencies: ["infrastructure_agent"]
    estimated_time: "6 days"
    priority: "critical"
    usage_notes: "Uses Codex for security-critical auth logic"
    
  # ============================================
  # FASE 3: Webhooks & Orders (CRITICAL - Use Codex)
  # ============================================
  payment_agent:
    id: "payment-001"
    role: "Webhook handlers, order tracking, entitlements"
    model:
      primary: "openai_codex/gpt-5.6-codex"  # CRITICAL MONEY LOGIC 💰
      secondary: "agnes_ai/agnes-3.0-flash"   # Verification
      research: "atria_asi/atria-dawn-preview" # Complex planning
      fallback: "anthropic/claude-opus-4.8"
      temperature: 0.03  # Extremely conservative for money
      thinking_mode: true  # Critical for payment logic
    context:
      files:
        - "docs/implementation/FASE_3_ORDERS_WEBHOOKS.md"
        - "prisma/schema.prisma"
      max_tokens: 70000
    output:
      - "app/api/webhooks/lemonsqueezy/route.ts"
      - "app/api/webhooks/gumroad/route.ts"
      - "lib/payments/webhook-utils.ts"
      - "lib/payments/entitlement.ts"
      - "lib/mail/order.ts"
      - "app/account/orders/page.tsx"
    dependencies: ["infrastructure_agent", "auth_agent"]
    estimated_time: "6 days"
    priority: "critical"
    validation:
      - "signature_verification_test"
      - "idempotency_test"
      - "entitlement_logic_test"
    usage_notes: "Uses Codex for webhook signature verification & payment logic"
    
  # ============================================
  # FASE 4: Admin Dashboard
  # ============================================
  admin_agent:
    id: "admin-001"
    role: "Admin UI, CRUD interfaces, CMS"
    model:
      primary: "google_antigravity/gemini-1.5-flash-latest"  # Fast for UI
      fallback: "agnes_ai/agnes-3.0-flash"  # More structured
      fallback2: "nvidia_inference/llama-3.2-90b"
      temperature: 0.3  # More creative for UI
    context:
      files:
        - "docs/implementation/FASE_4_5_6_FINAL.md"
        - "prisma/schema.prisma"
      section: "FASE 4"
      max_tokens: 50000
    output:
      - "app/admin/layout.tsx"
      - "app/admin/page.tsx"
      - "app/admin/products/page.tsx"
      - "app/admin/orders/page.tsx"
      - "app/admin/users/page.tsx"
      - "app/api/admin/products/route.ts"
      - "app/api/admin/orders/route.ts"
    dependencies: ["auth_agent"]
    estimated_time: "6 days"
    priority: "medium"
    
  # ============================================
  # FASE 5: File Management
  # ============================================
  files_agent:
    id: "files-001"
    role: "File upload, protected downloads"
    model:
      primary: "agnes_ai/agnes-2.5-pro"  # 1M context for file ops
      fallback: "google_antigravity/gemini-1.5-flash-latest"
      temperature: 0.2
    context:
      files:
        - "docs/implementation/FASE_4_5_6_FINAL.md"
      section: "FASE 5"
      max_tokens: 40000
    output:
      - "app/api/admin/media/route.ts"
      - "app/api/downloads/[token]/route.ts"
      - "app/account/downloads/page.tsx"
      - "lib/uploads/index.ts"
    dependencies: ["auth_agent", "payment_agent"]
    estimated_time: "3 days"
    priority: "medium"
    
  # ============================================
  # FASE 6: Testing & QA (Use Codex for final audit)
  # ============================================
  qa_agent:
    id: "qa-001"
    role: "E2E tests, security audit, deployment"
    model:
      primary: "agnes_ai/agnes-3.0-flash"  # Bug detection
      security_audit: "openai_codex/gpt-5.6-codex"  # FINAL AUDIT 🔐
      verification: "atria_asi/atria-dawn-preview"  # Research verification
      fallback: "anthropic/claude-opus-4.8"  
      temperature: 0.1
      thinking_mode: true  # Enable for test planning
    context:
      files:
        - "docs/implementation/FASE_4_5_6_FINAL.md"
      section: "FASE 6"
      entire_codebase: true  # Need to see all code
      max_tokens: 100000
    output:
      - "tests/e2e/auth.spec.ts"
      - "tests/e2e/purchase.spec.ts"
      - "tests/e2e/admin.spec.ts"
      - "docs/SECURITY_AUDIT.md"
      - "lib/rate-limit.ts"
      - "scripts/backup.sh"
    dependencies: ["*"]  # All agents
    estimated_time: "3 days"
    priority: "critical"
    phases:
      - name: "Test Generation"
        model: "agnes_ai/agnes-3.0-flash"
        duration: "1 day"
      - name: "Security Audit"
        model: "openai_codex/gpt-5.6-codex"  # Use Codex here!
        duration: "1 day"
        usage_notes: "Critical security review - worth using Codex"
      - name: "Final Verification"
        model: "atria_asi/atria-dawn-preview"
        duration: "1 day"
    
  # ============================================
  # COORDINATOR (Meta-agent)
  # ============================================
  coordinator:
    id: "coordinator-001"
    role: "Orchestrate agents, handle dependencies, resolve conflicts"
    model:
      primary: "google_antigravity/gemini-1.5-flash-latest"  # Fast & free
      temperature: 0.0  # Deterministic routing
    responsibilities:
      - "Task delegation"
      - "Dependency resolution"
      - "Conflict detection"
      - "Progress monitoring"
      - "Agent communication"

# Execution strategy
execution:
  mode: "parallel_with_dependencies"
  
  phases:
    - name: "Setup"
      agents: ["infrastructure_agent"]
      parallel: false
      estimated_days: 4
      
    - name: "Core Systems"
      agents: ["auth_agent", "payment_agent", "admin_agent"]
      parallel: true  # Run simultaneously
      estimated_days: 6  # Calendar days (not total work days)
      
    - name: "Supplementary"
      agents: ["files_agent"]
      parallel: false
      estimated_days: 3
      
    - name: "Quality Assurance"
      agents: ["qa_agent"]
      parallel: false
      estimated_days: 3
      
  total_estimated_days: 16  # Calendar days
  
# Cost tracking
cost_budget:
  max_total: 100  # USD
  alert_threshold: 80  # Alert at 80%
  breakdown:
    infrastructure_agent: 0  # Free (Gemini)
    auth_agent: 0  # Free (Gemini)
    payment_agent: 5  # Some Claude fallback
    admin_agent: 0  # Free (Gemini Flash)
    files_agent: 2  # Cheap (Qwen)
    qa_agent: 50  # Premium (Claude Opus)
    coordination: 0  # Free (Gemini Flash)
    buffer: 43
    
# Monitoring & alerts
monitoring:
  webhook_url: "${SLACK_WEBHOOK_URL}"
  events:
    - "agent_started"
    - "agent_completed"
    - "agent_error"
    - "dependency_resolved"
    - "cost_threshold_reached"
    - "phase_completed"
    
# Error handling
error_handling:
  retry_attempts: 3
  retry_delay_seconds: 60
  fallback_to_premium: true  # If free model fails, use paid
  human_intervention_threshold: 3  # After 3 failures, alert human
  
# Quality gates
quality_gates:
  - name: "TypeScript compilation"
    command: "npx tsc --noEmit"
    required: true
    
  - name: "Prisma validation"
    command: "npx prisma validate"
    required: true
    
  - name: "Tests pass"
    command: "npm test"
    required: true
    phase: "qa"
    
  - name: "Security audit"
    command: "npm audit"
    required: false
    phase: "qa"
```

---

## 🔑 **Environment Variables Required**

**File:** `.env.9router`

```bash
# ===========================================
# 9router + Hermes Configuration
# ===========================================

# Hermes (existing)
HERMES_BASE_URL=http://localhost:3001
HERMES_API_KEY=your_hermes_key
HERMES_ROUTER_PATH=/api/v1/agent-router/route
HERMES_STATUS_PATH=/api/v1/agent-router/jobs
HERMES_TIMEOUT_MS=30000

# ===========================================
# FREE Model Providers (Priority)
# ===========================================

# Agnes AI (PRIMARY - Best for Coding Agents) 🔥
AGNES_API_KEY=${AGNES_API_KEY}  # value in .env.9router (gitignored)
# Get from: https://platform.agnes-ai.com/settings/apiKeys
# Currently FREE for all models (agnes-3.0-flash, agnes-2.5-pro, agnes-2.5-flash)
# #1 ranked intelligence, 512K context, 252 tok/s
# Purpose-built for coding agents & tool orchestration

# Atria ASI (NEW - Research Agent Model) 🆕
ATRIA_ASI_API_KEY=${ATRIA_ASI_API_KEY}  # value in .env.9router (gitignored)
# Get from: https://api.atria-asi.ai/#models
# Atria Dawn Preview - Long horizon research agent
# Built for scientific work & complex problem solving

# CommandCode AI (NEW - Multi-Model Gateway) 🆕
COMMANDCODE_API_KEY=${COMMANDCODE_API_KEY}  # value in .env.9router (gitignored)
# Get from: https://commandcode.ai/akwsa/settings/keys
# Gateway to 70+ models (Claude, GPT, DeepSeek, Qwen, Kimi, GLM)
# $1/mo Go plan with $10 credits + deal multipliers (~$40 effective)

# Google AI (Gemini via Antigravity) - FREE
GOOGLE_AI_API_KEY=your_google_api_key
# Get from: https://ai.google.dev/

# NVIDIA Inference API - FREE
NVIDIA_API_KEY=your_nvidia_key
# Get from: https://build.nvidia.com/

# ===========================================
# Paid Model Providers (Fallback)
# ===========================================

# OpenAI Codex (PREMIUM - Use SPARINGLY!) 🎯
CODEX_API_KEY=your_openai_api_key
# Get from: https://platform.openai.com/api-keys
# Requires: ChatGPT Plus ($20/mo) or higher
# Limit: 5-hour rolling window (10-60 tasks per window)
# Cost: $0.04 per credit (bundled in ChatGPT subscription)
# Use ONLY for:
#   - Authentication security logic (auth_agent)
#   - Payment webhook verification (payment_agent)
#   - Final security audit (qa_agent)
# DON'T use for:
#   - Simple CRUD operations
#   - UI components
#   - Config files
#   - Basic routing
# Fallback: Agnes 3.0 Flash (FREE) if Codex limit hit

# Anthropic (Claude) - PAID
ANTHROPIC_API_KEY=your_anthropic_key

# OpenRouter (Union Alpha, etc.) - PAID
OPENROUTER_API_KEY=${OPENROUTER_API_KEY}  # value in .env.9router (gitignored)
# Get from: https://openrouter.ai/
# Access to Union Alpha (stealth), Qwen, Yi-Coder, Phi-3.5

# ===========================================
# Project Specific
# ===========================================

# AGY Flow Database
DATABASE_URL=mysql://user:pass@localhost:3306/agyflow_main

# Monitoring
SLACK_WEBHOOK_URL=your_slack_webhook

# Cost alerts
COST_ALERT_EMAIL=your@email.com
```

---

## 📊 **Cost Breakdown: Free vs Paid**

### **Optimized Strategy with Agnes 3.0 Flash (90% Free!)**

| Agent | Model | Cost | Tokens Used | Total |
|-------|-------|------|-------------|-------|
| infrastructure | Agnes 3.0 Flash (FREE) 🔥 | $0 | 50K | $0 |
| auth | Codex (5h limit) 🎯 | $1-2 | 30K | $1-2 |
| auth (fallback) | Agnes 3.0 Flash (FREE) | $0 | 30K | $0 |
| payment | Codex (5h limit) 🎯 | $2-3 | 40K | $2-3 |
| payment (verify) | Agnes 2.5 Pro (FREE) 🔥 | $0 | 30K | $0 |
| admin | Gemini 1.5 Flash (FREE) | $0 | 50K | $0 |
| files | Agnes 2.5 Pro (FREE) 🔥 | $0 | 40K | $0 |
| qa (tests) | Agnes 3.0 Flash (FREE) 🔥 | $0 | 50K | $0 |
| qa (security) | Codex (5h limit) 🎯 | $2-3 | 30K | $2-3 |
| qa (verify) | Atria Dawn (FREE) | $0 | 30K | $0 |
| coordinator | Gemini Flash (FREE) | $0 | 10K | $0 |
| **TOTAL** | | | **390K** | **~$5-8** ⚡⚡⚡ |

**Codex Usage Strategy:**
- Use Codex for **3 critical agents only**: auth, payment, qa (security audit)
- Total Codex tasks: ~6-10 within 5-hour window ✅
- Falls back to Agnes 3.0 Flash (FREE) if limit hit
- Bundled in ChatGPT Plus ($20/mo) - no extra API cost!

**vs Pure Claude Opus:** $200+ (saving 96%!) 🎯  
**vs Previous strategy (no Codex):** $3-5 (slight increase for critical security)  

### **Why Agnes 3.0 Flash Changes Everything:**

✅ **FREE** (currently $0, list price only $0.05/$0.15 per 1M)  
✅ **#1 Ranked** in Intelligence Index (36/100, ranked 1/61 in class)  
✅ **Ultra-fast** (252 tokens/second)  
✅ **512K context** + 65K max output  
✅ **Purpose-built** for coding agents & tool orchestration  
✅ **Trustworthy execution** - reduces incorrect completion claims  
✅ **Strong instruction adherence** - perfect for auth/payment logic  

**Only use Claude Opus for:** Final security audit ($3-5 total)

---

## 🚀 **Setup Instructions**

### **Step 1: Install 9router**

```bash
# Install 9router CLI
npm install -g @9router/cli

# Initialize project
cd m:\saas\saas\agyflow-web
9router init

# Install dependencies
npm install @9router/core @9router/hermes-adapter
```

### **Step 2: Setup Free API Keys**

```bash
# 1. Agnes AI (PRIMARY - Best for this project!) 🔥
# Visit: https://platform.agnes-ai.com/subscribe/subscription
# Sign up → Get API key (free tier: currently unlimited)
# Why: #1 ranked for coding agents, 512K context, ultra-fast

# 2. Google AI (Gemini) - FREE
# Visit: https://ai.google.dev/
# Create project → Enable Gemini API → Get API key

# 3. NVIDIA Inference - FREE (Optional, for fallback)
# Visit: https://build.nvidia.com/
# Sign up → Get API key (free tier: unlimited)

# 4. OpenRouter for Union Alpha (Optional, experimental)
# Visit: https://openrouter.ai/
```

**Priority:** Get Agnes AI key first - it's the best free model for this project!

### **Step 3: Configure 9router**

```bash
# Copy configuration
cp 9router.config.yaml.example 9router.config.yaml

# Copy environment
cp .env.9router.example .env.9router

# Fill in API keys
nano .env.9router
```

### **Step 4: Validate Configuration**

```bash
# Test configuration
9router validate

# Test model connectivity
9router test-models

# Expected output:
# ✅ agnes_ai/agnes-3.0-flash: OK (252 tok/s, 512K context)
# ✅ agnes_ai/agnes-2.5-pro: OK (1M context)
# ✅ google_antigravity/gemini-1.5-pro-latest: OK
# ✅ google_antigravity/gemini-1.5-flash-latest: OK
# ✅ anthropic/claude-opus-4.8: OK
```

### **Step 5: Start Hermes Coordinator**

```bash
# Start Hermes service
npm run hermes:start

# Verify
curl http://localhost:3001/api/v1/agent-router/health
```

### **Step 6: Run 9router**

```bash
# Dry run (simulation)
9router run --dry-run

# Actual execution
9router run --config 9router.config.yaml

# Monitor progress
9router status
```

---

## 📈 **Execution Timeline**

```
Day 1-4: infrastructure_agent (Agnes 3.0 Flash FREE) ⚡
└─ Setup DB, Prisma, Seed - 252 tok/s throughput!

Day 5-10: Parallel execution (ALL FREE!)
├─ auth_agent (Agnes 3.0 Flash FREE) → 6 days
├─ payment_agent (Agnes 3.0 Flash FREE) → 6 days  
└─ admin_agent (Gemini Flash FREE) → 6 days

Day 11-13: files_agent (Agnes 2.5 Pro FREE)
└─ File management with 1M context

Day 14-16: qa_agent (Agnes 3.0 FREE + Claude for audit)
└─ Testing, security (only $3-5 for Claude audit), deploy

TOTAL: 16 calendar days 🎯
COST: ~$3-5 (vs $200+ pure Claude) 🎉
QUALITY: Top-tier (Agnes ranked #1 in intelligence)
```

**Speed boost from Agnes 3.0:**
- 252 tokens/second (5x faster than typical models)
- 512K context (can handle entire codebase in one go)
- Thinking mode for complex logic
- Tool orchestration optimized
└─ Setup DB, Prisma, Seed

Day 5-10: Parallel execution
├─ auth_agent (Gemini Pro FREE) → 6 days
├─ payment_agent (DeepSeek FREE + Gemini verify) → 6 days
└─ admin_agent (Gemini Flash FREE) → 6 days

Day 11-13: files_agent (Qwen CHEAP)
└─ File management

Day 14-16: qa_agent (Claude Opus PAID)
└─ Testing, security, deploy

TOTAL: 16 calendar days 🎯
COST: ~$12-15 (vs $200+ pure Claude) 🎉
```

---

## ⚡ **Gemini Antigravity Integration (SEPARATE)**

**Gemini is used OUTSIDE 9router** - directly in codebase for real-time features.

### **File:** `lib/ai/gemini-antigravity.ts`

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

/**
 * Gemini Antigravity for real-time tasks
 * Used OUTSIDE 9router for:
 * - Live customer support
 * - Real-time content generation
 * - On-demand tasks
 */
export async function generateWithGemini(
  prompt: string,
  options?: {
    model?: 'gemini-1.5-pro' | 'gemini-1.5-flash';
    temperature?: number;
    maxTokens?: number;
  }
) {
  const model = genAI.getGenerativeModel({
    model: options?.model || 'gemini-1.5-pro-latest',
  });

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: options?.temperature || 0.7,
      maxOutputTokens: options?.maxTokens || 8192,
    },
  });

  return result.response.text();
}

/**
 * Example: Generate product description
 */
export async function generateProductDescription(productName: string) {
  return await generateWithGemini(
    `Generate a compelling product description for: ${productName}`,
    { model: 'gemini-1.5-flash', temperature: 0.9 }
  );
}

/**
 * Example: Customer support response
 */
export async function generateSupportResponse(question: string) {
  return await generateWithGemini(
    `As AGY Flow customer support, answer: ${question}`,
    { model: 'gemini-1.5-pro', temperature: 0.3 }
  );
}
```

**Usage in app:**

```typescript
// app/api/ai/generate/route.ts
import { generateProductDescription } from '@/lib/ai/gemini-antigravity';

export async function POST(request: Request) {
  const { productName } = await request.json();
  const description = await generateProductDescription(productName);
  return Response.json({ description });
}
```

---

## ✅ **Summary: Complete Architecture**

```
┌─────────────────────────────────────────────────────┐
│         AGY Flow AI Architecture (OPTIMIZED)        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. 9router (Build-time orchestration)             │
│     ├─ infrastructure_agent (Agnes 3.0 Flash FREE) 🔥│
│     ├─ auth_agent (Agnes 3.0 Flash FREE) 🔥        │
│     ├─ payment_agent (Agnes 3.0 Flash FREE) 🔥     │
│     ├─ admin_agent (Gemini Flash FREE)             │
│     ├─ files_agent (Agnes 2.5 Pro FREE) 🔥         │
│     └─ qa_agent (Agnes 3.0 + Claude audit)         │
│                                                     │
│  2. Hermes (Coordination layer)                    │
│     └─ Routes tasks between agents                 │
│                                                     │
│  3. Gemini Antigravity (Runtime features)          │
│     ├─ Product description generation              │
│     ├─ Customer support responses                  │
│     └─ Real-time content generation                │
│                                                     │
│  4. Agnes 3.0 Flash (PRIMARY MODEL) 🔥             │
│     ├─ #1 ranked intelligence (1/61 in class)      │
│     ├─ 252 tokens/second (ultra-fast)              │
│     ├─ 512K context + 65K max output               │
│     ├─ Purpose-built for coding agents             │
│     ├─ Thinking mode for complex logic             │
│     └─ Currently FREE ($0 for all operations)      │
│                                                     │
└─────────────────────────────────────────────────────┘

Cost: ~$3-5 total (97.5% cheaper than pure Claude!)
Timeline: 16 calendar days
Quality: Production-ready + Top-tier intelligence
Primary Provider: Agnes AI (Singapore's Sapiens AI)
```

---

## 🎯 **Next Steps**

1. **Setup API keys** (Google AI + NVIDIA - both FREE)
2. **Install 9router** (`npm install -g @9router/cli`)
3. **Copy config files** (this document contains everything)
4. **Run validation** (`9router validate`)
5. **Start build** (`9router run`)

Siap untuk mulai setup? 🚀
