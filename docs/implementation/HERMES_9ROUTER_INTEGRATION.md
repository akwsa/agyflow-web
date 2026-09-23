# Hermes → 9router Integration Guide
## Trigger AGY Flow Build via Hermes API

**Created:** 2026-09-21  
**Purpose:** Call 9router multi-agent build from Hermes coordinator  
**Flow:** Hermes Request → 9router Orchestrator → Multi-Agent Build

---

## 🎯 **Overview**

```yaml
Architecture:
  Client → Hermes API → 9router CLI → Multi-Agent Build
  
Hermes Role:
  - Receives build request
  - Validates configuration
  - Triggers 9router
  - Monitors progress
  - Reports status

9router Role:
  - Orchestrates 6 agents
  - Manages dependencies
  - Handles parallel execution
  - Reports to Hermes

Result: Complete AGY Flow transformation in 16 days
```

---

## 📡 **Hermes API Endpoints**

### **1. Trigger Build (POST)**

```bash
POST http://localhost:3001/api/v1/agent-router/route
Content-Type: application/json
Authorization: Bearer ${HERMES_API_KEY}
X-Copilot-Request-Id: req-agyflow-build-001
X-Copilot-Tenant-Id: agyflow
X-Copilot-User-Id: admin
Idempotency-Key: agyflow:admin:build:transformation-001

{
  "intent": "build_agyflow_transformation",
  "payload": {
    "project_name": "agyflow-web",
    "project_path": "m:\\saas\\saas\\agyflow-web",
    "build_type": "full_transformation",
    "phases": ["FASE_0", "FASE_1", "FASE_2", "FASE_3", "FASE_4", "FASE_5", "FASE_6"],
    "use_codex": true,
    "use_premium_audit": false,
    "dry_run": false
  },
  "tenantId": "agyflow",
  "userId": "admin",
  "source": "hermes-cli",
  "metadata": {
    "priority": "high",
    "notify_on_complete": true,
    "email": "admin@agyflow.com"
  }
}
```

**Response:**

```json
{
  "status": "success",
  "request_id": "req-agyflow-build-001",
  "trace_id": "req-agyflow-build-001-trace",
  "correlation_id": "9router-job-12345",
  "message": "AGY Flow transformation build started successfully",
  "result": {
    "job_id": "9router-job-12345",
    "estimated_duration_days": 16,
    "agents": [
      "infrastructure_agent",
      "auth_agent",
      "payment_agent",
      "admin_agent",
      "files_agent",
      "qa_agent"
    ],
    "start_time": "2026-09-21T06:51:30Z",
    "estimated_completion": "2026-10-07T06:51:30Z"
  }
}
```

---

### **2. Check Build Status (GET)**

```bash
GET http://localhost:3001/api/v1/agent-router/jobs/9router-job-12345
Authorization: Bearer ${HERMES_API_KEY}
```

**Response:**

```json
{
  "status": "pending",
  "request_id": "req-agyflow-build-001",
  "trace_id": "req-agyflow-build-001-trace",
  "correlation_id": "9router-job-12345",
  "message": "Build in progress - Day 5/16: auth_agent and payment_agent running in parallel",
  "result": {
    "job_id": "9router-job-12345",
    "progress": {
      "current_day": 5,
      "total_days": 16,
      "percent_complete": 31,
      "current_phase": "Core Systems",
      "active_agents": [
        {
          "name": "auth_agent",
          "status": "running",
          "progress": 45,
          "model": "openai_codex/gpt-5.6-codex"
        },
        {
          "name": "payment_agent",
          "status": "running",
          "progress": 38,
          "model": "openai_codex/gpt-5.6-codex"
        },
        {
          "name": "admin_agent",
          "status": "running",
          "progress": 52,
          "model": "google_antigravity/gemini-1.5-flash"
        }
      ],
      "completed_agents": [
        {
          "name": "infrastructure_agent",
          "completed_at": "2026-09-25T10:30:00Z",
          "duration_hours": 96,
          "model_used": "agnes_ai/agnes-3.0-flash",
          "output_files": 12
        }
      ],
      "pending_agents": ["files_agent", "qa_agent"]
    },
    "costs": {
      "codex_tasks_used": 4,
      "codex_limit_remaining": 56,
      "total_api_cost": "$2.50",
      "estimated_final_cost": "$5-8"
    }
  }
}
```

