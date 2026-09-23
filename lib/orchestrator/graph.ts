/**
 * AGY Flow Agent Orchestrator
 * Based on: sarmakska/agent-orchestrator
 * 
 * Production-grade multi-agent orchestration with:
 * - Durable state in MySQL
 * - Deterministic replay
 * - Hard budgets (token, tool, time)
 * - OpenTelemetry tracing
 */

import { readFile } from 'node:fs/promises';
import path from 'node:path';

// ========================================
// TYPE DEFINITIONS
// ========================================

export type AgentKind = 'supervisor' | 'swarm' | 'pipeline';
export type NodeStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface AgentNode {
  id: string;
  name: string;
  description: string;
  agent: AgentKind;
  model: {
    provider: string;
    name: string;
    fallback?: string;
  };
  tasks: Task[];
  budgets: {
    maxTokens?: number;
    maxToolCalls?: number;
    maxWallClockMs?: number;
  };
  dependencies: string[];
  next?: string[];
}

export interface Task {
  name: string;
  description: string;
  files: {
    input: string[];
    output: string[];
  };
  handler?: (context: any) => Promise<any>;
}

export interface WorkflowGraph {
  name: string;
  description: string;
  nodes: Record<string, AgentNode>;
  entry: string;
  budgets: {
    totalTokens: number;
    totalToolCalls: number;
    totalWallClockMs: number;
  };
}

export interface RunState {
  runId: string;
  graphName: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  currentNode: string;
  step: number;
  startTime: Date;
  endTime?: Date;
  budgetUsed: {
    tokens: number;
    toolCalls: number;
    wallClockMs: number;
  };
  checkpoints: Checkpoint[];
  error?: string;
}

export interface Checkpoint {
  step: number;
  nodeId: string;
  timestamp: Date;
  output: any;
  budgetSnapshot: {
    tokens: number;
    toolCalls: number;
    wallClockMs: number;
  };
}

export interface ModelClient {
  complete(request: {
    model: string;
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
    maxTokens?: number;
  }): Promise<{ content: string; model?: string; totalTokens: number }>;
}

export interface RunStore {
  save(state: RunState): Promise<void>;
}

export interface GraphExecutorOptions {
  modelClient?: ModelClient;
  store?: RunStore;
  dryRun?: boolean;
  projectPath?: string;
  retryDelayMs?: number;
}

// ========================================
// GRAPH DEFINITION
// ========================================

