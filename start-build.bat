@echo off
REM Simple Hermes build trigger
REM Usage: start-build.bat [true|false]
REM        true = dry-run (test), false = actual build

set DRY_RUN=%1
if "%DRY_RUN%"=="" set DRY_RUN=true

echo.
echo ========================================
echo   AGY Flow Build Trigger
echo ========================================
echo.
echo Dry Run: %DRY_RUN%
echo Target: http://localhost:3001/api/hermes
echo.
echo Triggering build...
echo.

curl.exe -X POST http://localhost:3001/api/hermes ^
  -H "Content-Type: application/json" ^
  -d "{\"intent\":\"build_agyflow_transformation\",\"payload\":{\"project_path\":\"m:\\\\saas\\\\saas\\\\agyflow-web\",\"use_codex\":false,\"dry_run\":%DRY_RUN%}}"

echo.
echo.
echo ========================================
echo Build triggered!
echo.
echo To check status, use the job_id from above:
echo   curl.exe http://localhost:3001/api/hermes?job_id=YOUR_JOB_ID
echo ========================================
echo.
pause
