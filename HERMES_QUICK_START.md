# 🚀 Hermes API Quick Start

## ⚠️ IMPORTANT: Run from agyflow-web folder!

```bash
# ❌ WRONG - This will fail:
PS M:\saas\saas> npm run dev
# Error: ENOENT package.json

# ✅ CORRECT - Change directory first:
PS M:\saas\saas> cd agyflow-web
PS M:\saas\saas\agyflow-web> npm run dev
# Success! Server starts at http://localhost:3000
```

---

## 🎯 Complete Setup (Copy-Paste)

### **Terminal 1: Start Server**

```powershell
cd m:\saas\saas\agyflow-web
npm run dev
```

Wait for:
```
✓ Ready in 1.2s
○ Local:        http://localhost:3000
```

### **Terminal 2: Test Hermes**

```powershell
cd m:\saas\saas\agyflow-web
.\test-hermes.bat true
```

---

## 📊 Expected Output

### 1. Server Start (Terminal 1)

```
  ▲ Next.js 14.x
  - Local:        http://localhost:3000
  - Environment:  development
  
✓ Ready in 1247ms
```

### 2. Hermes Test (Terminal 2)

```
🧪 Testing Hermes API...

📡 Checking if Next.js server is running...
✅ Server is running

🚀 Triggering build (dry_run=true)...
{
  "status": "success",
  "request_id": "req-9router-job-1726886503000",
  "correlation_id": "9router-job-1726886503000",
  "message": "AGY Flow transformation build started successfully",
  "result": {
    "job_id": "9router-job-1726886503000",
    "estimated_duration_days": 0.01,
    "agents": [
      "infrastructure_agent",
      "auth_agent",
      "payment_agent",
      "admin_agent",
      "files_agent",
      "qa_agent"
    ],
    "start_time": "2026-09-21T00:05:43.000Z",
    "estimated_completion": "2026-09-21T00:20:43.000Z",
    "command": "cd m:\\saas\\saas\\agyflow-web && 9router run --config 9router.config.yaml --dry-run",
    "dry_run": true,
    "use_codex": false,
    "status_check_url": "/api/hermes?job_id=9router-job-1726886503000"
  }
}

✅ Build started!
Job ID: 9router-job-1726886503000

⏳ Checking status in 3 seconds...

📊 Build status:
{
  "status": "pending",
  "result": {
    "job_id": "9router-job-1726886503000",
    "status": "running",
    "progress": 0,
    "start_time": "2026-09-21T00:05:43.000Z",
    "elapsed_days": "0.00",
    "command": "cd m:\\saas\\saas\\agyflow-web && 9router run --config 9router.config.yaml --dry-run"
  }
}

💡 To check status again:
  curl http://localhost:3000/api/hermes?job_id=9router-job-1726886503000
```

---

## 🔧 Troubleshooting

### Error: "ENOENT package.json"

**Cause:** Running from wrong directory

**Fix:**
```powershell
# Check current directory
pwd

# Should output: M:\saas\saas\agyflow-web
# If not, change directory:
cd m:\saas\saas\agyflow-web
```

### Error: "test-hermes.bat not recognized"

**Cause:** Running from wrong directory or file doesn't exist

**Fix:**
```powershell
# List files to verify test-hermes.bat exists
dir test-hermes.bat

# If exists, run with .\
.\test-hermes.bat true

# Or use full path:
m:\saas\saas\agyflow-web\test-hermes.bat true
```

### Error: "Server not running"

**Cause:** Next.js dev server not started

**Fix:**
```powershell
# Terminal 1: Start server first
cd m:\saas\saas\agyflow-web
npm run dev

# Wait for "Ready in..." message
# Then in Terminal 2:
.\test-hermes.bat true
```

### Port 3000 Already in Use

**Fix:**
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Or use different port
$env:PORT=3001
npm run dev
```

---

## 🎯 Manual Testing (Without Script)

If `test-hermes.bat` doesn't work, use curl directly:

### **1. Check Server**

```powershell
curl.exe http://localhost:3000
```

Should return HTML (Next.js app)

### **2. Trigger Build**

```powershell
curl.exe -X POST http://localhost:3000/api/hermes `
  -H "Content-Type: application/json" `
  -d '{\"intent\":\"build_agyflow_transformation\",\"payload\":{\"dry_run\":true}}'
```

### **3. Check Status**

```powershell
# Replace <job_id> with actual ID from step 2
curl.exe http://localhost:3000/api/hermes?job_id=<job_id>
```

---

## 📁 File Locations

```
m:\saas\saas\agyflow-web\
├── app\api\hermes\route.ts      ← Hermes API endpoint
├── test-hermes.bat               ← Windows test script
├── test-hermes.sh                ← Linux/Mac test script
├── package.json                  ← npm scripts
└── HERMES_QUICK_START.md         ← This file
```

---

## ✅ Success Checklist

- [ ] Changed directory to `m:\saas\saas\agyflow-web`
- [ ] Ran `npm run dev` successfully
- [ ] Server shows "Ready" at http://localhost:3000
- [ ] Ran `.\test-hermes.bat true` successfully
- [ ] Got job_id in response
- [ ] Status check shows "running" or "pending"

---

## 🚀 Next Steps

### Dry Run Test (Safe)
```powershell
.\test-hermes.bat true
```

### Actual Build (16 Days)
```powershell
.\test-hermes.bat false
```

### With Codex (Security Tasks)
```powershell
# Edit test-hermes.bat, change line:
# "use_codex": false → "use_codex": true

.\test-hermes.bat false
```

---

## 📚 Documentation

- **Setup Guide:** `docs/implementation/HERMES_SERVICE_SETUP.md`
- **Integration:** `docs/implementation/HERMES_9ROUTER_INTEGRATION.md`
- **Quick Start:** `docs/implementation/QUICKSTART.md`
- **9router Config:** `docs/implementation/9ROUTER_CONFIGURATION.md`

---

## 💬 Still Having Issues?

1. Verify you're in correct directory: `pwd` should show `M:\saas\saas\agyflow-web`
2. Check Node.js version: `node --version` (should be v18+)
3. Check npm version: `npm --version` (should be v9+)
4. Reinstall dependencies: `npm install`
5. Check if port 3000 is free: `netstat -ano | findstr :3000`

---

**Last Updated:** 2026-09-21  
**Status:** ✅ Ready to use