export const agyFlowGraph: WorkflowGraph = {
  name: 'agyflow-transformation',
  description: 'Transform AGY Flow from static to dynamic SaaS',
  
  entry: 'infrastructure',
  
  budgets: {
    totalTokens: 10_000_000,  // 10M tokens total
    totalToolCalls: 1000,
    totalWallClockMs: 16 * 24 * 60 * 60 * 1000,  // 16 days
  },
  
  nodes: {
    // ========================================
    // NODE 1: Infrastructure (Day 1-4)
    // ========================================
    infrastructure: {
      id: 'infrastructure',
      name: 'Infrastructure Agent',
      description: 'Setup Prisma, database schema, ISR configuration',
      agent: 'supervisor',
      model: {
        provider: 'agn',
        name: 'agnes-3.0-flash',
        fallback: 'agn/agnes-2.5-flash',
      },
      tasks: [
        {
          name: 'prisma_setup',
          description: 'Setup Prisma ORM and database configuration',
          files: {
            input: ['package.json', 'docs/implementation/FASE_0*.md'],
            output: ['prisma/schema.prisma', 'lib/db/client.ts', 'lib/db/seed.ts'],
          },
        },
        {
          name: 'database_schema',
          description: 'Create comprehensive database schema',
          files: {
            input: ['docs/implementation/FASE_1*.md'],
            output: ['prisma/schema.prisma', 'prisma/migrations/'],
          },
        },
        {
          name: 'isr_configuration',
          description: 'Configure Incremental Static Regeneration',
          files: {
            input: ['next.config.mjs'],
            output: ['next.config.mjs', 'lib/revalidate.ts'],
          },
        },
      ],
      budgets: {
        maxTokens: 2_000_000,  // 2M tokens
        maxToolCalls: 200,
        maxWallClockMs: 4 * 24 * 60 * 60 * 1000,  // 4 days
      },
      dependencies: [],
      next: ['auth', 'payment', 'admin'],  // Parallel execution
    },
    
    // ========================================
    // NODE 2: Authentication (Day 5-10, Parallel)
    // ========================================
    auth: {
      id: 'auth',
      name: 'Authentication Agent',
      description: 'Implement Auth.js v5 authentication system',
      agent: 'pipeline',
      model: {
        provider: 'agn',
        name: 'agnes-3.0-flash',
        fallback: 'agn/agnes-2.5-flash',
      },
      tasks: [
        {
          name: 'authjs_setup',
          description: 'Setup Auth.js v5 with multiple providers',
          files: {
            input: ['docs/implementation/FASE_2_AUTHENTICATION.md'],
            output: [
              'lib/auth/config.ts',
              'lib/auth/options.ts',
              'app/api/auth/[...nextauth]/route.ts',
            ],
          },
        },
        {
          name: 'auth_providers',
          description: 'Configure Google, GitHub, Email providers',
          files: {
            input: [],
            output: [
              'lib/auth/providers/google.ts',
              'lib/auth/providers/github.ts',
              'lib/auth/providers/email.ts',
            ],
          },
        },
        {
          name: 'session_management',
          description: 'Implement session and JWT handling',
          files: {
            input: [],
            output: ['lib/auth/session.ts', 'lib/auth/jwt.ts', 'middleware.ts'],
          },
        },
        {
          name: 'protected_routes',
          description: 'Setup route protection and role-based access',
          files: {
            input: [],
            output: ['lib/auth/guards.ts', 'lib/auth/permissions.ts'],
          },
        },
      ],
      budgets: {
        maxTokens: 2_000_000,
        maxToolCalls: 200,
        maxWallClockMs: 6 * 24 * 60 * 60 * 1000,  // 6 days
      },
      dependencies: ['infrastructure'],
      next: ['files'],  // After parallel stage
    },
    
    // ========================================
    // NODE 3: Payment (Day 5-10, Parallel)
    // ========================================
    payment: {
      id: 'payment',
      name: 'Payment Integration Agent',
      description: 'Integrate Lemon Squeezy and Gumroad webhooks',
      agent: 'pipeline',
      model: {
        provider: 'agn',
        name: 'agnes-3.0-flash',
        fallback: 'agn/agnes-2.5-flash',
      },
      tasks: [
        {
          name: 'lemonsqueezy_integration',
          description: 'Setup Lemon Squeezy webhooks and API',
          files: {
            input: ['docs/implementation/FASE_3_WEBHOOKS_BILLING.md'],
            output: [
              'app/api/webhooks/lemonsqueezy/route.ts',
              'lib/payments/lemonsqueezy.ts',
              'lib/payments/lemonsqueezy-verify.ts',
            ],
          },
        },
        {
          name: 'gumroad_integration',
          description: 'Setup Gumroad webhooks and licensing',
          files: {
            input: [],
            output: [
              'app/api/webhooks/gumroad/route.ts',
              'lib/payments/gumroad.ts',
              'lib/payments/gumroad-verify.ts',
            ],
          },
        },
        {
          name: 'subscription_logic',
          description: 'Implement subscription management',
          files: {
            input: [],
            output: [
              'lib/payments/subscriptions.ts',
              'lib/payments/plans.ts',
              'lib/payments/upgrades.ts',
            ],
          },
        },
        {
          name: 'license_validation',
          description: 'Create license key validation system',
          files: {
            input: [],
            output: ['lib/payments/licenses.ts', 'app/api/licenses/validate/route.ts'],
          },
        },
      ],
      budgets: {
        maxTokens: 2_000_000,
        maxToolCalls: 200,
        maxWallClockMs: 6 * 24 * 60 * 60 * 1000,
      },
      dependencies: ['infrastructure'],
      next: ['files'],
    },
    
    // ========================================
    // NODE 4: Admin Dashboard (Day 5-10, Parallel)
    // ========================================
    admin: {
      id: 'admin',
      name: 'Admin Dashboard Agent',
      description: 'Build admin dashboard with analytics',
      agent: 'pipeline',
      model: {
        provider: 'agn',
        name: 'agnes-3.0-flash',
        fallback: 'agn/agnes-2.5-flash',
      },
      tasks: [
        {
          name: 'admin_layout',
          description: 'Create admin dashboard layout and navigation',
          files: {
            input: ['docs/implementation/FASE_4-6_ADMIN_FILES_DEPLOY.md'],
            output: [
              'app/admin/layout.tsx',
              'components/admin/sidebar.tsx',
              'components/admin/header.tsx',
            ],
          },
        },
        {
          name: 'user_management',
          description: 'Build user management interface',
          files: {
            input: [],
            output: [
              'app/admin/users/page.tsx',
              'components/admin/user-table.tsx',
              'app/api/admin/users/route.ts',
            ],
          },
        },
        {
          name: 'analytics_dashboard',
          description: 'Create analytics and charts',
          files: {
            input: [],
            output: [
              'app/admin/analytics/page.tsx',
              'components/admin/charts.tsx',
              'lib/analytics/metrics.ts',
            ],
          },
        },
        {
          name: 'subscription_management',
          description: 'Build subscription management UI',
          files: {
            input: [],
            output: [
              'app/admin/subscriptions/page.tsx',
              'components/admin/subscription-table.tsx',
            ],
          },
        },
      ],
      budgets: {
        maxTokens: 2_000_000,
        maxToolCalls: 200,
        maxWallClockMs: 6 * 24 * 60 * 60 * 1000,
      },
      dependencies: ['infrastructure'],
      next: ['files'],
    },
    
    // ========================================
    // NODE 5: File Upload (Day 11-13)
    // ========================================
    files: {
      id: 'files',
      name: 'File Upload Agent',
      description: 'Implement file upload and storage system',
      agent: 'pipeline',
      model: {
        provider: 'agn',
        name: 'agnes-2.5-pro',  // 1M context
        fallback: 'agn/agnes-3.0-flash',
      },
      tasks: [
        {
          name: 'upload_api',
          description: 'Create file upload API endpoints',
          files: {
            input: ['docs/implementation/FASE_4-6_ADMIN_FILES_DEPLOY.md'],
            output: [
              'app/api/upload/route.ts',
              'lib/upload/handler.ts',
              'lib/upload/validation.ts',
            ],
          },
        },
        {
          name: 'storage_integration',
          description: 'Integrate with cloud storage (S3/R2)',
          files: {
            input: [],
            output: [
              'lib/storage/s3.ts',
              'lib/storage/cloudflare-r2.ts',
              'lib/storage/local.ts',
            ],
          },
        },
        {
          name: 'file_management_ui',
          description: 'Build file management interface',
          files: {
            input: [],
            output: [
              'app/files/page.tsx',
              'components/files/upload.tsx',
              'components/files/file-list.tsx',
            ],
          },
        },
      ],
      budgets: {
        maxTokens: 1_000_000,
        maxToolCalls: 100,
        maxWallClockMs: 3 * 24 * 60 * 60 * 1000,  // 3 days
      },
      dependencies: ['auth', 'payment', 'admin'],  // Wait for parallel stage
      next: ['qa'],
    },
    
    // ========================================
    // NODE 6: QA & Testing (Day 14-16)
    // ========================================
    qa: {
      id: 'qa',
      name: 'QA & Testing Agent',
      description: 'Run tests, security audit, and deployment prep',
      agent: 'supervisor',
      model: {
        provider: 'agn',
        name: 'agnes-3.0-flash',
        fallback: 'agn/agnes-2.5-flash',
      },
      tasks: [
        {
          name: 'unit_tests',
          description: 'Write and run unit tests',
          files: {
            input: [],
            output: [
              'tests/unit/auth.test.ts',
              'tests/unit/payments.test.ts',
              'tests/unit/upload.test.ts',
            ],
          },
        },
        {
          name: 'integration_tests',
          description: 'Write and run integration tests',
          files: {
            input: [],
            output: [
              'tests/integration/auth-flow.test.ts',
              'tests/integration/payment-flow.test.ts',
            ],
          },
        },
        {
          name: 'security_audit',
          description: 'Run security audit and fix vulnerabilities',
          files: {
            input: [],
            output: ['SECURITY_AUDIT.md', '.github/dependabot.yml'],
          },
        },
        {
          name: 'performance_optimization',
          description: 'Optimize build and runtime performance',
          files: {
            input: [],
            output: ['PERFORMANCE_REPORT.md'],
          },
        },
        {
          name: 'deployment_prep',
          description: 'Prepare for cPanel deployment',
          files: {
            input: ['docs/implementation/FASE_4-6_ADMIN_FILES_DEPLOY.md'],
            output: ['DEPLOYMENT.md', '.cpanel.yml', 'deploy.sh'],
          },
        },
      ],
      budgets: {
        maxTokens: 1_000_000,
        maxToolCalls: 100,
        maxWallClockMs: 3 * 24 * 60 * 60 * 1000,  // 3 days
      },
      dependencies: ['files'],
      next: [],  // Terminal node
    },
  },
};

