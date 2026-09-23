@echo off
REM Test Hermes API endpoint
REM Usage: test-hermes.bat [dry-run]

set BASE_URL=http://localhost:3001
set DRY_RUN=%1
if "%DRY_RUN%"=="" set DRY_RUN=true

echo.
echo 🧪 Testing Hermes API...
echo.

REM Test if server is running
echo 📡 Checking if Next.js server is running...
curl -s -o nul -w "%%{http_code}" %BASE_URL% > temp_status.txt
set /p STATUS=<temp_status.txt
del temp_status.txt

if not "%STATUS%"=="200" if not "%STATUS%"=="404" (
    echo ❌ Next.js server not running at %BASE_URL%
    echo.
    echo Start the server first:
    echo   cd m:\saas\saas\agyflow-web
    echo   npm run dev
    pause
    exit /b 1
)
echo ✅ Server is running
echo.

REM Trigger build
echo 🚀 Triggering build (dry_run=%DRY_RUN%)...
curl -s -X POST %BASE_URL%/api/hermes ^
  -H "Content-Type: application/json" ^
  -d "{\"intent\":\"build_agyflow_transformation\",\"payload\":{\"project_path\":\"m:\\\\saas\\\\saas\\\\agyflow-web\",\"use_codex\":false,\"dry_run\":%DRY_RUN%}}" > response.json

type response.json
echo.

REM Extract job_id (simple parsing)
for /f "tokens=2 delims=:" %%a in ('findstr "job_id" response.json') do (
    set JOB_ID=%%a
)
REM Clean up job_id (remove quotes and comma)
set JOB_ID=%JOB_ID:"=%
set JOB_ID=%JOB_ID:,=%
set JOB_ID=%JOB_ID: =%

if "%JOB_ID%"=="" (
    echo ❌ Failed to get job ID
    del response.json
    pause
    exit /b 1
)

echo.
echo ✅ Build started!
echo Job ID: %JOB_ID%
echo.

REM Check status
echo ⏳ Checking status in 3 seconds...
timeout /t 3 /nobreak > nul

echo.
echo 📊 Build status:
curl -s "%BASE_URL%/api/hermes?job_id=%JOB_ID%"
echo.

echo.
echo 💡 To check status again:
echo   curl %BASE_URL%/api/hermes?job_id=%JOB_ID%
echo.
echo 💡 To cancel/remove job:
echo   curl -X DELETE %BASE_URL%/api/hermes?job_id=%JOB_ID%
echo.

del response.json
pause
