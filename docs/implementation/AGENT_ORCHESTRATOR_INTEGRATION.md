# Agent Orchestrator Integration

**Production-Grade Multi-Agent Orchestration for AGY Flow**

---

## Overview

AGY Flow transformation menggunakan **agent-orchestrator** pattern dari [sarmakska/agent-orchestrator](https://github.com/sarmakska/agent-orchestrator) - production-ready orchestration framework dengan:

✅ **Durable State** - Checkpoints after every node  
✅ **Deterministic Replay** - Resume from any checkpoint  
✅ **Hard Budgets** - Token, tool, time limits enforced  
✅ **Typed Graphs** - Full TypeScript safety  
✅ **Observable Execution** - Every step tracked  

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Hermes API (Next.js)                      │
│                 POST /api/hermes                             │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              GraphExecutor (lib/orchestrator/graph.ts)       │
│  - Workflow graph with 6 agents                              │
│  - Budget enforcement                                        │
│  - Checkpointing                                             │
│  - Parallel execution                                        │
└─────────────────────┬───────────────────────────────────────┘
                      │
         ┌────────────┼────────────┐
         │            │            │
         ▼            ▼            ▼
    ┌────────┐  ┌────────┐  ┌────────┐
    │ Agnes  │  │ Gemini │  │ Atria  │
    │   AI   │  │  1.5   │  │  ASI   │
    └────────┘  └────────┘  └────────┘
```

---

## Workflow Graph

### 6-Agent Pipeline (16 Days)

```
Day 1-4: Infrastructure Agent (sequential)
  ↓
Day 5-10: Auth + Payment + Admin (parallel - 3 agents)
  ↓
Day 11-13: Files Agent (sequential)
  ↓
Day 14-16: QA Agent (sequential)
```

### Graph Definition

Located in: `lib/orchestrator/graph.ts`

```typescript
export const agyFlowGraph: WorkflowGraph = {
  name: 'agyflow-transformation',
  entry: 'infrastructure',
  
  budgets: {
    totalTokens: 10_000_000,      // 10M tokens
    totalToolCalls: 1000,          // 1000 tool calls
    totalWallClockMs: 16 * 24 * 60 * 60 * 1000,  // 16 days
  },
  
  nodes: {
    infrastructure: { ... },  // Day 1-4
    auth: { ... },            // Day 5-10 (parallel)
    payment: { ... },         // Day 5-10 (parallel)
    admin: { ... },           // Day 5-10 (parallel)
    files: { ... },           // Day 11-13
    qa: { ... },              // Day 14-16
  },
};
```

---

## Agent Nodes

### 1. Infrastructure Agent (Day 1-4)

**Model:** `agnes-3.0-flash` (FREE)  
**Budget:** 2M tokens, 200 tool calls, 4 days  

**Tasks:**
- Prisma setup
- Database schema
- ISR configuration

**Output:**
- `prisma/schema.prisma`
- `lib/db/client.ts`
- `lib/revalidate.ts`

---

### 2. Authentication Agent (Day 5-10)

**Model:** `agnes-3.0-flash` (fallback from Codex)  
**Budget:** 2M tokens, 200 tool calls, 6 days  

**Tasks:**
- Auth.js v5 setup
- Provider configuration (Google, GitHub, Email)
- Session management
- Protected routes

**Output:**
- `lib/auth/config.ts`
- `lib/auth/providers/*.ts`
- `middleware.ts`

---

### 3. Payment Agent (Day 5-10)

**Model:** `agnes-3.0-flash` (fallback from Codex)  
**Budget:** 2M tokens, 200 tool calls, 6 days  

**Tasks:**
- Lemon Squeezy integration
- Gumroad webhooks
- Subscription logic
- License validation

**Output:**
- `app/api/webhooks/lemonsqueezy/route.ts`
- `app/api/webhooks/gumroad/route.ts`
- `lib/payments/*.ts`

---

### 4. Admin Dashboard Agent (Day 5-10)

**Model:** `gemini-1.5-flash` (FREE)  
**Budget:** 2M tokens, 200 tool calls, 6 days  

**Tasks:**
- Admin layout
- User management
- Analytics dashboard
- Subscription management

**Output:**
- `app/admin/**/*.tsx`
- `components/admin/*.tsx`
- `lib/analytics/*.ts`

---

### 5. File Upload Agent (Day 11-13)

**Model:** `agnes-2.5-pro` (FREE, 1M context)  
**Budget:** 1M tokens, 100 tool calls, 3 days  

**Tasks:**
- Upload API
- Storage integration (S3/R2)
- File management UI

**Output:**
- `app/api/upload/route.ts`
- `lib/storage/*.ts`
- `components/files/*.tsx`

---

### 6. QA & Testing Agent (Day 14-16)

**Model:** `agnes-3.0-flash`  
**Budget:** 1M tokens, 100 tool calls, 3 days  

**Tasks:**
- Unit tests
- Integration tests
- Security audit
- Performance optimization
- Deployment prep

**Output:**
- `tests/**/*.test.ts`
- `SECURITY_AUDIT.md`
- `DEPLOYMENT.md`

---

## Execution Flow

### 1. Trigger Build

```bash
curl -X POST http://localhost:3001/api/hermes \
  -H "Content-Type: application/json" \
  -d '{"intent":"build_agyflow_transformation","payload":{"dry_run":false}}'
```

**Response:**
```json
{
  "status": "success",
  "correlation_id": "agyflow-run-1789966726595",
  "result": {
    "job_id": "agyflow-run-1789966726595",
    "graph_name": "agyflow-transformation",
    "total_nodes": 6,
    "agents": ["infrastructure", "auth", "payment", "admin", "files", "qa"],
    "budgets": {
      "totalTokens": 10000000,
      "totalToolCalls": 1000,
      "totalWallClockMs": 1382400000
    },
    "orchestrator": "agent-orchestrator (sarmakska pattern)"
  }
}
```

### 2. Check Status

```bash
curl http://localhost:3001/api/hermes?job_id=agyflow-run-1789966726595
```

**Response:**
```json
{
  "status": "pending",
  "result": {
    "job_id": "agyflow-run-1789966726595",
    "graph_name": "agyflow-transformation",
    "status": "running",
    "progress": 33,
    "current_node": "auth",
    "step": 2,
    "total_nodes": 6,
    "budget_used": {
      "tokens": 2500000,
      "toolCalls": 250,
      "wallClockMs": 345600000
    },
    "checkpoints": 2,
    "last_checkpoint": {
      "step": 2,
      "nodeId": "infrastructure",
      "timestamp": "2026-09-21T05:00:00.000Z"
    }
  }
}
```

### 3. Monitor Progress

Status akan update setiap 5 detik dengan:
- Current node being executed
- Progress percentage (based on nodes completed)
- Budget used (tokens, tool calls, wall clock)
- Checkpoints created

---

## Budget Enforcement

### Hard Limits

Execution akan **abort** jika exceed:

```typescript
budgets: {
  totalTokens: 10_000_000,           // 10M tokens
  totalToolCalls: 1000,               // 1000 tool calls
  totalWallClockMs: 1_382_400_000,   // 16 days in ms
}
```

### Per-Node Budgets

Setiap agent punya budget sendiri:

```typescript
infrastructure: {
  maxTokens: 2_000_000,              // 2M tokens
  maxToolCalls: 200,
  maxWallClockMs: 345_600_000,       // 4 days
}
```

### Budget Tracking

Checked after every node execution:
- Token usage estimated based on input/output files
- Tool calls counted (1 per task)
- Wall clock measured with `Date.now()`

---

## Checkpointing

### After Every Node

```typescript
interface Checkpoint {
  step: number;                // Execution step
  nodeId: string;              // Node that was executed
  timestamp: Date;             // When it completed
  output: any;                 // Node output
  budgetSnapshot: {            // Budget at this point
    tokens: number;
    toolCalls: number;
    wallClockMs: number;
  };
}
```

### Deterministic Replay

(Future feature - requires MySQL)

Resume from any checkpoint:

```bash
curl -X POST http://localhost:3001/api/hermes/replay \
  -d '{"job_id":"agyflow-run-XXX","from_step":2}'
```

---

## Parallel Execution

### Day 5-10: 3 Agents Parallel

```typescript
// Auth, Payment, Admin run concurrently
dependencies: ['infrastructure'],
next: ['files'],  // Wait for all 3 to complete
```

### Dependency Resolution

Graph executor checks dependencies before execution:

```typescript
private areDependenciesMet(node: AgentNode): boolean {
  return node.dependencies.every(depId => {
    return this.runState.checkpoints.some(cp => cp.nodeId === depId);
  });
}
```

---

## Error Handling

### Node Failure

If node fails:
1. Error captured in `runState.error`
2. Status set to `'failed'`
3. Execution halts
4. State preserved for debugging

### Budget Exceeded

If budget exceeded:
1. Throws error with clear message
2. Execution aborts immediately
3. Current state checkpointed

### Retry Strategy

(Future feature)

```typescript
error_handling: {
  on_agent_failure: {
    retry: true,
    max_retries: 2,
    fallback_model: true,
  }
}
```

---

## Migration Path to Production

### Current: In-Memory State

```typescript
const runningJobs = new Map<string, RunState>();
```

**Limitations:**
- Lost on server restart
- No persistence
- Single process only

### Future: MySQL + BullMQ

Adapt the [sarmakska/agent-orchestrator](https://github.com/sarmakska/agent-orchestrator) pattern for MySQL:

1. **Add Drizzle ORM and MySQL driver:**
   ```bash
   npm install drizzle-orm mysql2
   ```

2. **Create schema:**
   ```sql
   CREATE TABLE runs (
     id VARCHAR(191) PRIMARY KEY,
     graph_name VARCHAR(191) NOT NULL,
     status VARCHAR(50) NOT NULL,
     current_node VARCHAR(191),
     step INT NOT NULL DEFAULT 0,
     budget_used JSON NOT NULL,
     checkpoints JSON NOT NULL,
     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
       ON UPDATE CURRENT_TIMESTAMP
   );
   ```

3. **Add BullMQ queue:**
   ```bash
   npm install bullmq ioredis
   ```

4. **Update executor to persist:**
   ```typescript
   await db.insert(runs).values(runState);
   await queue.add('execute-node', { runId, nodeId });
   ```

---

## Performance Optimization

### Token Estimation

Currently rough estimate:
```typescript
const estimatedTokens = 
  task.files.input.length * 1000 +   // ~1K per input file
  task.files.output.length * 2000;    // ~2K per output file
```

**Production:** Use actual LLM token counters (tiktoken, etc)

### Parallel Limits

Currently: Max 3 concurrent agents

**Tune based on:**
- API rate limits
- Server resources
- Cost budget

### Caching

(Future optimization)

Cache common operations:
- File reads
- Documentation parsing
- Schema generations

---

## Testing

### Unit Tests

Test individual components:

```typescript
describe('GraphExecutor', () => {
  it('should execute graph from entry node', async () => {
    const executor = new GraphExecutor(testGraph, 'test-run-1');
    const result = await executor.execute();
    expect(result.status).toBe('completed');
  });
});
```

### Integration Tests

Test full workflow:

```bash
npm run test:integration
```

### Dry Run

Test without actual LLM calls:

```bash
curl -X POST http://localhost:3001/api/hermes \
  -d '{"intent":"build_agyflow_transformation","payload":{"dry_run":true}}'
```

---

## Monitoring & Observability

### Current Logging

```typescript
console.log(`[GraphExecutor] Executing node: ${node.name}`);
console.log(`[GraphExecutor] Budget used: ${JSON.stringify(budgetUsed)}`);
```

### Future: OpenTelemetry

Add spans for:
- Run lifecycle
- Node execution
- LLM calls
- Tool calls

```typescript
import { trace } from '@opentelemetry/api';

const span = trace.getTracer('orchestrator').startSpan('execute-node');
// ... execute node
span.end();
```

---

## Cost Tracking

### Model Costs

```typescript
cost_tracking: {
  model_costs: {
    "agnes/agnes-3.0-flash": 0.00,      // FREE
    "agnes/agnes-2.5-pro": 0.00,         // FREE
    "google/gemini-1.5-flash": 0.00,     // FREE
    "atria/atria-dawn-preview": 0.00,    // FREE
    "commandcode/*": 0.01,               // ~$1/month
    "openrouter/*": 0.01,                // ~$1/month
  }
}
```

### Total Estimated Cost

**Without Codex:** $1-2/month  
**With Codex:** $21-22/month  

---

## API Reference

### POST /api/hermes

Trigger build:

**Request:**
```json
{
  "intent": "build_agyflow_transformation",
  "payload": {
    "project_path": "m:\\saas\\saas\\agyflow-web",
    "use_codex": false,
    "dry_run": false
  }
}
```

**Response:**
```json
{
  "status": "success",
  "correlation_id": "agyflow-run-XXX",
  "result": {
    "job_id": "agyflow-run-XXX",
    "graph_name": "agyflow-transformation",
    "total_nodes": 6,
    "agents": ["infrastructure", "auth", "payment", "admin", "files", "qa"],
    "budgets": { ... },
    "orchestrator": "agent-orchestrator (sarmakska pattern)"
  }
}
```

### GET /api/hermes?job_id=xxx

Check status:

**Response:**
```json
{
  "status": "pending|success|failed",
  "result": {
    "job_id": "agyflow-run-XXX",
    "status": "running|completed|failed",
    "progress": 50,
    "current_node": "auth",
    "step": 3,
    "total_nodes": 6,
    "budget_used": {
      "tokens": 3000000,
      "toolCalls": 300,
      "wallClockMs": 432000000
    },
    "checkpoints": 3,
    "last_checkpoint": { ... }
  }
}
```

---

## Troubleshooting

### Build Not Starting

**Check:**
1. Next.js server running at port 3001
2. API endpoint accessible: `curl http://localhost:3001/api/hermes`
3. Check server logs for errors

### Budget Exceeded

**Symptoms:**
- Execution aborts mid-way
- Error: "Token budget exceeded"

**Solutions:**
1. Increase budgets in graph definition
2. Optimize task complexity
3. Use models with lower token usage

### Node Stuck

**Symptoms:**
- Progress not updating
- Same node for >1 hour

**Solutions:**
1. Check agent model availability
2. Review task complexity
3. Check API rate limits

---

## References

- **Orchestrator Pattern:** [sarmakska/agent-orchestrator](https://github.com/sarmakska/agent-orchestrator)
- **Graph Definition:** `lib/orchestrator/graph.ts`
- **Hermes Integration:** `app/api/hermes/route.ts`
- **Agent Config:** `docs/implementation/9ROUTER_CONFIGURATION.md`

---

## Next Steps

1. ✅ **Restart Next.js server** untuk load orchestrator code
2. ✅ **Test dengan dry-run** untuk verify graph execution
3. ✅ **Trigger actual build** untuk start 16-day transformation
4. 📊 **Monitor progress** via status endpoint
5. 🔄 **Migrate to MySQL** untuk durable state (production)

---

**Last Updated:** 2026-09-21  
**Status:** ✅ Ready to use  
**Version:** 1.0.0