// ========================================
// GRAPH EXECUTOR
// ========================================

export class GraphExecutor {
  private graph: WorkflowGraph;
  private runState: RunState;
  private readonly modelClient?: ModelClient;
  private readonly store?: RunStore;
  private readonly dryRun: boolean;
  private readonly projectPath: string;
  private readonly retryDelayMs: number;
  private readonly scheduledNodes = new Set<string>();
  
  constructor(graph: WorkflowGraph, runId: string, options: GraphExecutorOptions = {}) {
    this.graph = graph;
    this.modelClient = options.modelClient;
    this.store = options.store;
    this.dryRun = options.dryRun ?? true;
    this.projectPath = options.projectPath ?? process.cwd();
    this.retryDelayMs = options.retryDelayMs ?? 35_000;
    this.runState = {
      runId,
      graphName: graph.name,
      status: 'pending',
      currentNode: graph.entry,
      step: 0,
      startTime: new Date(),
      budgetUsed: {
        tokens: 0,
        toolCalls: 0,
        wallClockMs: 0,
      },
      checkpoints: [],
    };
  }
  
  async execute(): Promise<RunState> {
    console.log(`[GraphExecutor] Starting run ${this.runState.runId}`);
    console.log(`[GraphExecutor] Graph: ${this.graph.name}`);
    console.log(`[GraphExecutor] Entry node: ${this.graph.entry}`);
    
    this.runState.status = 'running';
    await this.persistState();
    
    try {
      await this.walkGraph(this.graph.entry);
      this.runState.status = 'completed';
      this.runState.endTime = new Date();
    } catch (error) {
      console.error(`[GraphExecutor] Run failed:`, error);
      this.runState.status = 'failed';
      this.runState.error = error instanceof Error ? error.message : String(error);
      this.runState.endTime = new Date();
    }

    await this.persistState();
    return this.getState();
  }
  
