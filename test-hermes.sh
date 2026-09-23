#!/bin/bash
# Test Hermes API endpoint
# Usage: ./test-hermes.sh [dry-run]

BASE_URL="http://localhost:3000"
DRY_RUN=${1:-true}

echo "🧪 Testing Hermes API..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test if server is running
echo "📡 Checking if Next.js server is running..."
if ! curl -s -o /dev/null -w "%{http_code}" "$BASE_URL" | grep -q "200\|404"; then
    echo -e "${RED}❌ Next.js server not running at $BASE_URL${NC}"
    echo ""
    echo "Start the server first:"
    echo "  cd m:\\saas\\saas\\agyflow-web"
    echo "  npm run dev"
    exit 1
fi
echo -e "${GREEN}✅ Server is running${NC}"
echo ""

# Trigger build
echo "🚀 Triggering build (dry_run=$DRY_RUN)..."
RESPONSE=$(curl -s -X POST "$BASE_URL/api/hermes" \
  -H "Content-Type: application/json" \
  -d "{
    \"intent\": \"build_agyflow_transformation\",
    \"payload\": {
      \"project_path\": \"m:\\\\saas\\\\saas\\\\agyflow-web\",
      \"use_codex\": false,
      \"dry_run\": $DRY_RUN
    }
  }")

echo "$RESPONSE" | jq .

# Extract job_id
JOB_ID=$(echo "$RESPONSE" | jq -r '.result.job_id')

if [ "$JOB_ID" = "null" ] || [ -z "$JOB_ID" ]; then
    echo -e "${RED}❌ Failed to get job ID${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Build started!${NC}"
echo "Job ID: $JOB_ID"
echo ""

# Check status
echo "⏳ Checking status in 3 seconds..."
sleep 3

echo ""
echo "📊 Build status:"
curl -s "$BASE_URL/api/hermes?job_id=$JOB_ID" | jq .

echo ""
echo -e "${YELLOW}💡 To check status again:${NC}"
echo "  curl $BASE_URL/api/hermes?job_id=$JOB_ID | jq ."
echo ""
echo -e "${YELLOW}💡 To cancel/remove job:${NC}"
echo "  curl -X DELETE $BASE_URL/api/hermes?job_id=$JOB_ID"
echo ""
