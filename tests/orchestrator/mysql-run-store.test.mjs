import assert from 'node:assert/strict';
import test from 'node:test';

import { MySqlRunStore } from '../../lib/orchestrator/mysql-run-store.ts';

const databaseUrl = process.env.DATABASE_URL;

test('MySqlRunStore persists and reloads a run state', { skip: !databaseUrl }, async () => {
  const store = new MySqlRunStore(databaseUrl);
  const runId = `integration-${Date.now()}`;
  const state = {
    runId,
    graphName: 'test-graph',
    status: 'running',
    currentNode: 'infrastructure',
    step: 1,
    startTime: new Date('2026-09-21T00:00:00.000Z'),
    budgetUsed: { tokens: 14, toolCalls: 1, wallClockMs: 20 },
    checkpoints: [{
      step: 1,
      nodeId: 'infrastructure',
      timestamp: new Date('2026-09-21T00:00:01.000Z'),
      output: { content: 'done' },
      budgetSnapshot: { tokens: 14, toolCalls: 1, wallClockMs: 20 },
    }],
  };

  try {
    await store.initialize();
    await store.save(state);
    const loaded = await store.get(runId);

    assert.equal(loaded.runId, state.runId);
    assert.equal(loaded.status, 'running');
    assert.equal(loaded.startTime.toISOString(), state.startTime.toISOString());
    assert.equal(loaded.checkpoints[0].timestamp.toISOString(), state.checkpoints[0].timestamp.toISOString());
    assert.deepEqual(loaded.budgetUsed, state.budgetUsed);
  } finally {
    await store.delete(runId);
    await store.close();
  }
});