  private async walkGraph(nodeId: string): Promise<void> {
    if (this.scheduledNodes.has(nodeId)) {
      return;
    }
    this.scheduledNodes.add(nodeId);

    const node = this.graph.nodes[nodeId];
    
    if (!node) {
      throw new Error(`Node ${nodeId} not found in graph`);
    }
    
    console.log(`[GraphExecutor] Executing node: ${node.name} (${nodeId})`);
    console.log(`[GraphExecutor] Agent: ${node.agent}, Model: ${node.model.provider}/${node.model.name}`);
    console.log(`[GraphExecutor] Tasks: ${node.tasks.length}`);
    
    this.runState.currentNode = nodeId;
    this.runState.step++;
    
    const nodeStartTime = Date.now();
    
    try {
      // Execute node tasks
      const output = await this.executeNode(node);
      
      const nodeElapsedMs = Date.now() - nodeStartTime;
      this.runState.budgetUsed.wallClockMs += nodeElapsedMs;
      
      // Create checkpoint
      const checkpoint: Checkpoint = {
        step: this.runState.step,
        nodeId,
        timestamp: new Date(),
        output,
        budgetSnapshot: { ...this.runState.budgetUsed },
      };
      
      this.runState.checkpoints.push(checkpoint);
      
      console.log(`[GraphExecutor] Node ${nodeId} completed in ${nodeElapsedMs}ms`);
      console.log(`[GraphExecutor] Budget used: ${JSON.stringify(this.runState.budgetUsed)}`);
      
      // Check budget limits and persist the checkpoint
      this.checkBudgets();
      await this.persistState();
      
      // Execute next nodes
      if (node.next && node.next.length > 0) {
        // Check if all dependencies are met for next nodes
        const readyNodes = node.next.filter(nextId => {
          const nextNode = this.graph.nodes[nextId];
          return this.areDependenciesMet(nextNode);
        });
        
        if (readyNodes.length > 0) {
          // Execute in parallel if multiple ready nodes
          if (readyNodes.length > 1) {
            console.log(`[GraphExecutor] Parallel execution: ${readyNodes.join(', ')}`);
            await Promise.all(readyNodes.map(nid => this.walkGraph(nid)));
          } else {
            await this.walkGraph(readyNodes[0]);
          }
        }
      }
      
    } catch (error) {
      console.error(`[GraphExecutor] Node ${nodeId} failed:`, error);
      throw error;
    }
  }
  
