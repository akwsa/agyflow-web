import assert from 'node:assert/strict';
import test from 'node:test';

import { GraphExecutor } from '../../lib/orchestrator/graph.ts';

const graph = {
  name: 'integration-test',
  description: 'Test graph',
  entry: 'one',
  budgets: { totalTokens: 100, totalToolCalls: 10, totalWallClockMs: 10_000 },
  nodes: {
    one: {
      id: 'one',
      name: 'One',
      description: 'One node',
      agent: 'pipeline',
      model: { provider: 'agn', name: 'agnes-3.0-flash' },
      tasks: [{
        name: 'generate',
        description: 'Generate a result',
        files: { input: [], output: ['result.ts'] },
      }],
      budgets: {},
      dependencies: [],
      next: [],
    },
  },
};

test('GraphExecutor executes a dependency join node only once', async () => {
  const diamondGraph = {
    name: 'diamond',
    description: 'Parallel join',
    entry: 'root',
    budgets: { totalTokens: 1000, totalToolCalls: 20, totalWallClockMs: 10_000 },
    nodes: {
      root: { id: 'root', name: 'Root', description: '', agent: 'pipeline', model: { provider: 'agn', name: 'agnes-3.0-flash' }, tasks: [], budgets: {}, dependencies: [], next: ['left', 'right'] },
      left: { id: 'left', name: 'Left', description: '', agent: 'pipeline', model: { provider: 'agn', name: 'agnes-3.0-flash' }, tasks: [], budgets: {}, dependencies: ['root'], next: ['join'] },
      right: { id: 'right', name: 'Right', description: '', agent: 'pipeline', model: { provider: 'agn', name: 'agnes-3.0-flash' }, tasks: [], budgets: {}, dependencies: ['root'], next: ['join'] },
      join: { id: 'join', name: 'Join', description: '', agent: 'pipeline', model: { provider: 'agn', name: 'agnes-3.0-flash' }, tasks: [], budgets: {}, dependencies: ['left', 'right'], next: [] },
    },
  };
  const store = {
    async save() {
      await new Promise(resolve => setTimeout(resolve, 5));
    },
  };

  const result = await new GraphExecutor(diamondGraph, 'run-diamond', {
    dryRun: true,
    store,
  }).execute();

  assert.equal(result.step, 4);
  assert.deepEqual(result.checkpoints.map(checkpoint => checkpoint.nodeId).sort(), [
    'join', 'left', 'right', 'root',
  ]);
});

test('GraphExecutor retries a failed primary model with the configured fallback', async () => {
  const models = [];
  const modelClient = {
    async complete(request) {
      models.push(request.model);
      if (models.length <= 3) {
        throw new Error('primary unavailable');
      }
      return { content: 'fallback result', model: request.model, totalTokens: 5 };
    },
  };
  const fallbackGraph = structuredClone(graph);
  fallbackGraph.nodes.one.model.name = 'agnes-2.5-pro';
  fallbackGraph.nodes.one.model.fallback = 'agn/agnes-3.0-flash';

  const executor = new GraphExecutor(fallbackGraph, 'run-fallback', {
    modelClient,
    dryRun: false,
    retryDelayMs: 0,
  });
  const result = await executor.execute();

  assert.deepEqual(models, [
    'agn/agnes-2.5-pro',
    'agn/agnes-2.5-pro',
    'agn/agnes-3.0-flash',
    'agn/agnes-3.0-flash',
  ]);
  assert.equal(result.status, 'completed');
  assert.equal(result.checkpoints[0].output.tasks[0].content, 'fallback result');
});

test('GraphExecutor calls 9router and persists the completed state', async () => {
  const completionRequests = [];
  const savedStates = [];
  const modelClient = {
    async complete(request) {
      completionRequests.push(request);
      return { content: 'generated result', model: 'agnes-3.0-flash', totalTokens: 7 };
    },
  };
  const store = {
    async save(state) {
      savedStates.push(structuredClone(state));
    },
  };

  const executor = new GraphExecutor(graph, 'run-1', {
    modelClient,
    store,
    dryRun: false,
    projectPath: process.cwd(),
  });
  const result = await executor.execute();

  assert.equal(completionRequests.length, 1);
  assert.equal(completionRequests[0].model, 'agn/agnes-3.0-flash');
  assert.equal(result.status, 'completed');
  assert.equal(result.budgetUsed.tokens, 7);
  assert.equal(result.budgetUsed.toolCalls, 1);
  assert.equal(result.checkpoints[0].output.tasks[0].content, 'generated result');
  assert.equal(savedStates.at(-1).status, 'completed');
});