---

## 💻 **Implementation Examples**

### **1. Hermes Endpoint Handler**

Create `app/api/hermes/build/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { sendToHermes, HermesResponse } from '@/lib/server/hermes';

const execAsync = promisify(exec);

interface BuildRequest {
  intent: string;
  payload: {
    project_name: string;
    project_path: string;
    build_type: string;
    phases: string[];
    use_codex?: boolean;
    use_premium_audit?: boolean;
    dry_run?: boolean;
  };
  tenantId?: string;
  userId?: string;
  metadata?: {
    priority?: string;
    notify_on_complete?: boolean;
    email?: string;
  };
}

/**
 * Hermes webhook handler to trigger 9router build
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as BuildRequest;
    
    // Validate intent
    if (body.intent !== 'build_agyflow_transformation') {
      return NextResponse.json({
        status: 'failed',
        message: 'Unknown intent',
        error: {
          code: 'INVALID_INTENT',
          message: `Expected 'build_agyflow_transformation', got '${body.intent}'`,
          retryable: false,
        },
      }, { status: 400 });
    }

    // Validate payload
    const { project_path, build_type, phases, dry_run = false } = body.payload;
    
    if (!project_path) {
      return NextResponse.json({
        status: 'failed',
        message: 'Missing project_path',
        error: {
          code: 'MISSING_PROJECT_PATH',
          message: 'payload.project_path is required',
          retryable: false,
        },
      }, { status: 400 });
    }

    // Build 9router command
    const config_file = `${project_path}/9router.config.yaml`;
    const dry_run_flag = dry_run ? '--dry-run' : '';
    const command = `cd ${project_path} && 9router run --config ${config_file} ${dry_run_flag}`;

    console.log(`[Hermes] Triggering 9router build: ${command}`);

    // Execute 9router in background
    const job_id = `9router-job-${Date.now()}`;
    
    // Non-blocking execution
    execAsync(command).then((result) => {
      console.log(`[Hermes] 9router job ${job_id} completed:`, result.stdout);
      
      // Notify completion if requested
      if (body.metadata?.notify_on_complete && body.metadata?.email) {
        // Send email notification
        sendCompletionEmail(body.metadata.email, job_id, result);
      }
    }).catch((error) => {
      console.error(`[Hermes] 9router job ${job_id} failed:`, error);
    });

    // Return immediate response
    return NextResponse.json({
      status: 'success',
      request_id: body.payload.project_name + '-' + job_id,
      trace_id: job_id + '-trace',
      correlation_id: job_id,
      message: 'AGY Flow transformation build started successfully',
      result: {
        job_id,
        estimated_duration_days: 16,
        agents: [
          'infrastructure_agent',
          'auth_agent',
          'payment_agent',
          'admin_agent',
          'files_agent',
          'qa_agent',
        ],
        start_time: new Date().toISOString(),
        estimated_completion: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000).toISOString(),
        command,
        dry_run,
      },
    });

  } catch (error) {
    console.error('[Hermes] Build trigger error:', error);
    
    return NextResponse.json({
      status: 'failed',
      message: 'Failed to trigger build',
      error: {
        code: 'BUILD_TRIGGER_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error',
        retryable: true,
      },
    }, { status: 500 });
  }
}

/**
 * Get build status
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const job_id = searchParams.get('job_id');
  
  if (!job_id) {
    return NextResponse.json({
      status: 'failed',
      message: 'Missing job_id parameter',
    }, { status: 400 });
  }

  // Check 9router status
  const statusCommand = `9router status --job-id ${job_id} --format json`;
  
  try {
    const { stdout } = await execAsync(statusCommand);
    const status = JSON.parse(stdout);
    
    return NextResponse.json({
      status: status.phase === 'complete' ? 'success' : 'pending',
      request_id: job_id,
      trace_id: job_id + '-trace',
      correlation_id: job_id,
      message: `Build ${status.phase}: ${status.message}`,
      result: status,
    });
  } catch (error) {
    return NextResponse.json({
      status: 'failed',
      message: 'Failed to get build status',
      error: {
        code: 'STATUS_CHECK_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error',
        retryable: true,
      },
    }, { status: 500 });
  }
}

async function sendCompletionEmail(email: string, job_id: string, result: any) {
  // Implementation: send email notification
  console.log(`[Hermes] Sending completion email to ${email} for job ${job_id}`);
}
```