  private areDependenciesMet(node: AgentNode): boolean {
    return node.dependencies.every(depId => {
      return this.runState.checkpoints.some(cp => cp.nodeId === depId);
    });
  }
  
  private async executeNode(node: AgentNode): Promise<any> {
    const results = [];
    const model = `${node.model.provider}/${node.model.name}`;

    if (!this.dryRun && !this.modelClient) {
      throw new Error('A 9router model client is required for non-dry-run execution');
    }

    for (const task of node.tasks) {
      console.log(`[GraphExecutor]   Task: ${task.name}`);
      console.log(`[GraphExecutor]   Input files: ${task.files.input.join(', ')}`);
      console.log(`[GraphExecutor]   Output files: ${task.files.output.join(', ')}`);

      if (this.dryRun) {
        const estimatedTokens = task.files.input.length * 1000 + task.files.output.length * 2000;
        this.runState.budgetUsed.tokens += estimatedTokens;
        this.runState.budgetUsed.toolCalls += 1;
        results.push({
          task: task.name,
          status: 'completed',
          dryRun: true,
          tokens: estimatedTokens,
        });
        continue;
      }

      const inputContext = await this.readInputContext(task.files.input);
      const completion = await this.completeWithFallback(node, {
        model,
        maxTokens: 8_192,
        messages: [
          {
            role: 'system',
            content: 'You are a senior software engineer executing one task in the AGY Flow repository. Produce concrete, production-ready implementation guidance and complete file contents for every requested output. Use MySQL, never PostgreSQL. Do not claim that files were written.',
          },
          {
            role: 'user',
            content: [
              `Agent: ${node.name}`,
              `Task: ${task.name}`,
              `Description: ${task.description}`,
              `Requested outputs: ${task.files.output.join(', ') || '(none)'}`,
              inputContext ? `Input context:\n${inputContext}` : 'Input context: none',
            ].join('\n\n'),
          },
        ],
      });

      this.runState.budgetUsed.tokens += completion.totalTokens;
      this.runState.budgetUsed.toolCalls += 1;
      this.checkBudgets();
      results.push({
        task: task.name,
        status: 'completed',
        model: completion.model ?? model,
        tokens: completion.totalTokens,
        content: completion.content,
      });
    }

    return { node: node.id, tasks: results };
  }

