# Hermes Service Setup Guide
## Start Hermes API Server for 9router Integration

**Created:** 2026-09-21  
**Purpose:** Setup and run Hermes service to coordinate 9router builds  
**Port:** 3001 (default)

---

## 🚨 **Error yang Anda Alami**

```bash
curl: (7) Failed to connect to localhost:3001 after 2245 ms: Could not connect to server
```

**Penyebab:** Hermes service belum running di port 3001

**Solusi:** Start Hermes service terlebih dahulu (guide di bawah)

---

## 🎯 **2 Options untuk Setup Hermes**

### **Option 1: Embedded Hermes (Recommended)** ⚡

Hermes berjalan sebagai Next.js API route - paling simple!

### **Option 2: Standalone Hermes Service** 🔧

Hermes sebagai service terpisah - lebih flexible tapi butuh setup lebih banyak.

---

## ⚡ **Option 1: Embedded Hermes (Quick Setup)**

### **Step 1: Buat API Route Handler**

Create `app/api/hermes/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Store running jobs
const runningJobs = new Map<string, {
  status: 'pending' | 'running' | 'success' | 'failed';
  progress: number;
  startTime: Date;
  command: string;
}>();

/**
 * POST /api/hermes - Trigger 9router build
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { intent, payload } = body;

    // Validate intent
    if (intent !== 'build_agyflow_transformation') {
      return NextResponse.json({
        status: 'failed',
        message: `Unknown intent: ${intent}`,
        error: {
          code: 'INVALID_INTENT',
          message: `Expected 'build_agyflow_transformation'`,
          retryable: false,
        },
      }, { status: 400 });
    }

    // Get parameters
    const {
      project_path = 'm:\\saas\\saas\\agyflow-web',
      use_codex = false,
      dry_run = false,
    } = payload || {};

    // Generate job ID
    const jobId = `9router-job-${Date.now()}`;

    // Build command
    const configFile = `${project_path}/9router.config.yaml`;
    const dryRunFlag = dry_run ? '--dry-run' : '';
    const command = `cd ${project_path} && 9router run --config ${configFile} ${dryRunFlag}`;

    console.log(`[Hermes] Starting job ${jobId}: ${command}`);

    // Store job info
    runningJobs.set(jobId, {
      status: 'pending',
      progress: 0,
      startTime: new Date(),
      command,
    });

    // Execute in background (non-blocking)
    execAsync(command).then((result) => {
      console.log(`[Hermes] Job ${jobId} completed:`, result.stdout);
      const job = runningJobs.get(jobId);
      if (job) {
        job.status = 'success';
        job.progress = 100;
      }
    }).catch((error) => {
      console.error(`[Hermes] Job ${jobId} failed:`, error);
      const job = runningJobs.get(jobId);
      if (job) {
        job.status = 'failed';
      }
    });

    // Update status to running
    setTimeout(() => {
      const job = runningJobs.get(jobId);
      if (job && job.status === 'pending') {
        job.status = 'running';
      }
    }, 1000);

    // Return success response
    return NextResponse.json({
      status: 'success',
      request_id: body.requestId || `req-${jobId}`,
      trace_id: body.traceId || `trace-${jobId}`,
      correlation_id: jobId,
      message: 'AGY Flow transformation build started successfully',
      result: {
        job_id: jobId,
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
        use_codex,
      },
    });

  } catch (error) {
    console.error('[Hermes] Error:', error);
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
 * GET /api/hermes?job_id=xxx - Check job status
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('job_id');

  if (!jobId) {
    return NextResponse.json({
      status: 'failed',
      message: 'Missing job_id parameter',
    }, { status: 400 });
  }

  const job = runningJobs.get(jobId);

  if (!job) {
    return NextResponse.json({
      status: 'failed',
      message: `Job ${jobId} not found`,
    }, { status: 404 });
  }

  return NextResponse.json({
    status: job.status === 'success' ? 'success' : 'pending',
    request_id: jobId,
    trace_id: `trace-${jobId}`,
    correlation_id: jobId,
    message: `Build ${job.status}`,
    result: {
      job_id: jobId,
      status: job.status,
      progress: job.progress,
      start_time: job.startTime.toISOString(),
      command: job.command,
    },
  });
}
```