---

### **2. Client Code (Send Build Request from Hermes)**

Create `lib/hermes/build-client.ts`:

```typescript
import { sendToHermes, HermesResponse } from '@/lib/server/hermes';

interface BuildOptions {
  project_path: string;
  use_codex?: boolean;
  use_premium_audit?: boolean;
  dry_run?: boolean;
  notify_email?: string;
}

/**
 * Trigger AGY Flow transformation build via Hermes
 */
export async function triggerAgyFlowBuild(
  options: BuildOptions
): Promise<HermesResponse> {
  const response = await sendToHermes({
    intent: 'build_agyflow_transformation',
    payload: {
      project_name: 'agyflow-web',
      project_path: options.project_path,
      build_type: 'full_transformation',
      phases: ['FASE_0', 'FASE_1', 'FASE_2', 'FASE_3', 'FASE_4', 'FASE_5', 'FASE_6'],
      use_codex: options.use_codex ?? true,
      use_premium_audit: options.use_premium_audit ?? false,
      dry_run: options.dry_run ?? false,
    },
    tenantId: 'agyflow',
    userId: 'admin',
    source: 'hermes-client',
    metadata: {
      priority: 'high',
      notify_on_complete: !!options.notify_email,
      email: options.notify_email,
    },
  });

  return response;
}

/**
 * Check build status
 */
export async function checkBuildStatus(job_id: string): Promise<HermesResponse> {
  return await sendToHermes({
    intent: 'check_build_status',
    payload: {
      job_id,
    },
  });
}

/**
 * Cancel build
 */
export async function cancelBuild(job_id: string): Promise<HermesResponse> {
  return await sendToHermes({
    intent: 'cancel_build',
    payload: {
      job_id,
    },
  });
}
```

---

### **3. Usage Examples**

```typescript
// Example 1: Trigger full build with Codex
const response = await triggerAgyFlowBuild({
  project_path: 'm:\\saas\\saas\\agyflow-web',
  use_codex: true,
  use_premium_audit: false,
  dry_run: false,
  notify_email: 'admin@agyflow.com',
});

console.log('Build started:', response.result);
// Output: Build started: { job_id: '9router-job-12345', estimated_duration_days: 16, ... }

// Example 2: Check status periodically
const job_id = response.result.job_id;
const statusInterval = setInterval(async () => {
  const status = await checkBuildStatus(job_id);
  console.log('Build progress:', status.result.progress.percent_complete + '%');
  
  if (status.status === 'success') {
    console.log('Build complete!');
    clearInterval(statusInterval);
  }
}, 60000); // Check every minute

// Example 3: Dry run (preview)
const dryRunResponse = await triggerAgyFlowBuild({
  project_path: 'm:\\saas\\saas\\agyflow-web',
  dry_run: true,
});
console.log('Dry run result:', dryRunResponse.result);
```

---

## 🔧 **CLI Commands**

### **Direct 9router Commands**

```bash
# Full build (via Hermes or direct)
cd m:\saas\saas\agyflow-web
9router run --config 9router.config.yaml

# Dry run (preview without executing)
9router run --config 9router.config.yaml --dry-run

# Check status
9router status

# Check specific agent
9router status --agent auth_agent

# Cancel build
9router cancel

# View logs
9router logs --tail 100

# Resume after pause
9router resume

# Pause (for manual intervention)
9router pause
```

### **Via Hermes CLI**

```bash
# Trigger build via Hermes
curl -X POST http://localhost:3001/api/v1/agent-router/route \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${HERMES_API_KEY}" \
  -H "X-Copilot-Request-Id: req-build-001" \
  -H "X-Copilot-Tenant-Id: agyflow" \
  -d '{
    "intent": "build_agyflow_transformation",
    "payload": {
      "project_path": "m:\\saas\\saas\\agyflow-web",
      "use_codex": true,
      "dry_run": false
    }
  }'

# Check status
curl -X GET http://localhost:3001/api/v1/agent-router/jobs/9router-job-12345 \
  -H "Authorization: Bearer ${HERMES_API_KEY}"
```

---

## 📊 **Build Phases & Hermes Integration**