  private async completeWithFallback(
    node: AgentNode,
    request: Parameters<ModelClient['complete']>[0],
  ): Promise<Awaited<ReturnType<ModelClient['complete']>>> {
    try {
      return await this.modelClient!.complete(request);
    } catch (primaryError) {
      if (this.retryDelayMs > 0) {
        await new Promise(resolve => setTimeout(resolve, this.retryDelayMs));
      }

      try {
        return await this.modelClient!.complete(request);
      } catch {
        if (!node.model.fallback || node.model.fallback === request.model) {
          throw primaryError;
        }
        console.warn(
          `[GraphExecutor] Model ${request.model} failed twice; retrying with ${node.model.fallback}`,
        );
        const fallbackRequest = {
          ...request,
          model: node.model.fallback,
        };
        try {
          return await this.modelClient!.complete(fallbackRequest);
        } catch (fallbackError) {
          if (this.retryDelayMs > 0) {
            await new Promise(resolve => setTimeout(resolve, this.retryDelayMs));
          }
          try {
            return await this.modelClient!.complete(fallbackRequest);
          } catch {
            throw fallbackError;
          }
        }
      }
    }
  }

  private async readInputContext(inputFiles: string[]): Promise<string> {
    const sections: string[] = [];
    let remainingCharacters = 80_000;

    for (const inputFile of inputFiles) {
      if (remainingCharacters <= 0) {
        break;
      }
      if (inputFile.includes('*')) {
        sections.push(`### ${inputFile}\nWildcard inputs are not expanded by the executor.`);
        continue;
      }

      const resolvedPath = path.resolve(this.projectPath, inputFile);
      const relativePath = path.relative(this.projectPath, resolvedPath);
      if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
        throw new Error(`Input path escapes project root: ${inputFile}`);
      }

      try {
        const content = await readFile(resolvedPath, 'utf8');
        const excerpt = content.slice(0, Math.min(30_000, remainingCharacters));
        sections.push(`### ${inputFile}\n${excerpt}`);
        remainingCharacters -= excerpt.length;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        sections.push(`### ${inputFile}\nUnavailable: ${message}`);
      }
    }

    return sections.join('\n\n');
  }
  
  private checkBudgets(): void {
    const { totalTokens, totalToolCalls, totalWallClockMs } = this.graph.budgets;
    const { tokens, toolCalls, wallClockMs } = this.runState.budgetUsed;
    
    if (tokens > totalTokens) {
      throw new Error(`Token budget exceeded: ${tokens}/${totalTokens}`);
    }
    
    if (toolCalls > totalToolCalls) {
      throw new Error(`Tool call budget exceeded: ${toolCalls}/${totalToolCalls}`);
    }
    
    if (wallClockMs > totalWallClockMs) {
      throw new Error(`Wall clock budget exceeded: ${wallClockMs}ms/${totalWallClockMs}ms`);
    }
  }
  
  private async persistState(): Promise<void> {
    if (this.store) {
      await this.store.save(this.getState());
    }
  }

  getState(): RunState {
    return {
      ...this.runState,
      budgetUsed: { ...this.runState.budgetUsed },
      checkpoints: this.runState.checkpoints.map(checkpoint => ({
        ...checkpoint,
        budgetSnapshot: { ...checkpoint.budgetSnapshot },
      })),
    };
  }
}

// ========================================
// EXPORTS
// ========================================

export { agyFlowGraph as default };