### **Step 2: Start Next.js Dev Server**

```bash
# Navigate to project
cd m:\saas\saas\agyflow-web

# Start Next.js (will run Hermes API at :3000/api/hermes)
npm run dev
```

### **Step 3: Test Hermes Endpoint**

```bash
# Trigger build (port 3000, not 3001!)
curl -X POST http://localhost:3000/api/hermes \
  -H "Content-Type: application/json" \
  -d '{
    "intent": "build_agyflow_transformation",
    "payload": {
      "project_path": "m:\\saas\\saas\\agyflow-web",
      "use_codex": false,
      "dry_run": true
    }
  }'

# Expected response:
# {
#   "status": "success",
#   "job_id": "9router-job-1726884103000",
#   "estimated_duration_days": 16,
#   "agents": [...]
# }
```

### **Step 4: Check Status**

```bash
# Check job status
curl http://localhost:3000/api/hermes?job_id=9router-job-1726884103000

# Expected response:
# {
#   "status": "pending",
#   "result": {
#     "job_id": "9router-job-1726884103000",
#     "status": "running",
#     "progress": 0
#   }
# }
```

---

## 🔧 **Option 2: Standalone Hermes Service**

### **Step 1: Create Hermes Service**

Create `server/hermes-service.ts`:

```typescript
import express, { Request, Response } from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const app = express();
const port = 3001;

app.use(express.json());

// Store running jobs
const runningJobs = new Map();

// POST /api/v1/agent-router/route
app.post('/api/v1/agent-router/route', async (req: Request, res: Response) => {
  const { intent, payload } = req.body;

  if (intent !== 'build_agyflow_transformation') {
    return res.status(400).json({
      status: 'failed',
      message: `Unknown intent: ${intent}`,
    });
  }

  const {
    project_path = 'm:\\saas\\saas\\agyflow-web',
    dry_run = false,
  } = payload || {};

  const jobId = `9router-job-${Date.now()}`;
  const command = `cd ${project_path} && 9router run --config 9router.config.yaml ${dry_run ? '--dry-run' : ''}`;

  runningJobs.set(jobId, {
    status: 'running',
    startTime: new Date(),
    command,
  });

  // Execute in background
  execAsync(command).then(() => {
    const job = runningJobs.get(jobId);
    if (job) job.status = 'success';
  }).catch(() => {
    const job = runningJobs.get(jobId);
    if (job) job.status = 'failed';
  });

  res.json({
    status: 'success',
    request_id: jobId,
    correlation_id: jobId,
    message: 'Build started',
    result: {
      job_id: jobId,
      estimated_duration_days: 16,
      command,
    },
  });
});

// GET /api/v1/agent-router/jobs/:jobId
app.get('/api/v1/agent-router/jobs/:jobId', (req: Request, res: Response) => {
  const { jobId } = req.params;
  const job = runningJobs.get(jobId);

  if (!job) {
    return res.status(404).json({
      status: 'failed',
      message: 'Job not found',
    });
  }

  res.json({
    status: job.status,
    request_id: jobId,
    result: job,
  });
});

// Start server
app.listen(port, () => {
  console.log(`Hermes service running at http://localhost:${port}`);
});
```

### **Step 2: Install Dependencies**

```bash
npm install express @types/express ts-node
```

### **Step 3: Add Script to package.json**

```json
{
  "scripts": {
    "hermes:start": "ts-node server/hermes-service.ts",
    "hermes:dev": "nodemon server/hermes-service.ts"
  }
}
```

### **Step 4: Start Hermes Service**

```bash
npm run hermes:start
```

### **Step 5: Test**

```bash
curl -X POST http://localhost:3001/api/v1/agent-router/route \
  -H "Content-Type: application/json" \
  -d '{
    "intent": "build_agyflow_transformation",
    "payload": {
      "project_path": "m:\\saas\\saas\\agyflow-web"
    }
  }'