```yaml
Phase 1: Setup (Day 1-4)
  Hermes notifies: "infrastructure_agent started"
  Agent: infrastructure_agent
  Model: Agnes 3.0 Flash (FREE)
  Output: Database schema, Prisma, seed data
  Hermes status: "Phase 1/4: 25% complete"

Phase 2: Core Systems (Day 5-10) - PARALLEL
  Hermes notifies: "3 agents running in parallel"
  Agents:
    - auth_agent (Codex → Agnes fallback)
    - payment_agent (Codex → Agnes fallback)
    - admin_agent (Gemini Flash)
  Hermes status: "Phase 2/4: 50% complete"
  
Phase 3: Supplementary (Day 11-13)
  Hermes notifies: "files_agent started"
  Agent: files_agent
  Model: Agnes 2.5 Pro (FREE)
  Hermes status: "Phase 3/4: 75% complete"

Phase 4: QA & Deploy (Day 14-16)
  Hermes notifies: "qa_agent started - final audit"
  Agent: qa_agent
  Models: Agnes 3.0 + Codex (security audit)
  Hermes status: "Phase 4/4: 100% complete"
  
Completion:
  Hermes notifies: "Build complete - 16 days"
  Sends email to admin@agyflow.com
  Final report generated
```

---

## ⚡ **Quick Start**

### **Option 1: Direct 9router (Simplest)**

```bash
cd m:\saas\saas\agyflow-web
copy-gemini-key.bat
9router run --config 9router.config.yaml
```

### **Option 2: Via Hermes API (Recommended for Production)**

```bash
# 1. Start Hermes service
npm run hermes:start

# 2. Trigger build via API
curl -X POST http://localhost:3001/api/v1/agent-router/route \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_hermes_key" \
  -d '{
    "intent": "build_agyflow_transformation",
    "payload": {
      "project_path": "m:\\saas\\saas\\agyflow-web",
      "use_codex": true
    }
  }'

# 3. Monitor progress
watch -n 60 'curl http://localhost:3001/api/v1/agent-router/jobs/JOB_ID'
```

### **Option 3: Via TypeScript Client**

```typescript
import { triggerAgyFlowBuild } from '@/lib/hermes/build-client';

async function startBuild() {
  const response = await triggerAgyFlowBuild({
    project_path: 'm:\\saas\\saas\\agyflow-web',
    use_codex: true,
    notify_email: 'admin@agyflow.com',
  });
  
  console.log('Build started:', response.result.job_id);
}

startBuild();
```

---

## 🎯 **Best Practices**

```yaml
Hermes Integration:
  ✅ Use idempotency keys for retries
  ✅ Set proper timeouts (16 days build time!)
  ✅ Implement webhooks for completion notifications
  ✅ Log all requests for debugging
  ✅ Handle 5-hour Codex limit gracefully

9router Configuration:
  ✅ Use dry-run first to preview
  ✅ Monitor costs in real-time
  ✅ Set up Slack notifications
  ✅ Keep API keys secure
  ✅ Enable automatic fallback to free models

Monitoring:
  ✅ Check status every 1 hour minimum
  ✅ Alert on agent failures
  ✅ Track Codex usage (5-hour limit)
  ✅ Monitor API costs
  ✅ Log all agent outputs
```

---

## 📞 **Support & Troubleshooting**

```bash
# Hermes not responding?
curl http://localhost:3001/health

# 9router not found?
npm install -g @9router/cli

# Build stuck?
9router status --verbose
9router logs --tail 1000

# Cancel and restart?
9router cancel
9router run --config 9router.config.yaml --resume

# Codex limit hit?
# Automatic fallback to Agnes 3.0 Flash (FREE)
# Check logs: 9router logs --grep "fallback"
```

---

## ✅ **Summary**

```yaml
Integration Complete:
  ✅ Hermes → 9router bridge
  ✅ API endpoints defined
  ✅ Client code provided
  ✅ CLI commands documented
  ✅ Status monitoring included
  ✅ Error handling covered

Recommended Flow:
  1. Start Hermes service
  2. Trigger build via API
  3. Monitor via status endpoint
  4. Receive completion notification
  5. Review generated code
  6. Deploy to production

Total time: 5 minutes setup → 16 days automated build ✅
```

---

**Ready to trigger build via Hermes!** 🚀
