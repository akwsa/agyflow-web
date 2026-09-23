import { NextRequest, NextResponse } from 'next/server';
import { GraphExecutor, agyFlowGraph, type RunState } from '@/lib/orchestrator/graph';
import { MySqlRunStore } from '@/lib/orchestrator/mysql-run-store';
import { NineRouterClient } from '@/lib/orchestrator/nine-router';

const databaseUrl = process.env.DATABASE_URL;
const runStore = databaseUrl ? new MySqlRunStore(databaseUrl) : undefined;
const runStoreReady = runStore?.initialize();

// Keep active executors in memory for low-latency polling.
// Every transition is also persisted to MySQL for restart recovery.
const runningJobs = new Map<string, RunState>();

/**
 * POST /api/hermes
 * Trigger AGY Flow transformation via Agent Orchestrator
 * 
 * Based on: sarmakska/agent-orchestrator
 * - Durable state in MySQL
 * - Typed workflow graph
 * - Hard budgets (tokens, tool calls, wall clock)
 * - Deterministic execution
 * 
 * Body:
 * {
 *   "intent": "build_agyflow_transformation",
 *   "payload": {
 *     "project_path": "m:\\saas\\saas\\agyflow-web",
 *     "use_codex": false,
 *     "dry_run": true
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { intent, payload, requestId, traceId } = body;

    // Validate intent
    if (intent !== 'build_agyflow_transformation') {
      return NextResponse.json({
        status: 'failed',
        request_id: requestId || `req-${Date.now()}`,
        trace_id: traceId || `trace-${Date.now()}`,
        message: `Unknown intent: ${intent}`,
        error: {
          code: 'INVALID_INTENT',
          message: `Expected 'build_agyflow_transformation', got '${intent}'`,
          retryable: false,
        },
      }, { status: 400 });
    }

    // Extract parameters with defaults
    const {
      project_path = process.cwd(),
      use_codex = false,
      dry_run = false,
    } = payload || {};

    if (!runStore || !runStoreReady) {
      return NextResponse.json({
        status: 'failed',
        message: 'MySQL persistence is not configured',
        error: { code: 'DATABASE_NOT_CONFIGURED', retryable: false },
      }, { status: 503 });
    }
    await runStoreReady;

    const routerBaseUrl = process.env.NINE_ROUTER_BASE_URL;
    const routerApiKey = process.env.NINE_ROUTER_API_KEY;
    if (!dry_run && (!routerBaseUrl || !routerApiKey)) {
      return NextResponse.json({
        status: 'failed',
        message: '9router gateway is not configured',
        error: { code: 'NINE_ROUTER_NOT_CONFIGURED', retryable: false },
      }, { status: 503 });
    }

    const modelClient = !dry_run
      ? new NineRouterClient({ baseUrl: routerBaseUrl!, apiKey: routerApiKey! })
      : undefined;

    // Generate job ID
    const jobId = `agyflow-run-${Date.now()}`;

    console.log(`[Hermes] Starting orchestrated run: ${jobId}`);
    console.log(`[Hermes] Graph: ${agyFlowGraph.name}`);
    console.log(`[Hermes] Nodes: ${Object.keys(agyFlowGraph.nodes).length}`);
    console.log(`[Hermes] Use Codex: ${use_codex}`);
    console.log(`[Hermes] Dry Run: ${dry_run}`);

    // Create graph executor
    const executor = new GraphExecutor(agyFlowGraph, jobId, {
      modelClient,
      store: runStore,
      dryRun: dry_run,
      projectPath: project_path,
    });

    // Store initial state
    runningJobs.set(jobId, executor.getState());

    // Execute graph in background (non-blocking)
    executor.execute().then((finalState) => {
      console.log(`[Hermes] Run ${jobId} completed`);
      console.log(`[Hermes] Status: ${finalState.status}`);
      console.log(`[Hermes] Steps: ${finalState.step}`);
      console.log(`[Hermes] Budget used: ${JSON.stringify(finalState.budgetUsed)}`);
      
      runningJobs.set(jobId, finalState);
    }).catch((error) => {
      console.error(`[Hermes] Run ${jobId} failed:`, error);
      
      const failedState = executor.getState();
      failedState.status = 'failed';
      failedState.error = error.message;
      
      runningJobs.set(jobId, failedState);
    });

    // Update state periodically
    const updateInterval = setInterval(() => {
      const currentState = executor.getState();
      runningJobs.set(jobId, currentState);
      
      if (currentState.status !== 'running') {
        clearInterval(updateInterval);
      }
    }, 5000);  // Update every 5 seconds

    // Return immediate success response
    return NextResponse.json({
      status: 'success',
      request_id: requestId || `req-${jobId}`,
      trace_id: traceId || `trace-${jobId}`,
      correlation_id: jobId,
      message: 'AGY Flow transformation started via Agent Orchestrator',
      result: {
        job_id: jobId,
        graph_name: agyFlowGraph.name,
        total_nodes: Object.keys(agyFlowGraph.nodes).length,
        estimated_duration_days: dry_run ? 0.01 : 16,
        agents: Object.keys(agyFlowGraph.nodes),
        start_time: new Date().toISOString(),
        estimated_completion: dry_run 
          ? new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes
          : new Date(Date.now() + 16 * 24 * 60 * 60 * 1000).toISOString(), // 16 days
        budgets: agyFlowGraph.budgets,
        dry_run,
        use_codex,
        status_check_url: `/api/hermes?job_id=${jobId}`,
        orchestrator: 'agent-orchestrator (sarmakska pattern)',
      },
    });

  } catch (error) {
    console.error('[Hermes] Build trigger error:', error);
    
    return NextResponse.json({
      status: 'failed',
      request_id: `req-${Date.now()}`,
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
 * GET /api/hermes?job_id=xxx
 * Check build job status
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('job_id');

  if (!jobId) {
    return NextResponse.json({
      status: 'failed',
      message: 'Missing job_id parameter',
      error: {
        code: 'MISSING_JOB_ID',
        message: 'Please provide job_id query parameter',
        retryable: false,
      },
    }, { status: 400 });
  }

  let runState = runningJobs.get(jobId);
  if (!runState && runStore && runStoreReady) {
    await runStoreReady;
    runState = await runStore.get(jobId) ?? undefined;
  }

  if (!runState) {
    return NextResponse.json({
      status: 'failed',
      message: `Job ${jobId} not found`,
      error: {
        code: 'JOB_NOT_FOUND',
        message: `No job found with ID: ${jobId}`,
        retryable: false,
      },
    }, { status: 404 });
  }

  // Calculate progress based on steps completed
  const totalNodes = Object.keys(agyFlowGraph.nodes).length;
  const progress = runState.step > 0 
    ? Math.floor((runState.step / totalNodes) * 100)
    : 0;

  // Calculate elapsed time
  const elapsedMs = Date.now() - runState.startTime.getTime();
  const elapsedDays = elapsedMs / (24 * 60 * 60 * 1000);

  return NextResponse.json({
    status: runState.status === 'completed' ? 'success' : runState.status === 'failed' ? 'failed' : 'pending',
    request_id: jobId,
    trace_id: `trace-${jobId}`,
    correlation_id: jobId,
    message: `Build ${runState.status}`,
    result: {
      job_id: jobId,
      graph_name: runState.graphName,
      status: runState.status,
      progress: runState.status === 'completed' ? 100 : progress,
      current_node: runState.currentNode,
      step: runState.step,
      total_nodes: totalNodes,
      start_time: runState.startTime.toISOString(),
      end_time: runState.endTime?.toISOString(),
      elapsed_days: elapsedDays.toFixed(3),
      budget_used: runState.budgetUsed,
      budget_limits: agyFlowGraph.budgets,
      checkpoints: runState.checkpoints.length,
      last_checkpoint: runState.checkpoints[runState.checkpoints.length - 1],
      error: runState.error,
    },
  });
}

/**
 * DELETE /api/hermes?job_id=xxx
 * Cancel/remove a job
 */
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('job_id');

  if (!jobId) {
    return NextResponse.json({
      status: 'failed',
      message: 'Missing job_id parameter',
    }, { status: 400 });
  }

  const deletedFromMemory = runningJobs.delete(jobId);
  let deletedFromStore = false;
  if (runStore && runStoreReady) {
    await runStoreReady;
    deletedFromStore = Boolean(await runStore.get(jobId));
    if (deletedFromStore) {
      await runStore.delete(jobId);
    }
  }

  if (!deletedFromMemory && !deletedFromStore) {
    return NextResponse.json({
      status: 'failed',
      message: `Job ${jobId} not found`,
    }, { status: 404 });
  }

  return NextResponse.json({
    status: 'success',
    message: `Job ${jobId} removed`,
  });
}