```

---

## 🚀 **Quick Fix untuk Error Anda**

### **Solusi Tercepat: Langsung 9router (Skip Hermes)**

```bash
# Cara paling mudah - langsung jalankan 9router:
cd m:\saas\saas\agyflow-web
copy-gemini-key.bat
9router run --config 9router.config.yaml --dry-run

# Kalau sukses, jalankan tanpa dry-run:
9router run --config 9router.config.yaml
```

### **Atau: Setup Embedded Hermes (5 menit)**

```bash
# 1. Buat file app/api/hermes/route.ts (code di atas)

# 2. Start Next.js
cd m:\saas\saas\agyflow-web
npm run dev

# 3. Test (port 3000, bukan 3001!)
curl -X POST http://localhost:3000/api/hermes \
  -H "Content-Type: application/json" \
  -d '{"intent":"build_agyflow_transformation","payload":{"dry_run":true}}'

# 4. Jika sukses, jalankan actual build:
curl -X POST http://localhost:3000/api/hermes \
  -H "Content-Type: application/json" \
  -d '{"intent":"build_agyflow_transformation","payload":{"dry_run":false}}'
```

---

## 📊 **Comparison**

| Method | Port | Setup Time | Best For |
|--------|------|------------|----------|
| **Direct 9router** | N/A | 0 min | Quick start, testing |
| **Embedded Hermes** | 3000 | 5 min | Development, integrated |
| **Standalone Hermes** | 3001 | 10 min | Production, separate service |

---

## ✅ **Recommended Flow**

```yaml
Development:
  1. Start: Direct 9router (fastest)
  2. Later: Add Embedded Hermes if needed

Production:
  1. Use: Standalone Hermes service
  2. Port: 3001
  3. Monitor: PM2 or systemd
```

---

## 🎯 **Your Next Steps**

### **Option A: Skip Hermes (Fastest)** ⚡

```bash
cd m:\saas\saas\agyflow-web
9router run --config 9router.config.yaml --dry-run
```

### **Option B: Use Embedded Hermes**

```bash
# 1. Create app/api/hermes/route.ts (see above)
# 2. Start server
npm run dev
# 3. Test
curl -X POST http://localhost:3000/api/hermes -H "Content-Type: application/json" -d '{"intent":"build_agyflow_transformation","payload":{"dry_run":true}}'
```

### **Option C: Setup Standalone Hermes**

```bash
# 1. Create server/hermes-service.ts (see above)
# 2. Install deps
npm install express @types/express
# 3. Add script to package.json
# 4. Start
npm run hermes:start
# 5. Test (port 3001)
curl -X POST http://localhost:3001/api/v1/agent-router/route ...
```

---

## 💡 **Tips**

```bash
# Check if port 3001 is already in use
netstat -ano | findstr :3001

# Kill process on port 3001 (Windows)
taskkill /PID <PID> /F

# Test if Hermes is running
curl http://localhost:3001/health
# or
curl http://localhost:3000/api/hermes
```

---

## ✅ **Summary**

```yaml
Error: Connection refused to localhost:3001
Cause: Hermes service not running

Solutions:
  1. Direct 9router: Skip Hermes entirely ⚡ (fastest)
  2. Embedded Hermes: Use Next.js API routes (port 3000)
  3. Standalone Hermes: Separate service (port 3001)

Recommended:
  Start: Option 1 (direct 9router)
  Later: Option 2 (embedded) for integration
```

**Pilih yang mana? Kalau mau cepat, langsung `9router run` aja! 🚀**
